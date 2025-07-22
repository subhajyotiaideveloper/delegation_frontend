import React from 'react';

interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export const PieChart: React.FC<PieChartProps> = ({ data, size = 160 }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;

  if (total === 0) {
    // Render a placeholder empty circle if no data
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={size/2 - 2} fill="#f3f4f6" stroke="#e5e7eb" strokeWidth={2} />
      </svg>
    );
  }

  // If only one slice has a value, render a full circle in that color
  const nonZeroSlices = data.filter(d => d.value > 0);
  if (nonZeroSlices.length === 1) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size/2}
          cy={size/2}
          r={size/2 - 2}
          fill={nonZeroSlices[0].color}
          stroke="#fff"
          strokeWidth={2}
        />
      </svg>
    );
  }

  const getPath = (value: number) => {
    const startAngle = (cumulative / total) * 2 * Math.PI;
    const endAngle = ((cumulative + value) / total) * 2 * Math.PI;
    cumulative += value;
    const x1 = size / 2 + (size / 2) * Math.sin(startAngle);
    const y1 = size / 2 - (size / 2) * Math.cos(startAngle);
    const x2 = size / 2 + (size / 2) * Math.sin(endAngle);
    const y2 = size / 2 - (size / 2) * Math.cos(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return [
      `M ${size / 2} ${size / 2}`,
      `L ${x1} ${y1}`,
      `A ${size / 2} ${size / 2} 0 ${largeArc} 1 ${x2} ${y2}`,
      'Z',
    ].join(' ');
  };

  cumulative = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((slice, i) => (
        <path
          key={i}
          d={getPath(slice.value)}
          fill={slice.color}
          stroke="#fff"
          strokeWidth={2}
        />
      ))}
    </svg>
  );
};
