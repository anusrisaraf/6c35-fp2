// src/lib/index.js
// Convenience re-exports — import from '$lib' instead of deep paths if preferred.
export { tracts, ownershipTrend, evictionFilings, PREDICTORS, CORR_TARGETS, POLICY_CARDS } from './data/tracts.js';
export { pearsonR, residualizeByIncome, computeCorrelations } from './utils/stats.js';
export { tooltip, showTooltip, hideTooltip } from './utils/tooltip.js';
