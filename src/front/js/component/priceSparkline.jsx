import React from "react";

const WIDTH = 120;
const HEIGHT = 28;
const PAD = 2;

// Inline SVG rather than a charting dependency: this draws one polyline
// over ~60 points, which isn't worth ~100kb of bundle, and hand-rolling it
// means it inherits the game's neon styling instead of fighting a library's
// defaults.
const PriceSparkline = ({ series, baseCost }) => {
  if (!series || series.length < 2) {
    return <span className="sparkline-empty">—</span>;
  }

  // Robust scale (playtest: a +95% event spike zoomed the chart out and
  // flattened all the ordinary detail). Scale to the 10th-90th percentile
  // band and CLAMP the outliers to the edges - a spike reads as a run
  // pinned to the ceiling, a crash as a run along the floor, and the
  // everyday trading range keeps its resolution.
  const sorted = [...series].sort((a, b) => a - b);
  const q = (p) =>
    sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
  let lo = q(0.1);
  let hi = q(0.9);
  if (baseCost != null) {
    lo = Math.min(lo, baseCost);
    hi = Math.max(hi, baseCost);
  }
  // Flat series would divide by zero; give them a nominal band so the line
  // renders through the middle instead of collapsing.
  if (hi - lo < Math.max(1, hi * 0.01)) {
    const mid = (hi + lo) / 2 || 1;
    lo = mid * 0.99;
    hi = mid * 1.01;
  }
  const clamp = (v) => Math.min(hi, Math.max(lo, v));

  const x = (i) => PAD + (i / (series.length - 1)) * (WIDTH - PAD * 2);
  const y = (v) =>
    HEIGHT - PAD - ((clamp(v) - lo) / (hi - lo)) * (HEIGHT - PAD * 2);

  const path = series.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

  const first = series[0];
  const last = series[series.length - 1];
  const rising = last >= first;
  const stroke = rising ? "#8aff8a" : "#ff8a8a";

  // A dashed reference line at base cost turns the shape into information:
  // above it the item is expensive right now, below it it's cheap.
  const showBase = baseCost != null && baseCost >= lo && baseCost <= hi;

  const pctMove = first > 0 ? ((last - first) / first) * 100 : 0;

  return (
    <span className="sparkline-wrap" title={`${pctMove >= 0 ? "+" : ""}${pctMove.toFixed(1)}% over the last ${series.length} ticks`}>
      <svg
        className="sparkline"
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label={`Price trend ${pctMove >= 0 ? "up" : "down"} ${Math.abs(pctMove).toFixed(1)} percent`}
      >
        {showBase && (
          <line
            x1={PAD}
            x2={WIDTH - PAD}
            y1={y(baseCost)}
            y2={y(baseCost)}
            stroke="rgba(255,255,255,0.28)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
        )}
        <path d={path} fill="none" stroke={stroke} strokeWidth="1.5" />
      </svg>
    </span>
  );
};

export default PriceSparkline;
