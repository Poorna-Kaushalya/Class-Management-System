export default function MarksMiniChart({ data = [], height = 110 }) {
  const w = 320;
  const h = height;

  // paddings inside svg
  const padTop = 8;
  const padBottom = 12;
  const padX = 10;

  const safe = (data || []).map((d) => ({
    label: d.label,
    value: Number.isFinite(Number(d.value)) ? Number(d.value) : null,
  }));

  const values = safe.map((d) => d.value).filter((v) => v !== null);
  const minV = 0; // start from 0 for bar chart
  const maxV = values.length ? Math.max(...values) : 100;
  const range = Math.max(1, maxV - minV);

  const innerW = w - padX * 2;
  const innerH = h - padTop - padBottom;

  const n = Math.max(1, safe.length);
  const gap = 6;
  const barW = Math.max(8, (innerW - gap * (n - 1)) / n);

  // map value -> bar height
  const barHeight = (v) => (innerH * (v - minV)) / range;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* baseline */}
        <line
          x1={padX}
          y1={padTop + innerH}
          x2={w - padX}
          y2={padTop + innerH}
          stroke="#e2e8f0"
          strokeWidth="1"
        />

        {/* mid line */}
        <line
          x1={padX}
          y1={padTop + innerH / 2}
          x2={w - padX}
          y2={padTop + innerH / 2}
          stroke="#f1f5f9"
          strokeWidth="1"
        />

        {safe.map((d, i) => {
          const v = d.value;
          const x = padX + i * (barW + gap);

          // if missing value -> render faded empty bar
          if (v === null) {
            return (
              <rect
                key={i}
                x={x}
                y={padTop}
                width={barW}
                height={innerH}
                rx="4"
                fill="#f1f5f9"
              />
            );
          }

          const bh = barHeight(v);
          const y = padTop + (innerH - bh);

          return (
            <g key={i}>
              {/* bar */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={bh}
                rx="4"
                fill="#10b981"
              />

              {/* value in middle of bar */}
              {bh >= 14 && (
                <text
                  x={x + barW / 2}
                  y={y + bh / 2 + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill="#ffffff"
                >
                  {Math.round(v)}
                </text>
              )}

              {/* if bar too small, show value above bar */}
              {bh < 14 && (
                <text
                  x={x + barW / 2}
                  y={y - 2}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="800"
                  fill="#334155"
                >
                  {Math.round(v)}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* bottom labels */}
      <div className="mt-1 grid grid-cols-12 gap-1 text-[10px] text-slate-500 font-bold">
        {safe.map((d, i) => (
          <div key={i} className="text-center truncate">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}
