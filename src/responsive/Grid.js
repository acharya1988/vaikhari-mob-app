import React from 'react';
import { View, useWindowDimensions } from 'react-native';

// Simple responsive grid: 1/2/3 columns depending on width
export default function Grid({ children, gap = 12 }) {
  const { width } = useWindowDimensions();
  let columns = 1;
  if (width >= 900) columns = 3;
  else if (width >= 600) columns = 2;

  const items = React.Children.toArray(children);
  const rows = [];
  for (let i = 0; i < items.length; i += columns) {
    rows.push(items.slice(i, i + columns));
  }

  return (
    <View style={{ gap }}>
      {rows.map((row, idx) => (
        <View key={idx} style={{ flexDirection: 'row', gap }}>
          {row.map((child, cIdx) => (
            <View key={cIdx} style={{ flex: 1 }}>{child}</View>
          ))}
          {row.length < columns && [...Array(columns - row.length)].map((_, fIdx) => (
            <View key={`f-${fIdx}`} style={{ flex: 1 }} />
          ))}
        </View>
      ))}
    </View>
  );
}

