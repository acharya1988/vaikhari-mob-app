import React from 'react';
import { View, Text as RNText } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Stop, Text } from 'react-native-svg';
import { gradients } from '../theme/gradients';

// Expo Go friendly gradient text using react-native-svg
export default function GradientText({ children, preset = 'purpleBright', style = {} }) {
  const stops = gradients[preset] || gradients.purpleBright;
  const fontSize = style?.fontSize ?? 16;
  const fontWeight = style?.fontWeight ?? '700';
  const fontFamily = style?.fontFamily;
  // Measure width is non-trivial; render with a hidden RNText to approximate width via onLayout
  const [dims, setDims] = React.useState({ width: 0, height: fontSize * 1.2 });
  const handleLayout = React.useCallback((e) => {
    const w = e?.nativeEvent?.layout?.width ?? 0;
    if (w && Math.abs(w - dims.width) > 0.5) {
      setDims((d) => ({ ...d, width: w }));
    }
  }, [dims.width]);

  return (
    <View onLayout={handleLayout}>
      {/* Hidden text to get width */}
      <RNText style={[{ position: 'absolute', opacity: 0 }, style]}>{children}</RNText>
      {dims.width > 0 ? (
        <Svg width={dims.width} height={dims.height}>
          <Defs>
            <SvgLinearGradient id="gt" x1="0" y1="0" x2="1" y2="1">
              {stops.map((c, i) => (
                <Stop key={i} offset={`${(i / (stops.length - 1)) * 100}%`} stopColor={c} />
              ))}
            </SvgLinearGradient>
          </Defs>
          <Text
            fill="url(#gt)"
            x={0}
            y={fontSize}
            fontSize={fontSize}
            fontWeight={fontWeight}
            fontFamily={fontFamily}
          >
            {String(children)}
          </Text>
        </Svg>
      ) : null}
    </View>
  );
}
