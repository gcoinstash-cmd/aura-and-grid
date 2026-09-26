import { FragranceProduct } from './types';

export const SIGNATURE_FRAGRANCES: FragranceProduct[] = [
  {
    id: 'santalum-vetiver',
    name: 'Santalum Vetiver',
    tagline: 'An earthly anchor under shifting winds.',
    story: 'Santalum Vetiver evokes the dry, petrichor atmosphere of a cedar grove after seasonal rains. Grounding Indian sandalwood marries the smoke-veiled humidity of Haitian vetiver, giving rise to an aroma that functions as a silent, meditative sanctuary.',
    character: 'Mineral, Dry Woody, Resinous',
    intensity: 4,
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=1200',
    heroImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=2000',
    notes: {
      top: [
        {
          name: 'Cardamom Essential Oil',
          origin: 'Guatemala',
          description: 'A crisp, spicy-cool aroma with camphoreous energy that awakens the top of the pyramid.'
        },
        {
          name: 'Cold-Pressed Bergamot',
          origin: 'Calabria, Italy',
          description: 'Bright, sparkling, bitter citrus that delivers an immediate atmospheric elevation.'
        },
        {
          name: 'Pink Peppercorn',
          origin: 'Madagascar',
          description: 'A vibrant, rosaceous pepper spark adding dry texture and soft radiant heat.'
        }
      ],
      heart: [
        {
          name: 'Papyrus Wood Extract',
          origin: 'Egypt',
          description: 'An ancient, dry, papery-woody texture reminiscent of sun-baked scrolls.'
        },
        {
          name: 'Virginia Cedarwood',
          origin: 'United States',
          description: 'A pure, clean, pencil-shaving cedar warmth that structure-fills the mid-tones.'
        },
        {
          name: 'Violet Leaf Absolute',
          origin: 'Grasse, France',
          description: 'Deep green, slightly metallic foliage facet adding a moist, cool undercurrent.'
        }
      ],
      base: [
        {
          name: 'Sandalwood Album',
          origin: 'Mysore, India',
          description: 'Creamy, buttery, ultra-rich precious timber that binds securely to the skin.'
        },
        {
          name: 'Organic Vetiver Root',
          origin: 'Les Cayes, Haiti',
          description: 'Earth-drenched, root-like, salt-smoky wood essence with tremendous staying power.'
        },
        {
          name: 'Mineral Ambergris Accord',
          origin: 'Synthetic (Cruelty-Free)',
          description: 'A saline, skin-warm undertone that replicates marine pheromones and secures the sillage.'
        }
      ]
    }
  },
  {
    id: 'rose-noire',
    name: 'Rose Noire',
    tagline: 'An obsidian shadow in full bloom.',
    story: 'Rose Noire represents a dark botanical study in marble. It highlights the heavy, rich rose absolute and cold mineral earth notes, surrounded by bone-white plaster geometry and deep shadow depths.',
    character: 'Dark Floral, Resinous, Mineral',
    intensity: 3,
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=1200',
    heroImage: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=2000',
    notes: {
      top: [
        {
          name: 'Black Currant Bud Oil',
          origin: 'France',
          description: 'Tart, modern green-fruity depth that introduces an obsidian, shadowed mist.'
        },
        {
          name: 'Sichuan Pepper Co2',
          origin: 'Szechuan, China',
          description: 'A dry, tingling spice with cooling metallic facets that remains transparent.'
        },
        {
          name: 'Mandarin Rind',
          origin: 'Sicily, Italy',
          description: 'A sharp citrus splash that cuts through the initial deep floral weight.'
        }
      ],
      heart: [
        {
          name: 'Rose Damascena Absolute',
          origin: 'Grasse, France',
          description: 'The precious rose oil absolute, providing an unmatched, luxurious, thick floral texture.'
        },
        {
          name: 'Turkish Rose Concrete',
          origin: 'Isparta, Turkey',
          description: 'Rich, dense, honey-sweet concrete paste with an incredibly deep, velvety heart.'
        },
        {
          name: 'Night-Blooming Jasmine',
          origin: 'Egypt',
          description: 'Sensual white floral aspect that acts as a bridge between cold earth and deep base notes.'
        }
      ],
      base: [
        {
          name: 'Precious White Musk',
          origin: 'Cruelty-Free Accord',
          description: 'Provides a clean, laundry-sheet-like second-skin feel that soft-focuses the drydown.'
        },
        {
          name: 'Onyx Amber Accord',
          origin: 'Artisanal Accord',
          description: 'A natural, smoky resinous blend of dark Baltic amber and mineral-heavy modern facets.'
        },
        {
          name: 'Black Suede & Vetiver',
          origin: 'Artisanal Accord',
          description: 'Supple, luxurious, micro-textured leather note that gives Rose Noire its final architectural shape.'
        }
      ]
    }
  },
  {
    id: 'citrus-concrete',
    name: 'Citrus Concrete',
    tagline: 'The stark warmth of sunlit limestone.',
    story: 'Citrus Concrete balances high-ratio steam-distilled bitter orange with the cold texture of modern stucco and raw sandstone. A single botanical stem casting crisp shadows.',
    character: 'Citrus-Woody, Luminous, Terrene',
    intensity: 5,
    imageUrl: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200',
    heroImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=2000',
    notes: {
      top: [
        {
          name: 'Tunisian Neroli Oil',
          origin: 'Nabeul, Tunisia',
          description: 'Highly therapeutic, crisp, green-sweet bitter orange flower distilled by steam.'
        },
        {
          name: 'Bitter Orange & Limestone',
          origin: 'Spain & Greece',
          description: 'A sharp, zesty rind kick that injects refreshing, bitter carbonated energy over warm stone.'
        },
        {
          name: 'Petitgrain Sandstone',
          origin: 'Paraguay',
          description: 'Steam-distilled leaves and twigs of orange tree, providing dry woody-green realism.'
        }
      ],
      heart: [
        {
          name: 'Orange Blossom Absolute',
          origin: 'Morocco',
          description: 'Solvent-extracted blossoms delivering a thick, deep, sweet, honeyed floral syrup.'
        },
        {
          name: 'Sunlit Jasmine Sambac',
          origin: 'India',
          description: 'Indolic, green, sunny white flower absolute that blooms powerfully on warm skin.'
        },
        {
          name: 'Lime Blossom Essence',
          origin: 'France',
          description: 'A crisp botanical floral that smooths the bitter aspects of the citrus leaves.'
        }
      ],
      base: [
        {
          name: 'Atlas Cedarwood',
          origin: 'Morocco',
          description: 'Dry, masculine balsamic woodiness that balances the white floral headiness.'
        },
        {
          name: 'Warm Limestone & Resin',
          origin: 'Synthesized Accord',
          description: 'Warm, mineralistic balsamic sweetness summarizing the floral-citrus story on dry cement.'
        },
        {
          name: 'Angelic Moss',
          origin: 'Northern Europe',
          description: 'Earthy, mineral-green root and forest moss anchor that locks the bright blooms in place.'
        }
      ]
    }
  }
];

export const products = SIGNATURE_FRAGRANCES;
