import { Product, BlueprintSpec } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "aeth-01",
    name: "The Soho Oxford",
    price: 850,
    category: "Classic Adelaide",
    description: "An elegant, bespoke-level Adelaide Oxford. Handcrafted utilizing Hand-selected French Box Calf from the Annonay Tannery. Seamlessly shaped over three days around our signature Bavarian hornbeam lasts to achieve custom comfort.",
    image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?q=80&w=1200&auto=format&fit=crop",
    sizes: [7, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    specs: [
      { label: "Construction", value: "closed-channel Goodyear stitching using waxed Irish linen strands" },
      { label: "Last Profile", value: "Sleek Chiseled Toe" },
      { label: "Lining", value: "Full-grain Italian Calfskin" },
      { label: "Sole", value: "Fiddleback oak-bark-tanned outsoles from Joh. Rendenbach" }
    ],
    origin: "Annonay Tannery, France",
    leatherType: "Hand-selected French Box Calf",
    status: "available"
  },
  {
    id: "aeth-02",
    name: "The Bruton Monk",
    price: 890,
    category: "Double Monkstrap",
    description: "Striking double monkstrap buckle archetype. Made using Hand-selected French Box Calf from the Annonay Tannery, featuring durable bronze hardware and finished with closed-channel Goodyear stitching using waxed Irish linen strands.",
    image: "https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=1200&auto=format&fit=crop",
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11],
    specs: [
      { label: "Construction", value: "closed-channel Goodyear stitching using waxed Irish linen strands" },
      { label: "Last Profile", value: "Soft Almond Classic" },
      { label: "Lining", value: "Aniline Calfskin" },
      { label: "Sole", value: "Fiddleback oak-bark-tanned outsoles from Joh. Rendenbach" }
    ],
    origin: "Annonay Tannery, France",
    leatherType: "Hand-selected French Box Calf",
    status: "limited",
    inventoryCount: 4
  },
  {
    id: "aeth-03",
    name: "The Chelsea II",
    price: 920,
    category: "Bespoke Chelsea",
    description: "A seamless wholecut Chelsea boot pattern. Crafted from textured premium repello suede, fully lined with Hand-selected French Box Calf from the Annonay Tannery and set on ultra-resilient oak-bark bases.",
    image: "https://images.unsplash.com/photo-1639006570490-79c0c53f1080?q=80&w=1200&auto=format&fit=crop",
    sizes: [7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    specs: [
      { label: "Construction", value: "closed-channel Goodyear stitching using waxed Irish linen strands" },
      { label: "Last Profile", value: "Elongated Architectural" },
      { label: "Lining", value: "Hand-selected French Box Calf" },
      { label: "Sole", value: "Fiddleback oak-bark-tanned outsoles from Joh. Rendenbach" }
    ],
    origin: "Annonay Tannery, France",
    leatherType: "Repello Cognac Suede",
    status: "available"
  },
  {
    id: "aeth-04",
    name: "The Savile Derby",
    price: 870,
    category: "Split-Toe Derby",
    description: "Distinguished Norwegian-style split-toe Derby, hand-sewn with boar bristle. Tailored with Hand-selected French Box Calf from the Annonay Tannery and mounted to structural fiddleback outsoles.",
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1200&auto=format&fit=crop",
    sizes: [8, 9, 9.5, 10, 10.5, 11, 12],
    specs: [
      { label: "Construction", value: "closed-channel Goodyear stitching using waxed Irish linen strands" },
      { label: "Last Profile", value: "Chunky Semi-Square" },
      { label: "Lining", value: "Veg-Tanned Calfskin" },
      { label: "Sole", value: "Fiddleback oak-bark-tanned outsoles from Joh. Rendenbach" }
    ],
    origin: "Annonay Tannery, France",
    leatherType: "Hand-selected French Box Calf",
    status: "sold_out",
    inventoryCount: 0
  }
];

export const BLUEPRINT_SPECS: BlueprintSpec[] = [
  {
    id: "last",
    number: "01",
    title: "The Hand-Carved Last",
    subtitle: "The Sculptural Foundation",
    sourcing: "Matured Hornbeam Wood harvested sustainably from the forests of Bavaria. Each custom last is carved by hand over three days to capture your precise physiological posture and tarsal curvature.",
    origin: "Bavarian Lastmaker Guild, Germany",
    longevity: "Designed to serve as a physiological carbon-copy of your foot, retaining its precise anatomical memory forever.",
    image: "https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "upper",
    number: "02",
    title: "The Selected Upper",
    subtitle: "The Aniline Sheen",
    sourcing: "Hand-selected French Box Calf from the Annonay Tannery. Procured from premium aniline box calf skins for an exquisite micro-grain pattern and a lifetime of restorative deep-conditioning.",
    origin: "Annonay Tannery, France",
    longevity: "Gains a deep, individual patina with wear. Can be polished repeatedly to restore a glass-like sheen.",
    image: "https://images.unsplash.com/photo-1531835551805-16d864c8d311?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "welt",
    number: "03",
    title: "The Goodyear Welt",
    subtitle: "Interlocking Stitching",
    sourcing: "Meticulous closed-channel Goodyear stitching using waxed Irish linen strands, interlocked with a natural hot-cork layer and dense vegetable-tanned leather welting to form a solid waterproof lock.",
    origin: "Barbour Linens, Northern Ireland",
    longevity: "Enables infinite resoling. Waterproof seam defense that isolates your foot completely from wet road surfaces.",
    image: "https://images.unsplash.com/photo-1513829096999-4978602297af?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: "sole",
    number: "04",
    title: "The Oak-Bark Sole",
    subtitle: "Ground-Level Grandeur",
    sourcing: "Fiddleback oak-bark-tanned outsoles from Joh. Rendenbach, carefully pit-cured in wood-bark extract for nine months to yield dense structural support and natural weather resiliency.",
    origin: "Joh. Rendenbach (JR) Tannery, Germany",
    longevity: "Three times more abrasion-resistant than standard leather soles. Remarkable flex-memory that adapts to your gait.",
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=800&auto=format&fit=crop"
  }
];
