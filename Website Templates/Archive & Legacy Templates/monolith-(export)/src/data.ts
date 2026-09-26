import { CaseStudy, ServiceItem, ClientBrand, ProcessStep } from "./types";

export const CLIENT_BRANDS: ClientBrand[] = [
  { name: "Soma Technologies", category: "Software & Technology", symbol: "SOMA" },
  { name: "Barton Group", category: "Consumer Products", symbol: "BARTON" },
  { name: "Crestview Partners", category: "Financial Services", symbol: "CRESTVIEW" },
  { name: "Vale Real Estate", category: "Hospitality & Real Estate", symbol: "VALE" },
  { name: "Oakridge Infrastructure", category: "Energy & Infrastructure", symbol: "OAKRIDGE" },
  { name: "Helix Laboratories", category: "Healthcare & Biotech", symbol: "HELIX" },
  { name: "Vaden Goods", category: "Retail & Consumer Goods", symbol: "VADEN" },
  { name: "Pacifica Media", category: "Media & Entertainment", symbol: "PACIFICA" },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "win-1",
    category: "Media Relations",
    title: "National product launch coordination",
    description: "Coordinated the communications plan and media outreach for a consumer hardware release.",
    outcome: "Secured launch coverage in major business and design publications, establishing clear brand awareness.",
  },
  {
    id: "win-2",
    category: "Executive Visibility",
    title: "Executive positioning initiative",
    description: "Developed leadership positioning and editorial strategy for a founding team during a key corporate milestone.",
    outcome: "Established executives as key industry voices through column placements and national profiles.",
  },
  {
    id: "win-3",
    category: "Corporate Advisory",
    title: "Regulatory transition advisory",
    description: "Managed internal and external communications during an industry-wide transition to new federal rules.",
    outcome: "Developed clear messaging guidelines that answered public questions while maintaining client and stakeholder trust.",
  },
];

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "srv-1",
    idx: "01",
    title: "Media relations",
    description: "Coordination of editorial outreach, brand profiles, and key placements across business and industry publications.",
  },
  {
    id: "srv-2",
    idx: "02",
    title: "Executive visibility",
    description: "Positioning leadership teams through authored articles, speaking engagements, and systematic executive profiling.",
  },
  {
    id: "srv-3",
    idx: "03",
    title: "Product and brand launches",
    description: "Planning rollout campaigns that build sustained attention, clear market impact, and ongoing audience interest.",
  },
  {
    id: "srv-4",
    idx: "04",
    title: "Strategic messaging",
    description: "Defining core messaging platforms, company voice guidelines, and key corporate talking points.",
  },
  {
    id: "srv-5",
    idx: "05",
    title: "Reputation advisory",
    description: "Managing corporate response, addressing narrative shifts, and maintaining investor and stakeholder confidence.",
  },
  {
    id: "srv-6",
    idx: "06",
    title: "Campaigns & partnerships",
    description: "Coordinating collaborative programs, key event alignments, and initiatives that support brand relevance.",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Audit and research",
    description: "We analyze current market perceptions, define distinguishing strengths, and evaluate the industry landscape.",
  },
  {
    number: "02",
    title: "Strategic messaging",
    description: "We distill complex company offerings into clear, compelling narrative assets designed for media pick-up.",
  },
  {
    number: "03",
    title: "Media planning",
    description: "We formulate target communication timelines, build curated press directories, and outline clear messaging benchmarks.",
  },
  {
    number: "04",
    title: "Execution",
    description: "We coordinate timing and launch windows for maximum impact, ensuring smooth coordination from day one.",
  },
  {
    number: "05",
    title: "Sustained visibility",
    description: "We transition launch milestones into ongoing executive profiles, sector viewpoints, and long-term brand interest.",
  },
];

export const SITE_COPY = {
  // Hero Section
  hero: {
    accent: "Executive Communication & PR",
    headline: "We build narratives that carry weight.",
    subcopy: "Monolith designs clear communications and media strategies for founders, fast-growing companies, and industry leaders. We handle major announcements, brand reputations, and corporate campaigns across changing media landscapes with clarity and focus.",
    sidebarLabel: "Communications Advisory",
    sidebarText: "Developing clear positioning, strategic media campaigns, and narrative leadership for category builders."
  },
  
  // Placements / Active Placements
  pressFeed: {
    label: "Placements & Activity",
    headline: "Active Placements",
    description: "Earned media coverage, strategic key placements, and category-defining visibility for clients establishing industry leadership.",
    placements: [
      "Featured in Fast Company",
      "Executive profile in Forbes",
      "Strategic launch announcement",
      "National media coordination",
      "Brand position defined",
      "Crisis communications advisory",
    ]
  },

  // Philosophy / Thesis
  thesis: {
    label: "Overview",
    sidebarHeading: "Our Approach",
    sidebarTags: ["Strategic Consulting", "Public Relations", "Communications Strategy"],
    philosophyLabel: "Philosophy",
    headline: "Public perception is not accidental.",
    body: "We believe that public relations is more than just securing articles. It is about defining clear messages, choosing the right timing, and ensuring your brand is understood. We provide the planning and outreach to make that happen.",
    quoteLabel: "PRINCIPLE",
    quoteText: "In a landscape saturated with noise, deliberate positioning is everything. When you do speak, make sure it resonates."
  },

  // Case Studies Section (Header/Desc only, studies are already separate arrays in data.ts)
  caseStudies: {
    label: "Selected Work",
    headline: "Case Studies",
    description: "Selected client engagements highlighting our strategy, media execution, and narrative outcomes."
  },

  // Client Wall
  clientWall: {
    label: "Selected Clients",
    headline: "Trusted by founders and high-growth companies.",
    footerLeft: "Strategic narrative development across major sectors",
    footerRight: "Select Portfolio Representation"
  },

  // Services Section
  services: {
    label: "Services",
    headline: "Communications crafted for precision, timing, and impact.",
    footerLeft: "Strategic advisory and execution across all brand engagements",
    footerRight: "Portfolio of advisory services"
  },

  // Process Section
  process: {
    label: "Process",
    headline: "Built for momentum."
  },

  // Inquiry Section
  inquiry: {
    label: "Engagement",
    headline: "Start an inquiry.",
    body: "Share your project timeline, primary narrative goals, or upcoming milestones. We'll review the details and respond within one business day.",
    buttonText: "Start Project Inquiry",
    footerBadge: "Typically responding to all project inquiries within one business day"
  },

  // Inquiry Overlay/Modal Form
  overlay: {
    label: "Advisory Inquiry",
    headline: "Start an inquiry.",
    subcopy: "Please outline your communication objectives, positioning needs, or key initiatives below.",
    successHeadline: "Inquiry Received",
    successSubcopy: "Thank you for your inquiry. A member of our advisory team has received your details and will contact you directly within one business day to discuss next steps."
  },

  // Global Info / Footer / Navigation
  global: {
    brandName: "MONOLITH",
    foundedLabel: "Founded 2026",
    navLabel: "Navigation",
    contactLabel: "Contact",
    advisoryLabel: "Advisory:",
    advisoryEmail: "partner@monolith.agency",
    inquiriesLabel: "Inquiries:",
    inquiriesEmail: "brief@monolith.agency",
    locationsLabel: "Locations",
    locationsTextLines: [
      "Fifth Avenue Towers",
      "New York, NY",
      "United States // London, UK"
    ]
  }
};

