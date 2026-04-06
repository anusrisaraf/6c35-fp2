<!-- src/lib/components/Scatter.svelte -->
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { PREDICTORS } from '../data/tracts.js';
  import { residualizeByIncome } from '../utils/stats.js';
  import { showTooltip, hideTooltip } from '../utils/tooltip.js';

  /** @type {import('../data/tracts.js').Tract[]} */
  export let data = [];

  /** Which predictor key to plot on x-axis */
  export let predictorKey = 'pctNonWhite';

  /** Whether to use income-controlled residuals on y */
  export let incomeControlled = false;

  /** Dim dots to grey when a different predictor is highlighted */
  export let highlightKey = null;

  export let title = '';
  export let width  = 520;
  export let height = 320;

  /** @type {SVGSVGElement} */
  let svgEl;

  const M = { top: 24, right: 18, bottom: 44, left: 58 };

  onMount(() => draw());
  $: data, predictorKey, incomeControlled, highlightKey, svgEl && draw();

  function draw() {
    if (!svgEl) return;
    const IW = width - M.left - M.right;
    const IH = height - M.top - M.bottom;

    const base  = incomeControlled ? residualizeByIncome(data) : data;
    const yKey  = incomeControlled ? 'evictionResidual' : 'evictionRate';
    const pred  = PREDICTORS.find((p) => p.key === predictorKey) ?? PREDICTORS[0];
    const dimmed = highlightKey !== null && highlightKey !== predictorKey;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const x = d3.scaleLinear()
      .domain(/** @type {[number,number]} */ (d3.extent(base, (d) => d[predictorKey])))
      .nice().range([M.left, M.left + IW]);

    const y = d3.scaleLinear()
      .domain(/** @type {[number,number]} */ (d3.extent(base, (d) => d[yKey])))
      .nice().range([M.top + IH, M.top]);

    // Grid
    svg.append('g').attr('class', 'grid')
      .attr('transform', `translate(${M.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-IW).tickFormat(() => ''))
      .call((g) => g.select('.domain').remove());

    // Axes
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${M.top + IH})`)
      .call(d3.axisBottom(x).ticks(5));

    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(${M.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    // Title
    if (title) {
      svg.append('text')
        .attr('x', M.left).attr('y', M.top - 6)
        .attr('text-anchor', 'start')
        .attr('fill', 'rgba(242,244,248,0.9)')
        .attr('font-family', 'Syne, sans-serif').attr('font-size', 13).attr('font-weight', 700)
        .text(title);
    }

    // Axis labels
    svg.append('text')
      .attr('x', M.left + IW / 2).attr('y', height - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(242,244,248,0.65)')
      .attr('font-family', 'DM Mono, monospace').attr('font-size', 11)
      .text(pred.label);

    svg.append('text')
      .attr('x', -(M.top + IH / 2)).attr('y', 14)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(242,244,248,0.65)')
      .attr('font-family', 'DM Mono, monospace').attr('font-size', 11)
      .text(incomeControlled ? 'eviction residual (income-controlled)' : 'eviction filing rate (%)');

    // Dots
    const dotFill = dimmed ? 'rgba(242,244,248,0.18)' : 'rgba(255, 90, 107, 0.68)';

    svg.append('g').selectAll('circle')
      .data(base)
      .join('circle')
      .attr('cx', (d) => x(d[predictorKey]))
      .attr('cy', (d) => y(d[yKey]))
      .attr('r', 6.5)
      .attr('fill', dotFill)
      .attr('fill-opacity', 0.85)
      .attr('stroke', 'rgba(242,244,248,0.2)').attr('stroke-width', 1)
      .on('mouseenter', (evt, d) => {
        showTooltip(evt.clientX, evt.clientY,
          `<div class="tip-title">${d.tract}</div>
           <div class="tip-grid">
             <div class="k">${pred.label}</div><div><b>${pred.fmt(d[predictorKey])}</b></div>
             <div class="k">Eviction rate</div><div><b>${d.evictionRate.toFixed(1)}%</b></div>
             <div class="k">Corp. ownership</div><div>${(d.corpOwnership * 100).toFixed(0)}%</div>
           </div>`
        );
        d3.select(evt.currentTarget)
          .attr('fill', 'rgba(103,232,249,0.85)')
          .attr('r', 8);
      })
      .on('mouseleave', (evt) => {
        hideTooltip();
        d3.select(evt.currentTarget).attr('fill', dotFill).attr('r', 6.5);
      });
  }
</script>

<svg bind:this={svgEl} viewBox="0 0 {width} {height}" aria-label="{title}" />

<style>
  svg { width: 100%; height: auto; display: block; overflow: visible; }
</style>
