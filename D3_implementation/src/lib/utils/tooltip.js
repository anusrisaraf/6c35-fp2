// src/lib/utils/tooltip.js
import { writable } from 'svelte/store';

/**
 * @typedef {{ show: boolean, x: number, y: number, html: string }} TooltipState
 */

/** @type {import('svelte/store').Writable<TooltipState>} */
export const tooltip = writable({ show: false, x: 0, y: 0, html: '' });

/**
 * @param {number} x
 * @param {number} y
 * @param {string} html
 */
export function showTooltip(x, y, html) {
  tooltip.set({ show: true, x, y, html });
}

export function hideTooltip() {
  tooltip.update((t) => ({ ...t, show: false }));
}
