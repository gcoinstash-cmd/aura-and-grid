export interface CompanyData {
  name: string;
  ticker: string;
  yield: number;
  yieldAvg: number | null;
  p_fcf: number;
  debtCash: number;
  debtEquity: number;
  roc5yr: number | null;
  roc10yr: number | null;
  enterpriseValue: number | null;
  marketCap: number | null;
  category: 'Speculative' | 'Retirement' | 'Income';
}

export const HOLDINGS_DATA: CompanyData[] = [
  { name: "Manning and Napier Inc.", ticker: "MN", yield: 454.7, yieldAvg: 492, p_fcf: 0, debtCash: 0.00, debtEquity: 0.00, roc5yr: null, roc10yr: null, enterpriseValue: 31.5, marketCap: 125.5, category: 'Income' },
  { name: "Marvell Tech. Group Ltd.", ticker: "MRVL", yield: 26.2, yieldAvg: 0, p_fcf: 4, debtCash: 0.00, debtEquity: 0.00, roc5yr: null, roc10yr: null, enterpriseValue: 1819.0, marketCap: 4320.0, category: 'Speculative' },
  { name: "Teradyne Inc.", ticker: "TER", yield: 14.9, yieldAvg: null, p_fcf: 7, debtCash: 0.00, debtEquity: 0.00, roc5yr: null, roc10yr: null, enterpriseValue: 3080.0, marketCap: 3900.0, category: 'Retirement' },
  { name: "NetApp Inc.", ticker: "NTAP", yield: 22.9, yieldAvg: null, p_fcf: 4, debtCash: 0.31, debtEquity: 0.50, roc5yr: null, roc10yr: null, enterpriseValue: 3465.0, marketCap: 6790.0, category: 'Retirement' },
  { name: "Ebay Inc.", ticker: "EBAY", yield: 9.8, yieldAvg: null, p_fcf: 10, debtCash: 1.40, debtEquity: 1.15, roc5yr: null, roc10yr: null, enterpriseValue: 33188.0, marketCap: 31050.0, category: 'Income' },
  { name: "LifeLock Inc.", ticker: "LOCK", yield: 11.0, yieldAvg: null, p_fcf: 9, debtCash: 0.00, debtEquity: 0.00, roc5yr: null, roc10yr: null, enterpriseValue: 908.0, marketCap: 1240.0, category: 'Speculative' },
  { name: "Coach Inc.", ticker: "COH", yield: 6.8, yieldAvg: null, p_fcf: 15, debtCash: 0.70, debtEquity: 0.36, roc5yr: null, roc10yr: null, enterpriseValue: 8335.0, marketCap: 8720.0, category: 'Income' },
  { name: "Franklin Resources Inc.", ticker: "BEN", yield: 16.3, yieldAvg: null, p_fcf: 6, debtCash: 0.26, debtEquity: 0.18, roc5yr: null, roc10yr: null, enterpriseValue: 13397.0, marketCap: 19610.0, category: 'Retirement' },
  { name: "PDL BioPharma Inc.", ticker: "PDLI", yield: 20.3, yieldAvg: null, p_fcf: 5, debtCash: 1.44, debtEquity: 0.56, roc5yr: null, roc10yr: null, enterpriseValue: 592.0, marketCap: 490.0, category: 'Speculative' },
  { name: "Westwood Holdings Group Inc.", ticker: "WHG", yield: 15.5, yieldAvg: null, p_fcf: 6, debtCash: 0.00, debtEquity: 0.00, roc5yr: null, roc10yr: null, enterpriseValue: 365.0, marketCap: 389.0, category: 'Income' },
  { name: "Waddell & Reed Inc.", ticker: "WDR", yield: 17.8, yieldAvg: null, p_fcf: 6, debtCash: 0.31, debtEquity: 0.23, roc5yr: null, roc10yr: null, enterpriseValue: 1597.0, marketCap: 2020.0, category: 'Income' },
  { name: "Apple Inc.", ticker: "AAPL", yield: 17.0, yieldAvg: null, p_fcf: 6, debtCash: 0.31, debtEquity: 0.54, roc5yr: null, roc10yr: null, enterpriseValue: 410126.0, marketCap: 551330.0, category: 'Retirement' },
  { name: "InterDigital Inc.", ticker: "IDCC", yield: 2.1, yieldAvg: null, p_fcf: 47, debtCash: 0.55, debtEquity: 0.99, roc5yr: null, roc10yr: null, enterpriseValue: 1204.0, marketCap: 1590.0, category: 'Speculative' },
  { name: "RPX Inc.", ticker: "RPXC", yield: 45.8, yieldAvg: null, p_fcf: 2, debtCash: 0.00, debtEquity: 0.00, roc5yr: null, roc10yr: null, enterpriseValue: 203.0, marketCap: 571.0, category: 'Income' },
  { name: "Spok Holdings Inc.", ticker: "SPOK", yield: 14.8, yieldAvg: null, p_fcf: 7, debtCash: 0.00, debtEquity: 0.00, roc5yr: null, roc10yr: null, enterpriseValue: 223.0, marketCap: 336.0, category: 'Speculative' },
  { name: "Brocade Comm. Systems Inc", ticker: "BRCD", yield: 16.9, yieldAvg: null, p_fcf: 6, debtCash: 0.57, debtEquity: 0.40, roc5yr: 40.0, roc10yr: 40.0, enterpriseValue: 2806.0, marketCap: 3400.0, category: 'Retirement' },
];
