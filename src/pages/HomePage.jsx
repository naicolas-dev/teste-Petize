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
import { SettingsControls } from '../components/SettingsControls';

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
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={4}
      position="relative"
    >
      <Box position="absolute" top={4} right={4}>
        <SettingsControls />
      </Box>
      <Container maxW="xl" py={16}>
        <VStack spacing={8} align="center">

          {/* Brand mark */}
          <Flex
            h={8}
            px={4}
            bg="white"
            _dark={{ bg: '#21262D', color: '#C9D1D9', borderColor: '#30363D' }}
            color="gray.600"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="full"
            align="center"
            justify="center"
            fontSize="xs"
            fontWeight="bold"
            letterSpacing="wide"
            boxShadow="sm"
          >
            Search d_evs
          </Flex>

          {/* Hero copy */}
          <VStack spacing={3} textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              color="#24292F"
              _dark={{ color: '#E6EDF3' }}
              fontWeight="bold"
              letterSpacing="tight"
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
              borderRadius="lg"
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
