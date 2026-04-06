<!-- src/lib/components/EvictionFilings.svelte -->
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { evictionFilings } from '../data/tracts.js';
  import { showTooltip, hideTooltip } from '../utils/tooltip.js';

  /** @type {SVGSVGElement} */
  let svgEl;

  const W = 520, H = 220;
  const M = { top: 16, right: 14, bottom: 34, left: 56 };
  const IW = W - M.left - M.right;
  const IH = H - M.top - M.bottom;

  onMount(() => {
    const svg = d3.select(svgEl);

    const x = d3.scaleBand()
      .domain(evictionFilings.map((d) => String(d.year)))
      .range([M.left, M.left + IW])
      .padding(0.28);

    const y = d3.scaleLinear()
      .domain([0, /** @type {number} */ (d3.max(evictionFilings, (d) => d.filings)) * 1.15])
      .nice()
      .range([M.top + IH, M.top]);

    // Grid
    svg.append('g').attr('class', 'grid')
      .attr('transform', `translate(${M.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-IW).tickFormat(() => ''))
      .call((g) => g.select('.domain').remove());

    // Axes
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${M.top + IH})`)
      .call(d3.axisBottom(x));

    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(${M.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format(',d')));

    // Bars
    svg.append('g').selectAll('rect')
      .data(evictionFilings)
      .join('rect')
      .attr('x',      (d) => /** @type {number} */ (x(String(d.year))))
      .attr('width',  x.bandwidth())
      .attr('y',      (d) => y(d.filings))
      .attr('height', (d) => M.top + IH - y(d.filings))
      .attr('rx', 7)
      .attr('fill', 'rgba(255, 90, 107, 0.6)')
      .on('mouseenter', (evt, d) => {
        showTooltip(evt.clientX, evt.clientY,
          `<div class="tip-title">${d.year}</div>
           <div class="tip-grid">
             <div class="k">Filings</div><div><b>${d3.format(',')(d.filings)}</b></div>
           </div>`
        );
        d3.select(evt.currentTarget).attr('fill', 'rgba(255, 90, 107, 0.9)');
      })
      .on('mouseleave', (evt) => {
        hideTooltip();
        d3.select(evt.currentTarget).attr('fill', 'rgba(255, 90, 107, 0.6)');
      });
  });
</script>

<svg bind:this={svgEl} viewBox="0 0 {W} {H}" aria-label="Eviction filings 2020–2023" />

<style>
  svg { width: 100%; height: auto; display: block; overflow: visible; }
</style>
