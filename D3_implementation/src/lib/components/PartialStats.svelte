<!-- src/lib/components/PartialStats.svelte -->
<script>
  import { computeCorrelations } from '../utils/stats.js';
  import { CORR_TARGETS } from '../data/tracts.js';

  /** @type {import('../data/tracts.js').Tract[]} */
  export let data = [];
  export let incomeControlled = false;

  $: corrs = computeCorrelations(data, CORR_TARGETS, incomeControlled);
  $: nonWhiteR   = corrs.find((d) => d.key === 'pctNonWhite')?.r   ?? 0;
  $: corpR       = corrs.find((d) => d.key === 'corpOwnership')?.r ?? 0;
  $: label       = incomeControlled ? 'Income‑controlled correlations' : 'Raw correlations';

  /** @param {number} r */
  const fmt = (r) => (r >= 0 ? '+' : '') + r.toFixed(3);
</script>

<div class="partial-stats">
  <div class="heading">{label}</div>
  <div class="stat-list">
    {#each [['% non‑white', nonWhiteR], ['Corporate ownership', corpR]] as [name, r]}
      <div class="stat-card">
        <div class="stat-label">{name}</div>
        <div class="stat-value" class:negative={r < 0}>r = {fmt(r)}</div>
      </div>
    {/each}
  </div>
  <p class="note">
    {#if incomeControlled}
      After removing the effect of income, the racial correlation weakens while corporate ownership remains a strong <em>negative</em> predictor — denser corporate markets skew wealthier.
    {:else}
      Raw correlations capture the unadjusted relationship with eviction filing rate. Toggle income control to isolate the residual signal.
    {/if}
  </p>
</div>

<style>
  .partial-stats {
    font-family: 'DM Mono', ui-monospace, monospace;
    color: rgba(242,244,248,0.9);
  }

  .heading {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
    letter-spacing: 0.02em;
  }

  .stat-list {
    display: grid;
    gap: 0.6rem;
  }

  .stat-card {
    padding: 0.7rem 0.85rem;
    border: 1px solid rgba(242,244,248,0.1);
    border-radius: 12px;
    background: rgba(0,0,0,0.22);
    transition: border-color 200ms ease;
  }

  .stat-card:hover {
    border-color: rgba(103,232,249,0.3);
  }

  .stat-label {
    color: rgba(242,244,248,0.65);
    font-size: 0.82rem;
    margin-bottom: 0.25rem;
  }

  .stat-value {
    font-weight: 700;
    font-size: 1.15rem;
    color: #67e8f9;
    letter-spacing: 0.03em;
  }

  .stat-value.negative {
    color: #ff5a6b;
  }

  .note {
    margin: 0.9rem 0 0;
    font-family: 'DM Mono', ui-monospace, monospace;
    font-size: 0.82rem;
    color: rgba(242,244,248,0.55);
    line-height: 1.55;
  }
</style>
