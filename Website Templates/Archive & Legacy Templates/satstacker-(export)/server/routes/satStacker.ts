import { Router, Request, Response } from 'express';
import { BigNumber } from 'bignumber.js';
import { getDbPool } from '../db.js';

// Configure bignumber.js to truncate with strict ROUND_DOWN setting to replicate solid integer math behavior
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });

const router = Router();

/**
 * 1. POST /v1/stack/manual
 * Ingests userId and satsAmount.
 * Safe conversion under database locks with strict BigNumber scaling to eliminate floating-point precision leaks.
 */
router.post('/manual', async (req: Request, res: Response): Promise<void> => {
  const { userId, satsAmount } = req.body || {};

  if (!userId || satsAmount === undefined || satsAmount === null) {
    res.status(400).json({
      status: 'error',
      message: 'Required params missing: userId and satsAmount'
    });
    return;
  }

  const start = process.hrtime();
  const pool = getDbPool();
  const client = await pool.connect();

  try {
    // 1. Configure and validate high-precision integers with round down
    const safeSats = new BigNumber(satsAmount).integerValue(BigNumber.ROUND_DOWN);
    if (safeSats.isLessThan(0) || safeSats.isNaN() || !safeSats.isFinite()) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid satsAmount value parsed, must represent a non-negative number'
      });
      client.release();
      return;
    }

    // 2. Convert raw Satoshis into exact Bitcoin decimals (Sats = BTC * 10^8)
    const addedBtcStr = safeSats.dividedBy(100000000).toFixed(8, BigNumber.ROUND_DOWN);

    await client.query('BEGIN');

    // Verify user exists prior to adding balances
    const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({
        status: 'error',
        message: `User ledger verification failed; ID ${userId} does not exist.`
      });
      client.release();
      return;
    }

    // Lock individual row on portfolios via FOR UPDATE to prevent split-second dual handshakes
    const portfolioRes = await client.query(
      'SELECT total_btc, total_sats FROM portfolios WHERE user_id = $1 FOR UPDATE',
      [userId]
    );

    let activeBtcStr = '0.00000000';
    let exists = false;

    if (portfolioRes.rows.length > 0) {
      activeBtcStr = portfolioRes.rows[0].total_btc || '0.00000000';
      exists = true;
    }

    // Formulate final BTC and save back to DB via strict strings (the db trigger sync_btc_to_sats will re-align SATS)
    const currentBtcDec = new BigNumber(activeBtcStr);
    const addedBtcDec = new BigNumber(addedBtcStr);
    const nextBtcStr = currentBtcDec.plus(addedBtcDec).toFixed(8, BigNumber.ROUND_DOWN);

    let savedRow;
    if (exists) {
      savedRow = await client.query(
        'UPDATE portfolios SET total_btc = $1::numeric(16,8) WHERE user_id = $2 RETURNING total_btc, total_sats',
        [nextBtcStr, userId]
      );
    } else {
      savedRow = await client.query(
        'INSERT INTO portfolios (user_id, total_btc) VALUES ($1, $2::numeric(16,8)) RETURNING total_btc, total_sats',
        [userId, nextBtcStr]
      );
    }

    await client.query('COMMIT');

    const diff = process.hrtime(start);
    const latencyMs = (diff[0] * 1000 + diff[1] / 1000000).toFixed(2);

    res.status(200).json({
      status: 'success',
      holdings: {
        totalBtc: parseFloat(savedRow.rows[0].total_btc),
        totalSats: parseInt(savedRow.rows[0].total_sats, 10),
        satsAdded: safeSats.toString(),
        btcAdded: addedBtcStr
      },
      latency: `${latencyMs}ms`
    });

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Core Stacker ledger update transaction aborted:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to complete ledger update transaction',
      details: error.message || error
    });
  } finally {
    client.release();
  }
});

/**
 * 2. POST /v1/webhooks/stripe
 * Stripe endpoint processing 'checkout.session.completed' and 'customer.subscription.deleted'.
 * Grant shields (3 free tokens for pro, 10 for whale) or gracefully downgrade users to free mode.
 */
