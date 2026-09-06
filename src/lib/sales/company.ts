/**
 * Sales-ops company context for Grokbot. Mirrors public site constants
 * without inventing license numbers, prices, or markets the site does not
 * already claim.
 */

import { BUSINESS } from '@/lib/constants';

export const SALES_OWNER = {
  firstName: 'Jose',
  lastName: 'Escobar',
  nickname: 'Juggey',
  role: 'Owner / Project Manager',
  company: BUSINESS.name,
  legalName: 'Real Elite Contracting LLC',
  phone: BUSINESS.phone,
  phoneRaw: BUSINESS.phoneRaw,
  email: BUSINESS.email,
  homeMarket: 'Martinsburg, WV',
} as const;

export const SALES_MARKETS = {
  core: ['Eastern Panhandle WV', 'Northern VA / Loudoun', 'Western MD'],
  states: ['WV', 'MD', 'VA'] as const,
  targetGrossMargin: { min: 0.38, max: 0.42 },
} as const;

/** Preferred larger work — scored higher than small-job / unknown work. */
export const PREFERRED_WORK = [
  { key: 'basement', labels: ['basement', 'basement remodel', 'basement finishing', 'in-law suite'] },
  { key: 'bath', labels: ['bath', 'bathroom', 'shower', 'walk-in shower', 'tub'] },
  { key: 'kitchen', labels: ['kitchen', 'cabinets', 'countertop'] },
  { key: 'deck', labels: ['deck', 'porch', 'patio', 'outdoor living', 'pergola'] },
  { key: 'roofing', labels: ['roof', 'roofing', 'shingle', 'tear-off'] },
  { key: 'siding', labels: ['siding', 'fascia', 'soffit', 'stone veneer', 'fiber cement'] },
  { key: 'flooring', labels: ['floor', 'flooring', 'hardwood', 'lvp', 'tile floor'] },
  { key: 'painting', labels: ['paint', 'painting', 'interior paint', 'exterior paint'] },
  { key: 'carpentry', labels: ['carpentry', 'trim', 'built-in', 'door', 'window'] },
  { key: 'gc', labels: ['general contractor', 'whole-home', 'remodel', 'renovation', 'addition'] },
] as const;

export const SMALL_JOB_WORK = [
  'handyman',
  'gutter',
  'pressure wash',
  'tv mount',
  'fence repair',
  'small repair',
] as const;

export function firstNameOf(fullName: string | null | undefined): string {
  if (!fullName) return '';
  const cleaned = fullName.trim().split(/\s+/)[0] ?? '';
  return cleaned;
}
