<!-- src/lib/components/CorrBars.svelte -->
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { showTooltip, hideTooltip } from '../utils/tooltip.js';

  /** @type {{ key: string, label: string, color: string, r: number }[]} */
  export let rows = [];

  /** @type {string | null} */
  export let highlightKey = null;

  /** @type {(key: string | null) => void} */
  export let onHighlight = () => {};

  /** @type {SVGSVGElement} */
  let svgEl;

  const W = 1040, H = 300;
  const M = { top: 14, right: 10, bottom: 44, left: 118 };
  const IW = W - M.left - M.right;
  const IH = H - M.top - M.bottom;

  /** @type {import('d3').ScaleLinear<number,number>} */
  let x;
  /** @type {import('d3').ScaleBand<string>} */
  let y;

  onMount(() => {
    const svg = d3.select(svgEl);

    x = d3.scaleLinear().domain([-1, 1]).range([M.left, M.left + IW]);
    y = d3.scaleBand()
      .domain(rows.map((d) => d.key))
      .range([M.top, M.top + IH])
      .padding(0.24);

    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${M.top + IH})`)
      .call(d3.axisBottom(x).ticks(5));

    // Zero-line
    svg.append('line')
      .attr('x1', x(0)).attr('x2', x(0))
      .attr('y1', M.top).attr('y2', M.top + IH)
      .attr('stroke', 'rgba(242,244,248,0.22)')
      .attr('stroke-dasharray', '4,4');

    // X axis label
    svg.append('text')
      .attr('x', M.left + IW / 2).attr('y', H - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(242,244,248,0.65)')
      .attr('font-family', 'DM Mono, monospace').attr('font-size', 12)
      .text('Correlation (r)');

    // Y axis labels
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(${M.left},0)`)
      .call(d3.axisLeft(y).tickFormat((k) => rows.find((d) => d.key === k)?.label ?? k));

    // Bars group — will be updated reactively
    svg.append('g').attr('class', 'bars');
    svg.append('g').attr('class', 'rlabels');

    updateBars();
  });

  function updateBars() {
    if (!svgEl || !x || !y) return;
    const svg = d3.select(svgEl);

    // Bars
    svg.select('g.bars').selectAll('rect')
      .data(rows, (d) => d.key)
      .join('rect')
      .attr('x',      (d) => d.r < 0 ? x(d.r) : x(0))
      .attr('y',      (d) => /** @type {number} */ (y(d.key)))
      .attr('height', y.bandwidth())
      .attr('width',  (d) => Math.abs(x(d.r) - x(0)))
      .attr('rx', 7)
      .attr('fill',         (d) => d.color)
      .attr('fill-opacity', (d) => highlightKey && highlightKey !== d.key ? 0.22 : 0.82)
      .style('cursor', 'pointer')
      .on('mouseenter', (evt, d) => {
        showTooltip(evt.clientX, evt.clientY,
          `<div class="tip-title">${d.label}</div>
           <div class="tip-grid">
             <div class="k">Correlation</div><div><b>${d3.format('+.3f')(d.r)}</b></div>
           </div>`
        );
      })
      .on('mouseleave', () => hideTooltip())
      .on('click', (_, d) => {
        onHighlight(highlightKey === d.key ? null : d.key);
      });

    // r value labels
    svg.select('g.rlabels').selectAll('text')
      .data(rows, (d) => d.key)
      .join('text')
      .attr('x', (d) => d.r < 0 ? x(d.r) - 6 : x(d.r) + 6)
      .attr('y', (d) => /** @type {number} */ (y(d.key)) + y.bandwidth() / 2)
      .attr('dominant-baseline', 'middle')
      .attr('text-anchor', (d) => d.r < 0 ? 'end' : 'start')
      .attr('fill', 'rgba(242,244,248,0.75)')
      .attr('font-family', 'DM Mono, monospace').attr('font-size', 11)
      .text((d) => d3.format('+.3f')(d.r));
  }

  $: rows, highlightKey, updateBars();
</script>

<svg bind:this={svgEl} viewBox="0 0 {W} {H}" aria-label="Correlation bar chart" />

<style>
  svg { width: 100%; height: auto; display: block; overflow: visible; }
</style>
