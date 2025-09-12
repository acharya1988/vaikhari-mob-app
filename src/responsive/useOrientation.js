import { useWindowDimensions } from 'react-native';

export default function useOrientation() {
  const { width, height } = useWindowDimensions();
  const orientation = width > height ? 'landscape' : 'portrait';
  const shortest = Math.min(width, height);
  const isTablet = shortest >= 600;
  return { orientation, isTablet, width, height };
}

