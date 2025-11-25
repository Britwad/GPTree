/**
 * Centralized color palette for the GPTree project
 * Ensures consistency across all components and pages
 */

export const colors = {
  // Green palette
  superLightGreen: '#ecf8ecff',  // emerald-100 - used for backgrounds
  lightGreen: '#ddebddff',        // light green shade - used for headers and secondary backgrounds
  lightGreenHover: 'rgba(192, 212, 192, 1)', // slightly darker superLightGreen - used for hover states
  borderGreen: '#ecf8ecff',       // midpoint between superLightGreen and darkGreen - used for borders
  green: '#047857',             // emerald-700 - used for buttons and active elements
  darkGreen: '#065f46',         // emerald-900 - used for hover states and accents

  // Gray palette
  white: '#ffffff',
  darkGray: '#233529ff',          // gray-700 - used for text
  lightGray: '#e5e7eb',         // gray-200 - used for borders

  // Typography
  font: 'var(--font-inter)',
} as const;

// Export individual color variables for direct use
export const {
  superLightGreen,
  lightGreen,
  lightGreenHover,
  borderGreen,
  green,
  darkGreen,
  white,
  darkGray,
  lightGray,
  font,
} = colors;
