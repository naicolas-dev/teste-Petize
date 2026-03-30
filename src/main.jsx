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
