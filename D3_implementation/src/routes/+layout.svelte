<!-- src/routes/+layout.svelte -->
<script>
  import Tooltip from '$lib/components/Tooltip.svelte';
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:ital,wght@0,400;0,500;1,400&family=DM+Serif+Display:ital@0;1&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<slot />
<Tooltip />

<!-- <style>
  :global(*) { box-sizing: border-box; }

  :global(:root) {
    --bg:       #0b0c0f;
    --panel:    #121420;
    --panel-2:  #0f111a;
    --text:     #f2f4f8;
    --muted:    rgba(242, 244, 248, 0.68);
    --faint:    rgba(242, 244, 248, 0.12);
    --faint-2:  rgba(242, 244, 248, 0.07);
    --accent:   #ff5a6b;
    --accent-2: #67e8f9;
    --good:     #34d399;
    --warn:     #fbbf24;
    --radius:   14px;
    --shadow:   0 18px 50px rgba(0, 0, 0, 0.5);
  }

  :global(body) {
    margin: 0;
    font-family: 'DM Serif Display', ui-serif, Georgia, serif;
    background:
      radial-gradient(ellipse 1200px 600px at 15% 0%, #12142b 0%, transparent 60%),
      radial-gradient(ellipse 1000px 500px at 75% 0%, #1a1632 0%, transparent 55%),
      var(--bg);
    color: var(--text);
    line-height: 1.55;
  }

  :global(a)      { color: inherit; }
  :global(button) { font: inherit; }
  :global(select) { font: inherit; }

  /* D3 axis styles — global because they're injected into SVG */
  :global(.axis text) {
    fill: rgba(242, 244, 248, 0.7);
    font-family: 'DM Mono', ui-monospace, monospace;
    font-size: 11px;
  }
  :global(.axis path),
  :global(.axis line) {
    stroke: rgba(242, 244, 248, 0.18);
  }
  :global(.grid line) {
    stroke: rgba(242, 244, 248, 0.1);
  }
</style> -->

<style>
  :global(*) { box-sizing: border-box; }

  :global(:root) {
    /* Base background from the very dark bars */
    --bg:       #111111; 
    --panel:    #1a1515; /* Tinted by the burgundy bar */
    --panel-2:  #0d0d0d;
    
    /* Main Text: Using the off-white/cream from the bottom bar */
    --text:     #f1f0e8; 
    --muted:    rgba(241, 240, 232, 0.65);
    --faint:    rgba(241, 240, 232, 0.1);
    --faint-2:  rgba(241, 240, 232, 0.05);

    /* --- Primary Theme Palette (Top Bar) --- */
    --burgundy: #3b0d0c; /* Deep burgundy */
    --silver:   #d2d7dd; /* Light blue-grey */
    --warm-grey:#bcbab0; /* Muted stone grey */

    /* --- Accent Palette (Bottom Bar) --- */
    --accent:   #0e8a8d; /* The Teal bar */
    --accent-2: #bcac88; /* The Tan/Gold bar */
    
    /* Semantic mapping */
    --good:     #0e8a8d; 
    --warn:     #3b0d0c;
    --radius:   14px;
    --shadow:   0 18px 50px rgba(0, 0, 0, 0.6);
  }

  :global(body) {
    margin: 0;
    font-family: 'DM Serif Display', ui-serif, Georgia, serif;
    /* Cleaned up the background to favor the "solemn" neutral look */
    background: 
      radial-gradient(circle at 20% 20%, #221a1a 0%, transparent 40%),
      var(--bg);
    color: var(--text);
    line-height: 1.55;
  }

  :global(a)      { color: var(--accent); text-decoration-color: var(--faint); }
  :global(button) { font: inherit; }
  :global(select) { font: inherit; }

  /* D3 axis styles — matching the warm-grey/silver tones */
  :global(.axis text) {
    fill: var(--warm-grey);
    font-family: 'DM Mono', ui-monospace, monospace;
    font-size: 11px;
  }
  :global(.axis path),
  :global(.axis line) {
    stroke: var(--faint);
  }
  :global(.grid line) {
    stroke: var(--faint-2);
  }
</style>
