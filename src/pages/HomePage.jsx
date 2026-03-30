import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Flex,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { SearchBar } from '../components/SearchBar';

/**
 * HomePage — the application's entry point.
 * Contains a centred hero section with the search bar.
 */
export function HomePage() {
  const { t } = useTranslation();
  const [showEmptyAlert, setShowEmptyAlert] = useState(false);

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, blue.50, white, purple.50)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
    >
      <Container maxW="xl" py={16}>
        <VStack spacing={8} align="center">

          {/* Brand mark */}
          <Flex
            w={16}
            h={16}
            bg="blue.600"
            borderRadius="2xl"
            align="center"
            justify="center"
            boxShadow="0 8px 24px rgba(66,153,225,0.35)"
            fontSize="2xl"
            role="img"
            aria-label="GitHub logo"
          >
            🐙
          </Flex>

          {/* Hero copy */}
          <VStack spacing={3} textAlign="center">
            <Heading
              as="h1"
              size="xl"
              bgGradient="linear(to-r, blue.600, purple.500)"
              bgClip="text"
              fontWeight="extrabold"
              letterSpacing="-0.5px"
            >
              {t('home.title')}
            </Heading>
            <Text color="gray.500" fontSize="md" maxW="sm">
              {t('home.subtitle')}
            </Text>
          </VStack>

          {/* Empty-query alert */}
          {showEmptyAlert && (
            <Alert
              status="warning"
              borderRadius="xl"
              w="100%"
              fontSize="sm"
              onMouseLeave={() => setShowEmptyAlert(false)}
            >
              <AlertIcon />
              {t('home.emptyQuery')}
            </Alert>
          )}

          {/* Search form */}
          <Box w="100%">
            <SearchBar onError={() => setShowEmptyAlert(true)} />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default HomePage;
