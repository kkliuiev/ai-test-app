export interface Chain {
  id: string;
  chainId: number;
  name: string;
  symbol: string;
  color: string;
  icon: string;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'UNKNOWN';

export interface RiskFactor {
  key: string;
  label: string;
  value: string | number;
  isRisky: boolean;
  description: string;
}

export interface AmlCheckResult {
  address: string;
  chain: Chain;
  riskLevel: RiskLevel;
  riskScore: number;
  riskFactors: RiskFactor[];
  checkedAt: string;
  rawData?: GoPlusAddressResponse;
}

export interface GoPlusAddressData {
  blacklist_doubt: string;
  blackmail_activities: string;
  cybercrime: string;
  darkweb_transactions: string;
  data_source: string;
  financial_crime: string;
  fake_kyc: string;
  gas_price_manipulation: string;
  honeypot_related_address: string;
  malicious_mining_activities: string;
  mixer: string;
  money_laundering: string;
  number_of_malicious_contracts_created: string;
  phishing_activities: string;
  reinit: string;
  sanctioned: string;
  stealing_attack: string;
  fake_token: string;
  contract_address: string;
}

export interface GoPlusAddressResponse {
  code: number;
  message: string;
  result: GoPlusAddressData;
}

export interface HistoryItem extends AmlCheckResult {
  id: string;
}
