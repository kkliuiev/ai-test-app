import {
  AmlCheckResult,
  Chain,
  GoPlusAddressData,
  GoPlusAddressResponse,
  RiskFactor,
  RiskLevel,
} from '../types';
import { RISK_FACTOR_DESCRIPTIONS, RISK_FACTOR_LABELS } from '../constants/chains';

const GOPLUS_BASE_URL = 'https://api.gopluslabs.io/api/v1';

// High-weight risk indicators (count more toward score)
const HIGH_WEIGHT_FACTORS = new Set([
  'sanctioned',
  'money_laundering',
  'financial_crime',
  'cybercrime',
  'blackmail_activities',
  'stealing_attack',
  'phishing_activities',
]);

const MEDIUM_WEIGHT_FACTORS = new Set([
  'darkweb_transactions',
  'blacklist_doubt',
  'mixer',
  'honeypot_related_address',
  'malicious_mining_activities',
  'fake_kyc',
]);

export async function checkAddress(
  address: string,
  chain: Chain
): Promise<AmlCheckResult> {
  const url = `${GOPLUS_BASE_URL}/address_security/${address}?chain_id=${chain.chainId}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data: GoPlusAddressResponse = await response.json();

  if (data.code !== 1) {
    throw new Error(data.message || 'API returned an error');
  }

  const addressData = data.result;

  if (!addressData || Object.keys(addressData).length === 0) {
    throw new Error('No data returned for this address on the selected chain');
  }

  const riskFactors = buildRiskFactors(addressData);
  const riskScore = calculateRiskScore(addressData, riskFactors);
  const riskLevel = scoreToLevel(riskScore);

  return {
    address,
    chain,
    riskLevel,
    riskScore,
    riskFactors,
    checkedAt: new Date().toISOString(),
    rawData: data,
  };
}

function buildRiskFactors(data: GoPlusAddressData): RiskFactor[] {
  const factors: RiskFactor[] = [];
  const skip = new Set(['data_source', 'contract_address']);

  for (const [key, rawValue] of Object.entries(data)) {
    if (skip.has(key)) continue;
    if (!(key in RISK_FACTOR_LABELS)) continue;

    const value = String(rawValue);
    const numVal = Number(value);
    const isRisky = value === '1' || numVal > 0;

    factors.push({
      key,
      label: RISK_FACTOR_LABELS[key] ?? key,
      value: isNaN(numVal) ? value : numVal,
      isRisky,
      description: RISK_FACTOR_DESCRIPTIONS[key] ?? '',
    });
  }

  // Sort: risky first, then alphabetically
  return factors.sort((a, b) => {
    if (a.isRisky !== b.isRisky) return a.isRisky ? -1 : 1;
    return a.label.localeCompare(b.label);
  });
}

function calculateRiskScore(
  data: GoPlusAddressData,
  factors: RiskFactor[]
): number {
  let score = 0;

  for (const factor of factors) {
    if (!factor.isRisky) continue;
    if (factor.key === 'number_of_malicious_contracts_created') {
      score += Math.min(Number(factor.value) * 10, 30);
    } else if (HIGH_WEIGHT_FACTORS.has(factor.key)) {
      score += 25;
    } else if (MEDIUM_WEIGHT_FACTORS.has(factor.key)) {
      score += 15;
    } else {
      score += 10;
    }
  }

  return Math.min(score, 100);
}

function scoreToLevel(score: number): RiskLevel {
  if (score === 0) return 'LOW';
  if (score <= 20) return 'MEDIUM';
  if (score <= 50) return 'HIGH';
  return 'CRITICAL';
}

export function isValidAddress(address: string): boolean {
  // EVM address (0x...)
  if (/^0x[0-9a-fA-F]{40}$/.test(address)) return true;
  // Basic length check for other formats
  return address.length >= 26 && address.length <= 62;
}

export function truncateAddress(address: string, chars = 6): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function getRiskColor(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return '#00C896';
    case 'MEDIUM': return '#FFB800';
    case 'HIGH': return '#FF6B35';
    case 'CRITICAL': return '#FF2D55';
    default: return '#8E8E93';
  }
}

export function getRiskEmoji(level: RiskLevel): string {
  switch (level) {
    case 'LOW': return '✓';
    case 'MEDIUM': return '!';
    case 'HIGH': return '!!';
    case 'CRITICAL': return '!!!';
    default: return '?';
  }
}
