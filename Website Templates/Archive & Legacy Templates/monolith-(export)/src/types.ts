export interface CaseStudy {
  id: string;
  category: string;
  title: string;
  description: string;
  outcome: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  idx: string;
}

export interface ClientBrand {
  name: string;
  category: string;
  symbol: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}
