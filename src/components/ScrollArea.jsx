import { Box, useColorModeValue } from '@chakra-ui/react';

/**
 * ScrollArea - A reusable component that provides a styled scrollbar
 * following the project's design system, similar to Chakra UI v3's ScrollArea.
 */
export function ScrollArea({ children, maxH, ...props }) {
  const scrollbarThumb = useColorModeValue('#D0D7DE', '#30363D');
  const scrollbarHover = useColorModeValue('#8C959F', '#484F58');

  return (
    <Box
      overflowY="auto"
      maxH={maxH}
      css={{
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: scrollbarThumb,
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: scrollbarHover,
        },
        // Firefox support
        scrollbarWidth: 'thin',
        scrollbarColor: `${scrollbarThumb} transparent`,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}
