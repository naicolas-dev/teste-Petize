import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  HStack,
  Avatar,
  Spinner,
  Button,
} from '@chakra-ui/react';
import { SearchBar } from '../components/SearchBar';
import { SettingsControls } from '../components/SettingsControls';
import { fetchGitHubUser } from '../services/github.service';
import { useGitHubUserSuggestions } from '../hooks/useGitHubUserSuggestions';

/**
 * HomePage - the application's entry point.
 * Contains a centered hero section with username search.
 */
export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchError, setSearchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const normalizedSearchQuery = useMemo(
    () => searchQuery.trim().toLowerCase(),
    [searchQuery]
  );

  const suggestions = useGitHubUserSuggestions(searchQuery);

  const handleQueryChange = (value) => {
    setSearchQuery(value);
    setSearchError(null);
  };

  const openProfile = (username) => {
    navigate(`/profile/${encodeURIComponent(username)}`);
  };

  const handleSearch = async (username) => {
    setSearchError(null);
    const normalizedUsername = username.trim().toLowerCase();

    if (suggestions.state === 'invalid') {
      setSearchError('invalid');
      return;
    }

    if (suggestions.state === 'rate_limited') {
      setSearchError('rateLimited');
      return;
    }

    const exactSuggestion = suggestions.users.find(
      (user) => user.login.toLowerCase() === normalizedUsername
    );

    if (exactSuggestion) {
      openProfile(exactSuggestion.login);
      return;
    }

    try {
      const user = await fetchGitHubUser(username);
      openProfile(user.login);
    } catch (error) {
      if (error?.status === 404) {
        setSearchError('notFound');
        return;
      }

      if (error?.status === 403) {
        setSearchError('rateLimited');
        return;
      }

      setSearchError('generic');
    }
  };

  const getAlertText = () => {
    if (searchError === 'empty') return t('home.emptyQuery');
    if (searchError === 'invalid') return t('home.invalidUsername');
    if (searchError === 'notFound') return t('home.userNotFound');
    if (searchError === 'rateLimited') return t('error.rateLimitedDesc');
    return t('error.generic');
  };

  const alertStatus = searchError === 'generic' ? 'error' : 'warning';

  const visibleSuggestions = useMemo(
    () => suggestions.users.slice(0, 3),
    [suggestions.users]
  );

  const showSuggestionsLoading =
    !searchError &&
    suggestions.state === 'loading' &&
    normalizedSearchQuery.length >= suggestions.minQueryLength;
  const showSuggestionsList =
    !searchError &&
    suggestions.state === 'ready' &&
    visibleSuggestions.length > 0;
  const showSuggestionsEmptyInline =
    !searchError &&
    suggestions.state === 'empty' &&
    normalizedSearchQuery.length >= suggestions.minQueryLength;
  const showSuggestionsRateLimitInline =
    !searchError &&
    suggestions.state === 'rate_limited' &&
    normalizedSearchQuery.length > 0;
  const showSuggestionsInvalidInline =
    !searchError &&
    suggestions.state === 'invalid' &&
    normalizedSearchQuery.length > 0;
  const showSuggestionsErrorInline =
    !searchError &&
    suggestions.state === 'error' &&
    normalizedSearchQuery.length >= suggestions.minQueryLength;
  const showMinCharactersHint =
    !searchError &&
    normalizedSearchQuery.length > 0 &&
    normalizedSearchQuery.length < suggestions.minQueryLength &&
    suggestions.state !== 'invalid';

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
            {t('home.brand')}
          </Flex>

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

          {searchError && (
            <Alert
              status={alertStatus}
              borderRadius="lg"
              w="100%"
              fontSize="sm"
              onMouseLeave={() => setSearchError(null)}
            >
              <AlertIcon />
              {getAlertText()}
            </Alert>
          )}

          <Box w="100%">
            <SearchBar
              onError={() => setSearchError('empty')}
              onSearch={handleSearch}
              onQueryChange={handleQueryChange}
              hideButton={true}
            />

            {showSuggestionsLoading && (
              <HStack spacing={2} mt={3} color="gray.500" fontSize="sm" align="center">
                <Spinner size="xs" />
                <Text>{t('home.suggestionsLoading')}</Text>
              </HStack>
            )}

            {showMinCharactersHint && (
              <Text mt={3} color="gray.500" fontSize="sm">
                {t('home.suggestionsMinChars', {
                  count: suggestions.minQueryLength,
                })}
              </Text>
            )}

            {showSuggestionsInvalidInline && (
              <Alert status="warning" borderRadius="md" mt={3} fontSize="sm">
                <AlertIcon />
                {t('home.invalidUsername')}
              </Alert>
            )}

            {showSuggestionsEmptyInline && (
              <Alert status="warning" borderRadius="md" mt={3} fontSize="sm">
                <AlertIcon />
                {t('home.noSimilarUsers')}
              </Alert>
            )}

            {showSuggestionsRateLimitInline && (
              <Alert status="warning" borderRadius="md" mt={3} fontSize="sm">
                <AlertIcon />
                {t('error.rateLimitedDesc')}
              </Alert>
            )}

            {showSuggestionsErrorInline && (
              <Alert status="warning" borderRadius="md" mt={3} fontSize="sm">
                <AlertIcon />
                {t('error.generic')}
              </Alert>
            )}

            {showSuggestionsList && (
              <Box
                mt={3}
                p={4}
                border="1px solid"
                borderColor="#D0D7DE"
                borderRadius="xl"
                bg="#FFFFFF"
                _dark={{ bg: '#161B22', borderColor: '#30363D' }}
              >
                <Text
                  fontSize="xs"
                  color="gray.500"
                  mb={3}
                  textTransform="uppercase"
                  letterSpacing="wide"
                  fontWeight="semibold"
                >
                  {t('home.suggestionsTitle')}
                </Text>

                <VStack spacing={1} align="stretch">
                  {visibleSuggestions.map((suggestedUser) => (
                    <Button
                      key={suggestedUser.id}
                      variant="ghost"
                      justifyContent="flex-start"
                      px={2}
                      py={2}
                      h="auto"
                      onClick={() => openProfile(suggestedUser.login)}
                      aria-label={t('home.suggestionOpenAria', {
                        username: suggestedUser.login,
                      })}
                    >
                      <HStack spacing={3} minW={0} w="100%">
                        <Avatar
                          size="xs"
                          src={suggestedUser.avatar_url}
                          name={suggestedUser.login}
                        />
                        <Box minW={0}>
                          <Text
                            fontWeight="semibold"
                            color="#1F2328"
                            _dark={{ color: '#E6EDF3' }}
                            noOfLines={1}
                          >
                            @{suggestedUser.login}
                          </Text>
                        </Box>
                      </HStack>
                    </Button>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default HomePage;
