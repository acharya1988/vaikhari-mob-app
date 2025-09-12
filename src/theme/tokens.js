export const colors = {
  // Mono
  black: '#000000',
  white: '#FFFFFF',
  grey: '#86868B',

  // Dark text accents
  salmon: '#F4ADAD',
  green: '#C6F6A6',
  purple: '#F5C5E9',
  teal: '#90E2CF',
  orange: '#F5B561',

  // Dark backgrounds
  bgTeal: '#2E2E39',
  bgBlue: '#142139',
  bgGreen: '#173038',
  bgOldInk: '#33293B',
  bgBrown: '#5E1E2B',
};

export const spacing = [4, 8, 12, 16, 20, 24, 32, 40];
export const radii = [8, 12, 16, 24, 32];

export const hairline = (opacity = 0.08) => ({
  borderWidth: 1,
  borderColor: `rgba(0,0,0,${opacity})`,
});

