// src/lib/utils/stats.js
import * as d3 from 'd3';

/**
 * Pearson correlation coefficient between two arrays.
 * @param {number[]} xs
 * @param {number[]} ys
 * @returns {number}
 */
export function pearsonR(xs, ys) {
  const n = xs.length;
  const mx = d3.mean(xs) ?? 0;
  const my = d3.mean(ys) ?? 0;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx  += a * a;
    dy  += b * b;
  }
  return num / Math.sqrt(dx * dy);
}

/**
 * Return data with `evictionResidual` added — evictionRate minus the
 * linear prediction from medianIncome (simple OLS).
 * @template {{ medianIncome: number, evictionRate: number }} T
 * @param {T[]} data
 * @returns {(T & { evictionResidual: number })[]}
 */
export function residualizeByIncome(data) {
  const xs = data.map((d) => d.medianIncome);
  const ys = data.map((d) => d.evictionRate);
  const mx = d3.mean(xs) ?? 0;
  const my = d3.mean(ys) ?? 0;
  const cov  = d3.mean(xs.map((x, i) => (x - mx) * (ys[i] - my))) ?? 0;
  const varX = d3.mean(xs.map((x) => (x - mx) ** 2)) ?? 1;
  const slope     = cov / varX;
  const intercept = my - slope * mx;
  return data.map((d) => ({
    ...d,
    evictionResidual: d.evictionRate - (intercept + slope * d.medianIncome)
  }));
}

/**
 * Compute correlations of each predictor key against evictionRate (or residual).
 * @param {import('../data/tracts.js').Tract[]} data
 * @param {import('../data/tracts.js').CORR_TARGETS} targets
 * @param {boolean} incomeControlled
 * @param {string[]} [selectedTractIds] - Optional array of tract IDs to filter by
 */
export function computeCorrelations(data, targets, incomeControlled, selectedTractIds = []) {
  // Filter data first if a selection exists
  const filteredData = selectedTractIds.length > 0 
    ? data.filter(d => selectedTractIds.includes(d.tract)) 
    : data;

  const base  = incomeControlled ? residualizeByIncome(filteredData) : filteredData;
  const yKey  = incomeControlled ? 'evictionResidual' : 'evictionRate';
  
  return targets.map((p) => {
    const xs = base.map((d) => d[p.key]);
    const ys = base.map((d) => d[yKey]);
    // Handle cases with too few points for correlation
    const r = xs.length > 1 ? pearsonR(xs, ys) : 0;
    return { ...p, r };
  });
}
