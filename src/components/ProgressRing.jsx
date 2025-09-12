import React from 'react';
import Svg, { Circle } from 'react-native-svg';

export default function ProgressRing({ size = 40, strokeWidth = 4, progress = 0.6, bg = 'rgba(0,0,0,0.06)', fg = '#000' }) {
  const r = (size - strokeWidth) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * progress;
  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={r} stroke={bg} strokeWidth={strokeWidth} fill="none" />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={fg}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${dash} ${c - dash}`}
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}