router.post('/stripe', async (req: Request, res: Response): Promise<void> => {
  const event = req.body;

  if (!event || !event.type || !event.data || !event.data.object) {
    res.status(400).json({
      status: 'error',
      message: 'Stripped or malformed hook payload received'
    });
    return;
  }

  const pool = getDbPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userEmail = session.customer_details?.email || session.customer_email || session.metadata?.email;
      const priceId = session.metadata?.priceId || session.line_items?.data?.[0]?.price?.id || '';

      if (!userEmail) {
        throw new Error('Could not resolve user email from Stripe session context');
      }

      // Check tier type based on custom system product ids or standard configured strings
      let tier: 'pro' | 'whale' = 'pro';
      let grantShieldTokens = 3;

      if (priceId.toLowerCase().includes('whale') || session.metadata?.tier === 'whale') {
        tier = 'whale';
        grantShieldTokens = 10;
      }

      // Verify and lock users row
      const userRes = await client.query(
        'SELECT id, tier FROM users WHERE email = $1 FOR UPDATE',
        [userEmail]
      );

      if (userRes.rows.length === 0) {
        // Create user placeholder records so payments never fail on race conditions 
        const insertUser = await client.query(
          'INSERT INTO users (email, tier) VALUES ($1, $2) RETURNING id',
          [userEmail, tier]
        );
        const newUserId = insertUser.rows[0].id;

        // Upsert tokens in user_streaks
        await client.query(
          'INSERT INTO user_streaks (user_id, freeze_tokens_available) VALUES ($1, $2)',
          [newUserId, grantShieldTokens]
        );
      } else {
        const userId = userRes.rows[0].id;

        // Update active class
        await client.query(
          'UPDATE users SET tier = $1 WHERE id = $2',
          [tier, userId]
        );

        // Add shields credit to client
        await client.query(`
          INSERT INTO user_streaks (user_id, freeze_tokens_available)
          VALUES ($1, $2)
          ON CONFLICT (user_id)
          DO UPDATE SET 
            freeze_tokens_available = user_streaks.freeze_tokens_available + EXCLUDED.freeze_tokens_available,
            updated_at = CURRENT_TIMESTAMP
        `, [userId, grantShieldTokens]);
      }

      await client.query('COMMIT');
      res.status(200).json({
        status: 'processed',
        event: 'checkout.session.completed',
        user: userEmail,
        tierGranted: tier,
        tokensGranted: grantShieldTokens
      });

    } else if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const customerEmail = subscription.customer_email || subscription.metadata?.email;

      if (!customerEmail) {
        // Fallback checks: If no emails on subscriptions, check if stripe Customer ID is stored or query users from db
        const customerId = subscription.customer;
        if (customerId) {
          // Attempt mapping via common customer references if necessary, or check db directly
          console.log(`Gracefully looking up user with Stripe Customer ${customerId}`);
        }
        throw new Error('No user metadata found on subscription deletion payload');
      }

      const userRes = await client.query(
        'SELECT id FROM users WHERE email = $1 FOR UPDATE',
        [customerEmail]
      );

      if (userRes.rows.length > 0) {
        const userId = userRes.rows[0].id;

        // Revert subscriber back to standard tier
        await client.query(
          "UPDATE users SET tier = 'free' WHERE id = $1",
          [userId]
        );
      }

      await client.query('COMMIT');
      res.status(200).json({
        status: 'processed',
        event: 'customer.subscription.deleted',
        user: customerEmail,
        downgradedTo: 'free'
      });

    } else {
      // Unhandled events are ignored gracefully without throwing error conditions
      await client.query('COMMIT');
      res.status(200).json({
        status: 'ignored',
        reason: 'Event type not matching targeted stripe payment workflows'
      });
    }

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Webhook processing aborted:', error);
    res.status(500).json({
      status: 'error',
      message: 'Transaction rollback during Stripe webhook parsing',
      details: error.message || error
    });
  } finally {
    client.release();
  }
});

export default router;
