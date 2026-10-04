import { CATALOG_DATA, type ProductItem } from '../catalogData.ts';

export const blueprints: ProductItem[] = CATALOG_DATA.products;
export { CATALOG_DATA };

// Canonical "Auto Repair Shop OS" asset definition
export const autoRepairShopOS = {
  name: "Auto Repair Shop OS",
  bestFor: "Independent auto repair shops & fleet maintenance operators"
};

export default CATALOG_DATA;
