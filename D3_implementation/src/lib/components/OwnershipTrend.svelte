<!-- src/lib/components/OwnershipTrend.svelte -->
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { ownershipTrend } from '../data/tracts.js';
  import { showTooltip, hideTooltip } from '../utils/tooltip.js';

  /** @type {SVGSVGElement} */
  let svgEl;

  const W = 520, H = 220;
  const M = { top: 16, right: 14, bottom: 34, left: 50 };
  const IW = W - M.left - M.right;
  const IH = H - M.top - M.bottom;

  onMount(() => {
    const svg = d3.select(svgEl);

    const x = d3.scaleLinear()
      .domain(d3.extent(ownershipTrend, (d) => d.year))
      .range([M.left, M.left + IW]);

    const y = d3.scaleLinear()
      .domain([0, /** @type {number} */ (d3.max(ownershipTrend, (d) => d.share)) * 1.15])
      .nice()
      .range([M.top + IH, M.top]);

    // Grid
    svg.append('g')
      .attr('class', 'grid')
      .attr('transform', `translate(${M.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-IW).tickFormat(() => ''))
      .call((g) => g.select('.domain').remove());

    // Axes
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${M.top + IH})`)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format('d')));

    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(${M.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.0%')));

    // Area fill
    const area = d3.area()
      .x((d) => x(d.year))
      .y0(M.top + IH)
      .y1((d) => y(d.share))
      .curve(d3.curveMonotoneX);

    svg.append('path').datum(ownershipTrend)
      .attr('d', area)
      .attr('fill', 'rgba(103, 232, 249, 0.12)');

    // Line
    const line = d3.line()
      .x((d) => x(d.year))
      .y((d) => y(d.share))
      .curve(d3.curveMonotoneX);

    svg.append('path').datum(ownershipTrend)
      .attr('d', line)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(103, 232, 249, 0.9)')
      .attr('stroke-width', 2.2);

    // Dots
    svg.append('g').selectAll('circle')
      .data(ownershipTrend)
      .join('circle')
      .attr('cx', (d) => x(d.year))
      .attr('cy', (d) => y(d.share))
      .attr('r', 4)
      .attr('fill', 'rgba(103, 232, 249, 0.8)')
      .attr('fill-opacity', 0.5)
      .on('mouseenter', (evt, d) => {
        showTooltip(evt.clientX, evt.clientY,
          `<div class="tip-title">${d.year}</div>
           <div class="tip-grid">
             <div class="k">Ownership share</div><div><b>${d3.format('.1%')(d.share)}</b></div>
           </div>`
        );
        d3.select(evt.currentTarget).attr('fill-opacity', 1).attr('r', 5.5);
      })
      .on('mouseleave', (evt) => {
        hideTooltip();
        d3.select(evt.currentTarget).attr('fill-opacity', 0.5).attr('r', 4);
      });
  });
</script>

<svg bind:this={svgEl} viewBox="0 0 {W} {H}" aria-label="Corporate ownership trend 2004–2024" />

<style>
  svg { width: 100%; height: auto; display: block; overflow: visible; }
</style>
