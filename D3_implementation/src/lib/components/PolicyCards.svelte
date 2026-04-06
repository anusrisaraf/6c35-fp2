<!-- src/lib/components/PolicyCards.svelte -->
<script>
  import { POLICY_CARDS } from '../data/tracts.js';

  /** @type {string | null} */
  let activeId = null;

  $: detail = activeId ? POLICY_CARDS.find((c) => c.id === activeId)?.detail ?? null : null;

  /** @param {string} id */
  function toggle(id) {
    activeId = activeId === id ? null : id;
  }
</script>

<div class="cards" role="group" aria-label="Policy recommendation cards">
  {#each POLICY_CARDS as card}
    <button
      class="policy-card"
      class:active={activeId === card.id}
      type="button"
      aria-pressed={activeId === card.id}
      on:click={() => toggle(card.id)}
    >
      <h4>{card.title}</h4>
      <p>{card.blurb}</p>
    </button>
  {/each}
</div>

<p class="detail" aria-live="polite">
  {detail ?? 'Click a card to show the takeaway.'}
</p>

<style>
  .cards {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
  }

  @media (max-width: 700px) {
    .cards { grid-template-columns: 1fr; }
  }

  .policy-card {
    padding: 0.95rem 1rem;
    border-radius: 14px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(242,244,248,0.1);
    cursor: pointer;
    transition: transform 120ms ease, border-color 150ms ease, background 150ms ease;
    font-family: 'DM Mono', ui-monospace, monospace;
    text-align: left;
    color: rgba(242,244,248,0.92);
  }

  .policy-card:hover {
    transform: translateY(-2px);
    border-color: rgba(255,90,107,0.4);
    background: rgba(255,255,255,0.07);
  }

  .policy-card.active {
    border-color: rgba(103,232,249,0.45);
    background: rgba(103,232,249,0.07);
  }

  .policy-card h4 {
    margin: 0 0 0.4rem;
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.01em;
  }

  .policy-card p {
    margin: 0;
    color: rgba(242,244,248,0.68);
    font-size: 0.87rem;
    line-height: 1.45;
  }

  .detail {
    margin-top: 0.85rem;
    font-family: 'DM Mono', ui-monospace, monospace;
    font-size: 0.9rem;
    color: rgba(242,244,248,0.75);
    line-height: 1.6;
    min-height: 3.2rem;
    border-left: 3px solid rgba(255,90,107,0.5);
    padding-left: 0.9rem;
  }
</style>
