// src/lib/data/tracts.js

/** @typedef {{
 *   tract: string,
 *   evictionRate: number,
 *   pctNonWhite: number,
 *   pctBlack: number,
 *   corpOwnership: number,
 *   medianIncome: number,
 *   flipRate: number,
 *   incomeGroup: 'low' | 'high'
 * }} Tract */

/** @type {Tract[]} */
export const tracts = [
  { tract: 'Dorchester A',  evictionRate: 6.1, pctNonWhite: 0.78, pctBlack: 0.42, corpOwnership: 0.22, medianIncome: 51000,  flipRate: 0.08, incomeGroup: 'low'  },
  { tract: 'Dorchester B',  evictionRate: 5.4, pctNonWhite: 0.71, pctBlack: 0.36, corpOwnership: 0.26, medianIncome: 56000,  flipRate: 0.06, incomeGroup: 'low'  },
  { tract: 'Roxbury',       evictionRate: 7.2, pctNonWhite: 0.86, pctBlack: 0.51, corpOwnership: 0.18, medianIncome: 47000,  flipRate: 0.05, incomeGroup: 'low'  },
  { tract: 'Mattapan',      evictionRate: 6.8, pctNonWhite: 0.92, pctBlack: 0.62, corpOwnership: 0.14, medianIncome: 49000,  flipRate: 0.04, incomeGroup: 'low'  },
  { tract: 'South End',     evictionRate: 2.3, pctNonWhite: 0.41, pctBlack: 0.11, corpOwnership: 0.35, medianIncome: 98000,  flipRate: 0.09, incomeGroup: 'high' },
  { tract: 'Back Bay',      evictionRate: 1.4, pctNonWhite: 0.22, pctBlack: 0.04, corpOwnership: 0.28, medianIncome: 142000, flipRate: 0.07, incomeGroup: 'high' },
  { tract: 'Allston',       evictionRate: 3.2, pctNonWhite: 0.48, pctBlack: 0.07, corpOwnership: 0.31, medianIncome: 83000,  flipRate: 0.10, incomeGroup: 'high' },
  { tract: 'Brighton',      evictionRate: 2.9, pctNonWhite: 0.44, pctBlack: 0.06, corpOwnership: 0.29, medianIncome: 89000,  flipRate: 0.08, incomeGroup: 'high' },
  { tract: 'East Boston',   evictionRate: 4.8, pctNonWhite: 0.73, pctBlack: 0.08, corpOwnership: 0.20, medianIncome: 67000,  flipRate: 0.06, incomeGroup: 'low'  },
  { tract: 'Jamaica Plain', evictionRate: 2.7, pctNonWhite: 0.36, pctBlack: 0.09, corpOwnership: 0.24, medianIncome: 101000, flipRate: 0.05, incomeGroup: 'high' },
  { tract: 'Fenway',        evictionRate: 3.1, pctNonWhite: 0.52, pctBlack: 0.08, corpOwnership: 0.33, medianIncome: 91000,  flipRate: 0.09, incomeGroup: 'high' },
  { tract: 'Hyde Park',     evictionRate: 4.9, pctNonWhite: 0.67, pctBlack: 0.34, corpOwnership: 0.16, medianIncome: 72000,  flipRate: 0.04, incomeGroup: 'low'  }
];

/** Ownership trend 2004–2024 */
export const ownershipTrend = Array.from({ length: 21 }, (_, i) => ({
  year: 2004 + i,
  share: Math.max(0.04, Math.min(0.32, 0.06 + 0.0095 * i + 0.02 * Math.sin(i / 3.2)))
}));

/** Annual eviction filing counts 2020–2023 */
export const evictionFilings = [
  { year: 2020, filings: 1900 },
  { year: 2021, filings: 1650 },
  { year: 2022, filings: 2850 },
  { year: 2023, filings: 2650 }
];

/** Predictor metadata — label + d3 formatter */
export const PREDICTORS = [
  { key: 'pctNonWhite',   label: '% non‑white residents',   fmt: /** @param {number} d */ (d) => `${(d * 100).toFixed(0)}%` },
  { key: 'pctBlack',      label: '% Black residents',        fmt: /** @param {number} d */ (d) => `${(d * 100).toFixed(0)}%` },
  { key: 'corpOwnership', label: 'corporate ownership share', fmt: /** @param {number} d */ (d) => `${(d * 100).toFixed(0)}%` },
  { key: 'medianIncome',  label: 'median income',             fmt: /** @param {number} d */ (d) => `$${d.toLocaleString()}` },
  { key: 'flipRate',      label: 'property flipping rate',   fmt: /** @param {number} d */ (d) => `${(d * 100).toFixed(0)}%` }
];

/** Correlation bar metadata */
export const CORR_TARGETS = [
  { key: 'pctNonWhite',   label: '% non‑white',    color: '#ff5a6b' },
  { key: 'pctBlack',      label: '% Black',         color: '#fb7185' },
  { key: 'corpOwnership', label: 'corp. ownership', color: '#67e8f9' },
  { key: 'medianIncome',  label: 'income',          color: '#34d399' },
  { key: 'flipRate',      label: 'flipping',        color: '#fbbf24' }
];

/** Policy card content */
export const POLICY_CARDS = [
  {
    id: 'rtc',
    title: '1) Right to Counsel, targeted',
    blurb: 'Prioritize outreach & funding where filing burden is highest.',
    detail: 'Right to Counsel is most effective when targeted to neighborhoods with the highest filing burden—not only where corporate landlords are concentrated.'
  },
  {
    id: 'protections',
    title: '2) Tenant protections by burden',
    blurb: 'Layer protections in majority‑minority neighborhoods where disparity persists.',
    detail: 'Tenant protections focused only on landlord type miss persistent racial disparities. Target protections by burden and neighborhood context.'
  },
  {
    id: 'funding',
    title: '3) Stability funding',
    blurb: 'Allocate prevention infrastructure (legal aid, emergency support) by burden.',
    detail: 'Housing stability funding can act as prevention infrastructure. Allocate legal aid and emergency support where eviction burden is structurally highest.'
  }
];
