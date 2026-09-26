/**
 * Pizzeria Bella Nera - Web Agency Integration & Form Configuration
 * 
 * Customize this config block to easily plug forms into:
 * - Netlify Forms (post to action path)
 * - Formspree (custom form submission URLs)
 * - OpenTable / Resy / SevenRooms (external booking links)
 * - Custom developer Webhooks (REST APIs)
 */
export const WEB_AGENCY_FORM_CONFIG = {
  // --- ORDER FORM PLUG-IN CONFIG ---
  orderForm: {
    // Options: 'local-only' (fully-interactive local tracker), 'formspree', 'netlify', 'custom-webhook'
    integrationType: 'local-only' as 'local-only' | 'formspree' | 'netlify' | 'custom-webhook',
    
    // Formspree API URL (e.g. 'https://formspree.io/f/mknpqrst')
    formspreeUrl: '',
    
    // Custom endpoint for internal checkout webhooks
    customWebhookUrl: '',
    
    // Netlify form name attribute (for automatic Netlify form crawlers)
    netlifyFormName: 'bella-nera-order-delivery',
  },

  // --- RESERVATION WIDGET PLUG-IN CONFIG ---
  reservation: {
    // Options: 'local-only' (in-app printed receipt voucher), 'formspree', 'netlify', 'opentable', 'custom-webhook'
    integrationType: 'local-only' as 'local-only' | 'formspree' | 'netlify' | 'opentable' | 'custom-webhook',

    // OpenTable or Resy booking link (e.g. 'https://www.opentable.com/restaurant/profile/12345/reserve')
    opentableUrl: '',

    // Formspree API URL (e.g. 'https://formspree.io/f/xyzabcde')
    formspreeUrl: '',

    // Custom endpoint for table booking Webhook
    customWebhookUrl: '',

    // Netlify form name attribute
    netlifyFormName: 'bella-nera-table-reservations',
  }
};

/**
 * Utility helper to fire dynamic network submissions depending on configuration.
 */
export async function submitFormToConfiguredService(
  formType: 'order' | 'reservation',
  payload: Record<string, any>
): Promise<{ success: boolean; message: string }> {
  const config = formType === 'order' ? WEB_AGENCY_FORM_CONFIG.orderForm : WEB_AGENCY_FORM_CONFIG.reservation;

  if (config.integrationType === 'local-only') {
    // Mock short-latency local success
    await new Promise(resolve => setTimeout(resolve, 600));
    return { success: true, message: 'Local success simulation completed.' };
  }

  if (config.integrationType === 'netlify') {
    try {
      const body = new URLSearchParams();
      body.append('form-name', config.netlifyFormName);
      Object.entries(payload).forEach(([key, val]) => {
        body.append(key, typeof val === 'object' ? JSON.stringify(val) : String(val));
      });

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (response.ok) {
        return { success: true, message: 'Successfully transmitted to Netlify Forms.' };
      } else {
        throw new Error(`Netlify post returned status ${response.status}`);
      }
    } catch (err: any) {
      return { success: false, message: `Netlify post failed: ${err.message}` };
    }
  }

  if (config.integrationType === 'formspree') {
    const url = config.formspreeUrl;
    if (!url) {
      return { success: false, message: 'Formspree integration failed: URL endpoint empty.' };
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        return { success: true, message: 'Successfully transmitted to Formspree.' };
      } else {
        throw new Error(`Formspree returned status ${response.status}`);
      }
    } catch (err: any) {
      return { success: false, message: `Formspree post failed: ${err.message}` };
    }
  }

  if (config.integrationType === 'custom-webhook') {
    const url = config.customWebhookUrl;
    if (!url) {
      return { success: false, message: 'Custom webhook integration failed: webhook URL empty.' };
    }
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        return { success: true, message: 'Successfully transmitted to webhook API.' };
      } else {
        throw new Error(`Webhook API returned status ${response.status}`);
      }
    } catch (err: any) {
      return { success: false, message: `Webhook post failed: ${err.message}` };
    }
  }

  return { success: true, message: 'Bypassed with standard flow.' };
}
