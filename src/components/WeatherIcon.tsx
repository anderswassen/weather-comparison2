'use client';

// SMHI Wsymb2 weather symbol mapping (1-27)
// Groups: 1-6 clear/cloudy, 7 fog, 8-10 rain showers, 11 thunderstorm,
// 12-14 sleet showers, 15-17 snow showers, 18-20 rain, 21 thunder,
// 22-24 sleet, 25-27 snowfall

interface WeatherIconProps {
  symbol: number;
  size?: number;
  className?: string;
}

const SYMBOL_INFO: Record<number, { label: string; labelSv: string }> = {
  1: { label: 'Clear sky', labelSv: 'Klart' },
  2: { label: 'Nearly clear', labelSv: 'Mestadels klart' },
  3: { label: 'Variable cloudiness', labelSv: 'Varierande molnighet' },
  4: { label: 'Halfclear', labelSv: 'Halvklart' },
  5: { label: 'Cloudy', labelSv: 'Molnigt' },
  6: { label: 'Overcast', labelSv: 'Mulet' },
  7: { label: 'Fog', labelSv: 'Dimma' },
  8: { label: 'Light rain showers', labelSv: 'Lätta regnskurar' },
  9: { label: 'Moderate rain showers', labelSv: 'Måttliga regnskurar' },
  10: { label: 'Heavy rain showers', labelSv: 'Kraftiga regnskurar' },
  11: { label: 'Thunderstorm', labelSv: 'Åskväder' },
  12: { label: 'Light sleet showers', labelSv: 'Lätta snöblandade skurar' },
  13: { label: 'Moderate sleet showers', labelSv: 'Måttliga snöblandade skurar' },
  14: { label: 'Heavy sleet showers', labelSv: 'Kraftiga snöblandade skurar' },
  15: { label: 'Light snow showers', labelSv: 'Lätta snöbyar' },
  16: { label: 'Moderate snow showers', labelSv: 'Måttliga snöbyar' },
  17: { label: 'Heavy snow showers', labelSv: 'Kraftiga snöbyar' },
  18: { label: 'Light rain', labelSv: 'Lätt regn' },
  19: { label: 'Moderate rain', labelSv: 'Måttligt regn' },
  20: { label: 'Heavy rain', labelSv: 'Kraftigt regn' },
  21: { label: 'Thunder', labelSv: 'Åska' },
  22: { label: 'Light sleet', labelSv: 'Lätt snöblandat regn' },
  23: { label: 'Moderate sleet', labelSv: 'Måttligt snöblandat regn' },
  24: { label: 'Heavy sleet', labelSv: 'Kraftigt snöblandat regn' },
  25: { label: 'Light snowfall', labelSv: 'Lätt snöfall' },
  26: { label: 'Moderate snowfall', labelSv: 'Måttligt snöfall' },
  27: { label: 'Heavy snowfall', labelSv: 'Kraftigt snöfall' },
};

export function getWeatherLabel(symbol: number, lang: 'en' | 'sv' = 'en'): string {
  const info = SYMBOL_INFO[symbol];
  if (!info) return '';
  return lang === 'sv' ? info.labelSv : info.label;
}

// Sun shape
function Sun({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#FBBF24" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = cx + Math.cos(rad) * (r + 1.5);
        const y1 = cy + Math.sin(rad) * (r + 1.5);
        const x2 = cx + Math.cos(rad) * (r + 3.5);
        const y2 = cy + Math.sin(rad) * (r + 3.5);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FBBF24" strokeWidth={1.2} strokeLinecap="round" />;
      })}
    </g>
  );
}

// Cloud shape
function Cloud({ x, y, scale = 1, fill = '#94A3B8' }: { x: number; y: number; scale?: number; fill?: string }) {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <circle cx={0} cy={0} r={5} fill={fill} />
      <circle cx={5} cy={-2} r={6} fill={fill} />
      <circle cx={11} cy={0} r={5} fill={fill} />
      <rect x={-2} y={0} width={15} height={5} rx={2} fill={fill} />
    </g>
  );
}

// Rain drops
function RainDrops({ x, y, count }: { x: number; y: number; count: number }) {
  const drops = [];
  for (let i = 0; i < count; i++) {
    drops.push(
      <line
        key={i}
        x1={x + i * 4}
        y1={y}
        x2={x + i * 4 - 1.5}
        y2={y + 4}
        stroke="#3B82F6"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
    );
  }
  return <g>{drops}</g>;
}

// Snow dots
function SnowDots({ x, y, count }: { x: number; y: number; count: number }) {
  const dots = [];
  for (let i = 0; i < count; i++) {
    dots.push(
      <circle key={i} cx={x + i * 4} cy={y + (i % 2) * 2.5} r={1.2} fill="#93C5FD" />
    );
  }
  return <g>{dots}</g>;
}

// Lightning bolt
function Lightning({ x, y }: { x: number; y: number }) {
  return <polygon points={`${x},${y} ${x + 2},${y + 4} ${x + 0.5},${y + 4} ${x + 2.5},${y + 8} ${x - 0.5},${y + 3.5} ${x + 1.5},${y + 3.5}`} fill="#FBBF24" />;
}

