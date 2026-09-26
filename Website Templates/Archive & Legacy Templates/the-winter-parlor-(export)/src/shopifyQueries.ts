/**
 * Shopify Storefront API GraphQL Queries & State Mappings
 * Tailored for The Winter Parlor (Aura & Grid Blueprint Layouts)
 */

// 1. GraphQL Query: Fetch Rotating Culinary Experiences (Collections)
// Fetches the experiences ('Chef's Tasting', 'View Park Brunch', 'Because It's Friday')
// and pulls custom metafields, imagery, variants, and real-time inventory quantity.
export const GET_CULINARY_EXPERIENCES_QUERY = `
  query GetCulinaryExperiences($collectionHandle: String!) {
    collection(handle: $collectionHandle) {
      id
      title
      description
      image {
        url(transform: { maxWidth: 2000, format: WEBP })
        altText
        width
        height
      }
      # Metafields associated with the collection itself
      schedule: metafield(namespace: "custom", key: "schedule_details") {
        value
      }
      chefQuote: metafield(namespace: "custom", key: "chef_quote") {
        value
      }
      products(first: 20) {
        edges {
          node {
            id
            title
            description
            handle
            featuredImage {
              url(transform: { maxWidth: 1000, format: WEBP })
              altText
            }
            # Retrieve metafields specifying course layout, allergen flags, and seating indicators
            courseNumber: metafield(namespace: "custom", key: "course_number") {
              value
            }
            allergenTags: metafield(namespace: "custom", key: "allergen_tags") {
              value # Array-like JSON e.g. ["Nut-Free", "Gluten-Free"]
            }
            customTags: metafield(namespace: "custom", key: "editorial_tags") {
              value # e.g. ["From Scratch", "Limited Seating"]
            }
            tags # Native Shopify Tags
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  # Real-time inventory query to strictly verify seating constraints on the flight builder
                  quantityAvailable
                  currentlyNotInStock
                  requiresShipping
                  # Seating Capacity custom metafield
                  seatingCapacity: metafield(namespace: "custom", key: "seating_capacity") {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// 2. Mapping Payload directly to the View Park Dining Layout State (types.ts)
// Maps response data to match exactly with the layout props in src/App.tsx
export interface ShopifyProductNode {
  id: string;
  title: string;
  description: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  courseNumber?: { value: string };
  allergenTags?: { value: string };
  customTags?: { value: string };
  tags?: string[];
  variants: {
    edges: Array<{
      node: {
        id: string;
        price: { amount: string };
        quantityAvailable: number;
        seatingCapacity?: { value: string };
      };
    }>;
  };
}

export interface ShopifyCollectionResponse {
  collection: {
    id: string;
    title: string;
    description: string;
    image?: { url: string; altText?: string };
    schedule?: { value: string };
    chefQuote?: { value: string };
    products: {
      edges: Array<{
        node: ShopifyProductNode;
      }>;
    };
  };
}

import { parseProductTags } from './data';

/**
 * Clean Reducer to parse high-commerce Shopify Storefront payloads
 * straight into the zen-minimalist local component state.
 */
export function mapShopifyToCulinaryExperience(response: ShopifyCollectionResponse) {
  const collection = response.collection;
  
  return {
    id: collection.id,
    title: collection.title,
    subtitle: collection.description,
    schedule: collection.schedule?.value || "Special Pop-Up Sitting",
    chefQuote: collection.chefQuote?.value || "“Cooking is an act of pure presence.”",
    description: collection.description,
    dishes: collection.products.edges.map(({ node }) => {
      const activeVariant = node.variants.edges[0]?.node;
      
      // Safe parsing for array-like custom metafields
      let parsedAllergens: string[] = [];
      let parsedTags: string[] = [];
      
      try {
        if (node.allergenTags?.value) {
          parsedAllergens = JSON.parse(node.allergenTags.value);
        }
        if (node.customTags?.value) {
          parsedTags = JSON.parse(node.customTags.value);
        }
      } catch (e) {
        // Fallback split if standard formatting returns a comma-separated list
        parsedAllergens = node.allergenTags?.value ? node.allergenTags.value.replace(/[\[\]"]/g, '').split(',') : [];
        parsedTags = node.customTags?.value ? node.customTags.value.replace(/[\[\]"]/g, '').split(',') : [];
      }

      // Merge native Shopify tags with metafield custom tags
      const allRawTags = [...parsedTags, ...(node.tags || [])];

      // Parse tagged prefixes (e.g., 'method:*' and 'alignment:*')
      const { cookingMethod, organicAlignment, cleanTags } = parseProductTags(allRawTags);

      // Append real-time inventory indicator if seats are running dangerously low
      const remainingSeats = activeVariant?.quantityAvailable ?? 0;
      if (remainingSeats > 0 && remainingSeats <= 5 && !cleanTags.includes('Seats Low')) {
        cleanTags.push(`Only ${remainingSeats} left`);
      }

      return {
        id: node.id,
        courseNumber: node.courseNumber?.value || undefined,
        name: node.title,
        description: node.description,
        price: parseFloat(activeVariant?.price.amount || "0"),
        tags: cleanTags.filter(t => t.trim() !== ""),
        dietary: parsedAllergens.filter(d => d.trim() !== ""),
        cookingMethod,
        organicAlignment
      };
    })
  };
}
