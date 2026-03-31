import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  config: {
    initialColorMode: 'system', // Reads OS dark/light on first visit — no flash!
    useSystemColorMode: false,  // We manage it manually via the menu
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? '#0D1117' : '#F6F8FA',
        color: props.colorMode === 'dark' ? '#E6EDF3' : '#1F2328',
      },
      // Global Scrollbar Styling
      '::-webkit-scrollbar': {
        width: '10px',
      },
      '::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        background: props.colorMode === 'dark' ? '#30363D' : '#D0D7DE',
        borderRadius: '10px',
        border: '2px solid transparent',
        backgroundClip: 'content-box',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: props.colorMode === 'dark' ? '#484F58' : '#8C959F',
      },
      // Firefox Support
      html: {
        scrollbarWidth: 'thin',
        scrollbarColor: `${props.colorMode === 'dark' ? '#30363D' : '#D0D7DE'} transparent`,
      }
    })
  },
  fonts: {
    heading: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    body: `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`,
    mono: `ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas, Liberation Mono, monospace`,
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: 'lg',
        fontWeight: '500',
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
      },
      variants: {
        solid: (props) => ({
          bg: props.colorMode === 'dark' ? '#E6EDF3' : '#24292F',
          color: props.colorMode === 'dark' ? '#24292F' : '#FFFFFF',
          _hover: {
            bg: props.colorMode === 'dark' ? '#C9D1D9' : '#30363D',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
          _active: {
            transform: 'scale(0.98)',
          }
        }),
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: '#0969DA', // GitHub blue
      },
      variants: {
        outline: (props) => ({
          field: {
            borderRadius: 'lg',
            bg: props.colorMode === 'dark' ? '#0D1117' : '#FFFFFF',
            borderColor: props.colorMode === 'dark' ? '#30363D' : '#D0D7DE',
            _hover: {
              borderColor: props.colorMode === 'dark' ? '#8B949E' : '#8C959F',
            }
          }
        }),
      }
    },
  },
});

// Initialize i18next (must be imported before App)
import './i18n';

import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>
);
