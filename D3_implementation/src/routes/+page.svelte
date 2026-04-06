<!-- src/routes/+page.svelte -->
<script>
  import { computeCorrelations } from '$lib/utils/stats.js';
  import { tracts, CORR_TARGETS } from '$lib/data/tracts.js';

  import OwnershipTrend  from '$lib/components/OwnershipTrend.svelte';
  import EvictionFilings from '$lib/components/EvictionFilings.svelte';
  import CorrBars        from '$lib/components/CorrBars.svelte';
  import Scatter         from '$lib/components/Scatter.svelte';
  import GroupedBars     from '$lib/components/GroupedBars.svelte';
  import PartialStats    from '$lib/components/PartialStats.svelte';
  import PolicyCards     from '$lib/components/PolicyCards.svelte';

  /** Shared state: income control toggle and highlighted predictor */
  let incomeControlled = false;
  /** @type {string | null} */
  let highlightKey = null;

  $: correlations = computeCorrelations(tracts, CORR_TARGETS, incomeControlled);

  function handleHighlight(/** @type {string | null} */ key) {
    highlightKey = key;
  }

  function resetHighlight() {
    highlightKey = null;
  }
</script>

<svelte:head>
  <title>Who Bears the Eviction Burden in Boston?</title>
  <meta name="description" content="Interactive proof-of-concept: exploring which neighborhood factors best predict eviction filing rates in Boston." />
</svelte:head>

<a class="skip-link" href="#main">Skip to main content</a>

<header>
  <div class="nav">
    <div class="brand">
      <div class="kicker">FP2 · Housing Affordability</div>
      <h1>Who Bears the Eviction Burden in Boston?</h1>
    </div>
    <div class="meta">Proof-of-concept · illustrative data</div>
  </div>
</header>

<main id="main">

  <!-- ─── Section 1: Setup ─────────────────────────────────────────── -->
  <section class="card section" id="setup">
    <div class="section-header">
      <span class="section-number">01</span>
      <div>
        <h2>Setup</h2>
        <p class="sub">
          Two trends that often get conflated: corporate ownership rising over time, and eviction
          filings surging post‑COVID. Hover points and bars for yearly values.
        </p>
      </div>
    </div>

    <div class="grid2">
      <div class="viz">
        <div class="viz-head">
          <p class="viz-title">Corporate ownership share</p>
          <p class="viz-note">2004–2024</p>
        </div>
        <OwnershipTrend />
      </div>

      <div class="viz">
        <div class="viz-head">
          <p class="viz-title">Eviction filings</p>
          <p class="viz-note">2020–2023</p>
        </div>
        <EvictionFilings />
      </div>
    </div>
  </section>

  <!-- ─── Section 2: Objection ─────────────────────────────────────── -->
  <section class="card section" id="objection">
    <div class="section-header">
      <span class="section-number">02</span>
      <div>
        <h2>Objection</h2>
        <p class="sub">
          Compare predictors side‑by‑side. Click a bar to highlight it across scatterplots.
          The correlation bars summarize strength; the scatterplots show why
          "race vs. evictions" looks different than "corporate ownership vs. evictions."
        </p>
      </div>
    </div>

    <div class="viz">
      <CorrBars
        rows={correlations}
        {highlightKey}
        onHighlight={handleHighlight}
      />

      <div class="spacer" />

      <Scatter
        data={tracts}
        predictorKey="pctNonWhite"
        {incomeControlled}
        {highlightKey}
        width={1040}
        height={320}
        title="Non‑white share vs eviction filing rate"
      />

      <div class="spacer" />

      <Scatter
        data={tracts}
        predictorKey="corpOwnership"
        {incomeControlled}
        {highlightKey}
        width={1040}
        height={320}
        title="Corporate ownership vs eviction filing rate"
      />
    </div>
  </section>

  <!-- ─── Section 3: Income × race ─────────────────────────────────── -->
  <section class="card section" id="analysis">
    <div class="section-header">
      <span class="section-number">03</span>
      <div>
        <h2>Income × race</h2>
        <p class="sub">
          Toggle income control to compare the raw relationship to an income‑controlled view.
          The grouped bars show average eviction rates across race × income groups.
        </p>
      </div>
    </div>

    <div class="viz">
      <div class="controls" role="group" aria-label="Income control">
        <label>
          Income control
          <select bind:value={incomeControlled} on:change={resetHighlight}>
            <option value={false}>off</option>
            <option value={true}>on</option>
          </select>
        </label>
        <button type="button" on:click={resetHighlight}>Reset highlight</button>
      </div>

      <div class="grid2">
        <GroupedBars data={tracts} {incomeControlled} />
        <PartialStats data={tracts} {incomeControlled} />
      </div>
    </div>
  </section>

  <!-- ─── Section 4: Call to action ────────────────────────────────── -->
  <section class="card section" id="action">
    <div class="section-header">
      <span class="section-number">04</span>
      <div>
        <h2>Call to action</h2>
        <p class="sub">Click a card to reveal the policy takeaway this evidence supports.</p>
      </div>
    </div>

    <PolicyCards />
  </section>

  <footer>
    <p>
      Proof-of-concept built with <strong>SvelteKit</strong> + <strong>D3.js</strong>.
      Data is illustrative — replace <code>src/lib/data/tracts.js</code> with your
      cleaned FP1 dataset to go live.
    </p>
  </footer>

