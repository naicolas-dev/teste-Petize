import { Box, Heading, Text, Badge, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
      <VStack spacing={4}>
        <Heading size="xl" color="purple.600">
          {t('app.title')}
        </Heading>
        <Text color="gray.500">ChakraUI v2 + i18next + Zod — ready to build 🚀</Text>
        <Badge colorScheme="green">Setup complete</Badge>
      </VStack>
    </Box>
  );
}

export default App;
