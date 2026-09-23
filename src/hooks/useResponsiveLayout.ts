import { useWindowDimensions } from 'react-native';

export function useResponsiveLayout() {
  const { width, height } = useWindowDimensions();
  const columns = width >= 900 ? 3 : width >= 600 ? 2 : 1;
  const horizontalPadding = width >= 600 ? 28 : 18;
  const gap = 14;
  const contentWidth = Math.min(width, 1180) - horizontalPadding * 2;
  const cardWidth = (contentWidth - gap * (columns - 1)) / columns;

  return {
    width,
    height,
    isLandscape: width > height,
    isTablet: width >= 600,
    columns,
    horizontalPadding,
    gap,
    cardWidth,
  };
}
