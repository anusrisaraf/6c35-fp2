<!-- src/lib/components/GroupedBars.svelte -->
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  import { residualizeByIncome } from '../utils/stats.js';
  import { showTooltip, hideTooltip } from '../utils/tooltip.js';

  /** @type {import('../data/tracts.js').Tract[]} */
  export let data = [];
  export let incomeControlled = false;

  /** @type {SVGSVGElement} */
  let svgEl;

  const W = 520, H = 320;
  const M = { top: 18, right: 14, bottom: 56, left: 54 };
  const IW = W - M.left - M.right;
  const IH = H - M.top - M.bottom;

  onMount(() => draw());
  $: data, incomeControlled, svgEl && draw();

  function draw() {
    if (!svgEl) return;

    const base      = incomeControlled ? residualizeByIncome(data) : data;
    const yKey      = incomeControlled ? 'evictionResidual' : 'evictionRate';
    const medIncome = /** @type {number} */ (d3.median(base, (d) => d.medianIncome));

    const RACE_GROUPS   = ['Low NW', 'High NW'];
    const INCOME_GROUPS = ['Low inc', 'High inc'];

    /** @param {typeof base[0]} d */
    const raceGroup   = (d) => d.pctNonWhite   >= 0.5         ? 'High NW'  : 'Low NW';
    /** @param {typeof base[0]} d */
    const incomeGroup = (d) => d.medianIncome >= medIncome ? 'High inc' : 'Low inc';

    const lookup = new Map();
    const grouped = d3.rollups(base,
      (v) => ({ mean: d3.mean(v, (d) => d[yKey]) ?? 0, n: v.length }),
      (d) => raceGroup(d),
      (d) => incomeGroup(d)
    );
    for (const [rg, inner] of grouped)
      for (const [ig, obj] of inner)
        lookup.set(`${rg}||${ig}`, obj);

    const rows = RACE_GROUPS.flatMap((rg) =>
      INCOME_GROUPS.map((ig) => {
        const obj = lookup.get(`${rg}||${ig}`) ?? { mean: 0, n: 0 };
        return { raceGroup: rg, incomeGroup: ig, value: obj.mean, n: obj.n };
      })
    );

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    const bandKeys = rows.map((d) => `${d.raceGroup}·${d.incomeGroup}`);

    const x = d3.scaleBand().domain(bandKeys).range([M.left, M.left + IW]).padding(0.28);
    const yExtentMin = Math.min(0, /** @type {number} */ (d3.min(rows, (d) => d.value)));
    const yExtentMax = Math.max(0, /** @type {number} */ (d3.max(rows, (d) => d.value)));
    const y = d3.scaleLinear().domain([yExtentMin, yExtentMax]).nice().range([M.top + IH, M.top]);

    // Zero line
    svg.append('line')
      .attr('x1', M.left).attr('x2', M.left + IW)
      .attr('y1', y(0)).attr('y2', y(0))
      .attr('stroke', 'rgba(242,244,248,0.22)').attr('stroke-dasharray', '4,4');

    // Grid
    svg.append('g').attr('class', 'grid')
      .attr('transform', `translate(${M.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-IW).tickFormat(() => ''))
      .call((g) => g.select('.domain').remove());

    // X axis — race group line
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(0,${M.top + IH})`)
      .call(d3.axisBottom(x).tickFormat((k) => String(k).split('·')[0]));

    // X axis — income group line (offset)
    svg.append('g').attr('class', 'axis axis-sub')
      .attr('transform', `translate(0,${M.top + IH})`)
      .call(d3.axisBottom(x).tickFormat((k) => String(k).split('·')[1]))
      .call((g) => {
        g.selectAll('text').attr('dy', '1.9em').attr('fill', 'rgba(242,244,248,0.55)');
        g.select('.domain').attr('opacity', 0);
        g.selectAll('.tick line').remove();
      });

    // Y axis
    svg.append('g').attr('class', 'axis')
      .attr('transform', `translate(${M.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    // X label
    svg.append('text')
      .attr('x', M.left + IW / 2).attr('y', H - 6)
      .attr('text-anchor', 'middle')
      .attr('fill', 'rgba(242,244,248,0.6)').attr('font-family', 'DM Mono, monospace').attr('font-size', 11)
      .text('Race × income group');

    // Bars
    svg.append('g').selectAll('rect')
      .data(rows)
      .join('rect')
      .attr('x', (d) => /** @type {number} */ (x(`${d.raceGroup}·${d.incomeGroup}`)))
      .attr('width', x.bandwidth())
      .attr('y',      (d) => d.value >= 0 ? y(d.value) : y(0))
      .attr('height', (d) => Math.abs(y(d.value) - y(0)))
      .attr('rx', 7)
      .attr('fill', (d) => d.raceGroup === 'High NW' ? 'rgba(255,90,107,0.55)' : 'rgba(103,232,249,0.42)')
      .on('mouseenter', (evt, d) => {
        showTooltip(evt.clientX, evt.clientY,
          `<div class="tip-title">${d.raceGroup} · ${d.incomeGroup}</div>
           <div class="tip-grid">
             <div class="k">Avg</div><div><b>${d.value.toFixed(2)}${incomeControlled ? '' : '%'}</b></div>
             <div class="k">Tracts</div><div><b>${d.n}</b></div>
           </div>`
        );
        d3.select(evt.currentTarget).attr('opacity', 0.85);
      })
      .on('mouseleave', () => {
        hideTooltip();
        d3.selectAll('rect').attr('opacity', 1);
      });
  }
</script>

<svg bind:this={svgEl} viewBox="0 0 {W} {H}" aria-label="Grouped bars: race × income" />

<style>
  svg { width: 100%; height: auto; display: block; overflow: visible; }
</style>