</main>

<style>
  .skip-link {
    position: absolute;
    left: -999px;
    top: 8px;
    padding: 0.5rem 0.8rem;
    background: var(--panel);
    border: 1px solid var(--faint);
    border-radius: 10px;
    font-family: 'DM Mono', monospace;
    font-size: 0.875rem;
    z-index: 1000;
  }
  .skip-link:focus { left: 12px; }

  /* ── Header ─────────────────────────────────────────────────────── */
  header {
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(12px);
    background: linear-gradient(
      to bottom,
      rgba(11, 12, 15, 0.82),
      rgba(11, 12, 15, 0.25)
    );
    border-bottom: 1px solid var(--faint-2);
  }

  .nav {
    max-width: 1160px;
    margin: 0 auto;
    padding: 0.85rem 1.2rem;
    display: flex;
    gap: 1rem;
    align-items: baseline;
    justify-content: space-between;
  }

  .brand { display: grid; gap: 0.12rem; }

  .kicker {
    font-family: 'DM Mono', ui-monospace, monospace;
    font-size: 0.75rem;
    color: var(--accent-2);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .brand h1 {
    margin: 0;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(1.05rem, 2.4vw, 1.45rem);
    letter-spacing: -0.01em;
  }

  .meta {
    font-family: 'DM Mono', monospace;
    color: var(--muted);
    font-size: 0.82rem;
  }

  @media (max-width: 700px) { .meta { display: none; } }

  /* ── Layout ─────────────────────────────────────────────────────── */
  main {
    max-width: 1160px;
    margin: 0 auto;
    padding: 1.4rem 1.2rem 5rem;
  }

  .card {
    background: linear-gradient(180deg, rgba(255,255,255,0.035), transparent 70%), var(--panel);
    border: 1px solid var(--faint-2);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
  }

  .section {
    margin-top: 1.4rem;
    padding: 1.4rem 1.2rem;
  }

  .section-header {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .section-number {
    font-family: 'DM Mono', monospace;
    font-size: 0.75rem;
    color: var(--accent);
    letter-spacing: 0.1em;
    padding-top: 0.35rem;
    min-width: 2ch;
    opacity: 0.7;
  }

  h2 {
    margin: 0 0 0.3rem;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: clamp(1.1rem, 2vw, 1.35rem);
    letter-spacing: -0.01em;
  }

  .sub {
    margin: 0;
    color: var(--muted);
    font-family: 'DM Mono', ui-monospace, monospace;
    font-size: 0.88rem;
    max-width: 76ch;
    line-height: 1.6;
  }

  .grid2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    align-items: start;
  }
  @media (max-width: 860px) { .grid2 { grid-template-columns: 1fr; } }

  /* ── Viz boxes ───────────────────────────────────────────────────── */
  .viz {
    background: linear-gradient(180deg, rgba(255,255,255,0.025), transparent 70%), var(--panel-2);
    border: 1px solid var(--faint-2);
    border-radius: var(--radius);
    padding: 0.9rem;
  }

  .viz-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 0.65rem;
  }

  .viz-title {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    margin: 0;
    letter-spacing: 0.01em;
  }

  .viz-note {
    font-family: 'DM Mono', monospace;
    font-size: 0.78rem;
    color: var(--muted);
    margin: 0;
  }

  .spacer { height: 0.85rem; }

  /* ── Controls ────────────────────────────────────────────────────── */
  .controls {
    position: sticky;
    top: 68px;
    z-index: 20;
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem 0.85rem;
    align-items: center;
    margin-bottom: 0.85rem;
    padding: 0.65rem 0.75rem;
    border-radius: 12px;
    border: 1px solid var(--faint-2);
    background: rgba(0, 0, 0, 0.22);
  }

  .controls label {
    font-family: 'DM Mono', monospace;
    font-size: 0.84rem;
    color: rgba(242, 244, 248, 0.88);
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
  }

  .controls select {
    background: rgba(18, 20, 32, 0.75);
    color: var(--text);
    border: 1px solid var(--faint);
    border-radius: 8px;
    padding: 0.38rem 0.5rem;
    font-family: 'DM Mono', monospace;
    font-size: 0.84rem;
    cursor: pointer;
  }

  .controls button {
    background: rgba(255, 90, 107, 0.1);
    color: var(--text);
    border: 1px solid rgba(255, 90, 107, 0.3);
    padding: 0.38rem 0.65rem;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 0.84rem;
    transition: background 120ms ease, border-color 120ms ease;
  }

  .controls button:hover {
    background: rgba(255, 90, 107, 0.2);
    border-color: rgba(255, 90, 107, 0.5);
  }

  /* ── Footer ─────────────────────────────────────────────────────── */
  footer {
    margin-top: 2rem;
    padding-top: 1.2rem;
    border-top: 1px solid var(--faint-2);
    font-family: 'DM Mono', monospace;
    font-size: 0.85rem;
    color: var(--muted);
  }

  footer code {
    font-size: 0.9em;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 0.05rem 0.3rem;
    border-radius: 6px;
  }
</style>
