/**
 * GhostFactoryOS × Aura & Grid License Matrix
 * 
 * Defines the canonical three-tier licensing framework:
 * 1. Standard: Non-exclusive, perpetual, unlimited end-client use.
 * 2. Pro: Non-exclusive, includes updates, multi-seat commercial access.
 * 3. Exclusive Buyout: Removes the asset from sale; only offered when the asset is NOT marked permanent.
 */

export type LicenseType = 'standard' | 'pro' | 'exclusive_buyout';

export interface LicenseDefinition {
  type: LicenseType;
  name: string;
  exclusivity: 'non-exclusive' | 'exclusive';
  term: string;
  rights: string;
  description: string;
  includesUpdates: boolean;
  removesFromSale: boolean;
  requiresNotPermanent: boolean;
}

export const LICENSE_MATRIX: Record<LicenseType, LicenseDefinition> = {
  standard: {
    type: 'standard',
    name: 'Standard',
    exclusivity: 'non-exclusive',
    term: 'Perpetual',
    rights: 'Unlimited end-client use',
    description: 'Non-exclusive, perpetual license with unlimited end-client use.',
    includesUpdates: false,
    removesFromSale: false,
    requiresNotPermanent: false,
  },
  pro: {
    type: 'pro',
    name: 'Pro',
    exclusivity: 'non-exclusive',
    term: 'Perpetual with updates',
    rights: 'Includes updates & multi-seat agency access',
    description: 'Non-exclusive commercial license with multi-seat access and includes updates.',
    includesUpdates: true,
    removesFromSale: false,
    requiresNotPermanent: false,
  },
  exclusive_buyout: {
    type: 'exclusive_buyout',
    name: 'Exclusive Buyout',
    exclusivity: 'exclusive',
    term: 'Asset Purchase Agreement (APA)',
    rights: 'Exclusive IP ownership & source transfer',
    description: 'Removes the asset from sale; only offered when the asset is NOT marked permanent.',
    includesUpdates: true,
    removesFromSale: true,
    requiresNotPermanent: true,
  },
};

export const LICENSE_TIERS: LicenseDefinition[] = [
  LICENSE_MATRIX.standard,
  LICENSE_MATRIX.pro,
  LICENSE_MATRIX.exclusive_buyout,
];

export interface BlueprintPricing {
  standardPrice: string;
  proPrice: string;
  buyoutPrice?: string;
  buyoutAnchor?: string;
  buyoutRange?: string;
  isBuyoutEligible: boolean;
}

/**
 * Derives compliant license pricing and availability for any blueprint.
 * If buyoutEligible is false (or permanent is true), buyout pricing is strictly omitted.
 */
export function getBlueprintPricing(product: {
  id: number;
  pricing_track?: string;
  flagship_qualified?: boolean;
  buyoutEligible: boolean;
  permanent?: boolean;
  exclusive_buyout_anchor?: number;
  exclusive_buyout_range?: number[];
}): BlueprintPricing {
  const isTrack2 = product.pricing_track?.includes('Track 1') ? false : (Boolean(product.flagship_qualified) || (product.pricing_track?.includes('Track 2') ?? false) || (product.id >= 86 && product.id !== 112));

  const standardPrice = isTrack2 ? '$2,500 USD Avg' : '$199 USD';
  const proPrice = isTrack2 ? '$3,500 USD' : '$599 USD';

  const isBuyoutEligible = Boolean(product.buyoutEligible && !product.permanent);

  if (!isBuyoutEligible) {
    return {
      standardPrice,
      proPrice,
      buyoutPrice: undefined,
      buyoutAnchor: undefined,
      buyoutRange: undefined,
      isBuyoutEligible: false,
    };
  }

  if (isTrack2) {
    const anchor = product.exclusive_buyout_anchor ? `$${product.exclusive_buyout_anchor.toLocaleString()} USD` : '$14,500 USD';
    const range = product.exclusive_buyout_range ? `$${Math.round((product.exclusive_buyout_range[0] + product.exclusive_buyout_range[1]) / 2).toLocaleString()} Buyout Avg` : '$14,000 Buyout Avg';
    return {
      standardPrice,
      proPrice,
      buyoutPrice: anchor,
      buyoutAnchor: anchor,
      buyoutRange: range,
      isBuyoutEligible: true,
    };
  }

  return {
    standardPrice,
    proPrice,
    buyoutPrice: '$4,500 Anchor',
    buyoutAnchor: '$4,500 Anchor',
    buyoutRange: '$5,150 Buyout Avg',
    isBuyoutEligible: true,
  };
}
