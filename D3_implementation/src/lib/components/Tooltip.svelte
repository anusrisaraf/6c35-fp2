<!-- src/lib/components/Tooltip.svelte -->
<script>
  import { tooltip } from '../utils/tooltip.js';

  $: style = `left:${clamp($tooltip.x + 12, 12, windowW - 280)}px;top:${clamp($tooltip.y + 12, 12, windowH - 120)}px`;

  let windowW = 1200;
  let windowH = 800;

  /** @param {number} v @param {number} lo @param {number} hi */
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
</script>

<svelte:window bind:innerWidth={windowW} bind:innerHeight={windowH} />

<div
  class="tooltip"
  class:show={$tooltip.show}
  {style}
  role="status"
  aria-live="polite"
>
  {@html $tooltip.html}
</div>

<style>
  .tooltip {
    position: fixed;
    z-index: 999;
    pointer-events: none;
    padding: 0.55rem 0.7rem;
    border-radius: 12px;
    background: rgba(18, 20, 32, 0.9);
    border: 1px solid rgba(242, 244, 248, 0.14);
    color: rgba(242, 244, 248, 0.92);
    box-shadow: 0 14px 42px rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(8px);
    font-family: 'DM Mono', ui-monospace, monospace;
    font-size: 0.84rem;
    opacity: 0;
    transform: translateY(4px);
    transition: opacity 140ms ease, transform 140ms ease;
  }

  .tooltip.show {
    opacity: 1;
    transform: translateY(0);
  }

  :global(.tip-title) {
    font-weight: 700;
    margin-bottom: 0.3rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.02em;
  }

  :global(.tip-grid) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.2rem 0.6rem;
  }

  :global(.tip-grid .k) {
    color: rgba(242, 244, 248, 0.65);
  }
</style>
