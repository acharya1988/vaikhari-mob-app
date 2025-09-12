import { useWindowDimensions } from 'react-native';

// Hook that returns best match given { phoneP, phoneL, tabletP, tabletL }
export default function useResponsiveValue(map) {
  const { width, height } = useWindowDimensions();
  const orientation = width > height ? 'landscape' : 'portrait';
  const shortest = Math.min(width, height);
  const isTablet = shortest >= 600;

  if (isTablet && orientation === 'landscape' && map.tabletL !== undefined) return map.tabletL;
  if (isTablet && orientation === 'portrait' && map.tabletP !== undefined) return map.tabletP;
  if (!isTablet && orientation === 'landscape' && map.phoneL !== undefined) return map.phoneL;
  if (!isTablet && orientation === 'portrait' && map.phoneP !== undefined) return map.phoneP;
  // Fallback priority
  return map.tabletL ?? map.tabletP ?? map.phoneL ?? map.phoneP;
}

