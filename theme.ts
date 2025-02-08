import { createTheme, colorsTuple } from '@mantine/core';

export const theme = createTheme({
  defaultRadius: 'md',
  cursorType: 'pointer',
  colors: {
    background: colorsTuple('#F9F4EF'),
    headline: colorsTuple('#020826'),
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