function renderSymbol(symbol: number, s: number) {
  // s = size for viewBox scaling
  switch (symbol) {
    // Clear sky
    case 1:
      return <Sun cx={s / 2} cy={s / 2} r={s * 0.25} />;

    // Nearly clear
    case 2:
      return (
        <g>
          <Sun cx={s * 0.35} cy={s * 0.35} r={s * 0.2} />
          <Cloud x={s * 0.35} y={s * 0.52} scale={0.65} />
        </g>
      );

    // Variable cloudiness
    case 3:
      return (
        <g>
          <Sun cx={s * 0.3} cy={s * 0.3} r={s * 0.17} />
          <Cloud x={s * 0.25} y={s * 0.42} scale={0.8} />
        </g>
      );

    // Halfclear
    case 4:
      return (
        <g>
          <Sun cx={s * 0.28} cy={s * 0.28} r={s * 0.15} />
          <Cloud x={s * 0.2} y={s * 0.38} scale={0.9} />
        </g>
      );

    // Cloudy
    case 5:
      return <Cloud x={s * 0.15} y={s * 0.35} scale={1} />;

    // Overcast
    case 6:
      return (
        <g>
          <Cloud x={s * 0.1} y={s * 0.25} scale={0.8} fill="#9CA3AF" />
          <Cloud x={s * 0.2} y={s * 0.4} scale={1} fill="#6B7280" />
        </g>
      );

    // Fog
    case 7:
      return (
        <g>
          {[0.3, 0.45, 0.6].map((yFrac, i) => (
            <line key={i} x1={s * 0.15} y1={s * yFrac} x2={s * 0.85} y2={s * yFrac} stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" strokeDasharray="3 2" />
          ))}
        </g>
      );

    // Light rain showers (8), moderate (9), heavy (10)
    case 8:
      return (
        <g>
          <Sun cx={s * 0.25} cy={s * 0.22} r={s * 0.13} />
          <Cloud x={s * 0.2} y={s * 0.32} scale={0.8} />
          <RainDrops x={s * 0.3} y={s * 0.7} count={2} />
        </g>
      );
    case 9:
      return (
        <g>
          <Sun cx={s * 0.25} cy={s * 0.22} r={s * 0.13} />
          <Cloud x={s * 0.2} y={s * 0.32} scale={0.8} />
          <RainDrops x={s * 0.25} y={s * 0.7} count={3} />
        </g>
      );
    case 10:
      return (
        <g>
          <Sun cx={s * 0.25} cy={s * 0.22} r={s * 0.13} />
          <Cloud x={s * 0.2} y={s * 0.32} scale={0.8} />
          <RainDrops x={s * 0.22} y={s * 0.7} count={4} />
        </g>
      );

    // Thunderstorm
    case 11:
      return (
        <g>
          <Cloud x={s * 0.15} y={s * 0.2} scale={0.9} fill="#6B7280" />
          <Lightning x={s * 0.38} y={s * 0.55} />
          <RainDrops x={s * 0.55} y={s * 0.7} count={2} />
        </g>
      );

    // Light sleet showers (12), moderate (13), heavy (14)
    case 12:
    case 13:
    case 14: {
      const drops = symbol - 11;
      return (
        <g>
          <Sun cx={s * 0.25} cy={s * 0.22} r={s * 0.13} />
          <Cloud x={s * 0.2} y={s * 0.32} scale={0.8} />
          <RainDrops x={s * 0.25} y={s * 0.68} count={drops} />
          <SnowDots x={s * 0.45} y={s * 0.72} count={drops} />
        </g>
      );
    }

    // Light snow showers (15), moderate (16), heavy (17)
    case 15:
    case 16:
    case 17: {
      const dots = symbol - 13;
      return (
        <g>
          <Sun cx={s * 0.25} cy={s * 0.22} r={s * 0.13} />
          <Cloud x={s * 0.2} y={s * 0.32} scale={0.8} />
          <SnowDots x={s * 0.25} y={s * 0.7} count={dots} />
        </g>
      );
    }

    // Light rain (18), moderate (19), heavy (20)
    case 18:
      return (
        <g>
          <Cloud x={s * 0.15} y={s * 0.25} scale={1} fill="#6B7280" />
          <RainDrops x={s * 0.3} y={s * 0.65} count={2} />
        </g>
      );
    case 19:
      return (
        <g>
          <Cloud x={s * 0.15} y={s * 0.25} scale={1} fill="#6B7280" />
          <RainDrops x={s * 0.25} y={s * 0.65} count={3} />
        </g>
      );
    case 20:
      return (
        <g>
          <Cloud x={s * 0.15} y={s * 0.25} scale={1} fill="#6B7280" />
          <RainDrops x={s * 0.2} y={s * 0.65} count={4} />
        </g>
      );

    // Thunder
    case 21:
      return (
        <g>
          <Cloud x={s * 0.15} y={s * 0.2} scale={0.9} fill="#6B7280" />
          <Lightning x={s * 0.4} y={s * 0.55} />
        </g>
      );

    // Light sleet (22), moderate (23), heavy (24)
    case 22:
    case 23:
    case 24: {
      const n = symbol - 21;
      return (
        <g>
          <Cloud x={s * 0.15} y={s * 0.25} scale={1} fill="#6B7280" />
          <RainDrops x={s * 0.25} y={s * 0.63} count={n} />
          <SnowDots x={s * 0.45} y={s * 0.67} count={n} />
        </g>
      );
    }

    // Light snowfall (25), moderate (26), heavy (27)
    case 25:
    case 26:
    case 27: {
      const n = symbol - 23;
      return (
        <g>
          <Cloud x={s * 0.15} y={s * 0.25} scale={1} fill="#6B7280" />
          <SnowDots x={s * 0.25} y={s * 0.65} count={n} />
        </g>
      );
    }

    default:
      return null;
  }
}

export function WeatherIcon({ symbol, size = 32, className }: WeatherIconProps) {
  const s = 32; // internal viewBox size
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${s} ${s}`}
      className={className}
      role="img"
      aria-label={SYMBOL_INFO[symbol]?.label ?? `Weather symbol ${symbol}`}
    >
      {renderSymbol(symbol, s)}
    </svg>
  );
}
