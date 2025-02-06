import { createTheme, colorsTuple } from '@mantine/core';

export const theme = createTheme({
  defaultRadius: 'md',
  cursorType: 'pointer',
  // autoContrast: false,
  // spacing: 'md',
  // lineHeights: 'md'
  colors: {
    background: colorsTuple('#F9F4EF'),
    headline: colorsTuple('#020826'),
    // paragraph: colorsTuple('#E9BF36'),
    // paragraph: colorsTuple('#389FE9'),
    paragraph: colorsTuple('#020826'),
    button: colorsTuple('#8C7851'),
    buttonText: colorsTuple('#FFFFFF'),
  },
  fontFamily: 'Verdana, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Greycliff CF, sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        color: 'button',
      },
      styles: {
        root: {
          // color: 'var(--mantine-color-buttonText-0)',
          color: 'buttonText',
        },
      },
    },
    Text: {
      defaultProps: {
        color: 'paragraph',
      },
    },
    Title: {
      defaultProps: {
        color: 'headline',
      },
    },
  },

  primaryColor: 'button',
  primaryShade: 5,
});
