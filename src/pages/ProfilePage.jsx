import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
  Button,
  HStack,
  Divider,
  Spinner,
  Avatar,
  VStack,
} from '@chakra-ui/react';
import { ArrowBackIcon, SearchIcon } from '@chakra-ui/icons';
import { useGitHubUser } from '../hooks/useGitHubUser';
import { UserCard } from '../components/UserCard';
import { RepoList } from '../components/RepoList';
import { SearchBar } from '../components/SearchBar';
import { SettingsControls } from '../components/SettingsControls';
import { PageSkeleton } from '../components/LoadingSkeleton';
import { fetchGitHubUser } from '../services/github.service';
import { useGitHubUserSuggestions } from '../hooks/useGitHubUserSuggestions';

/**
 * ProfilePage — shows a GitHub user's profile and their repositories.
 * URL: /profile/:username
 */
export function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, loading, error } = useGitHubUser(username);
  const [searchError, setSearchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(username ?? '');

  const normalizedUsername = useMemo(
    () => String(username ?? '').trim().toLowerCase(),
    [username]
  );
  const normalizedSearchQuery = useMemo(
    () => searchQuery.trim().toLowerCase(),
    [searchQuery]
  );
  const isTypeaheadActive = useMemo(
    () => normalizedSearchQuery.length > 0 && normalizedSearchQuery !== normalizedUsername,
    [normalizedSearchQuery, normalizedUsername]
  );

  const suggestions = useGitHubUserSuggestions(searchQuery);

  const openProfile = (nextUsername) => {
    navigate(`/profile/${encodeURIComponent(nextUsername)}`);
  };

  const handleQueryChange = (value) => {
    setSearchQuery(value);
    setSearchError(null);
  };

  const handleSearch = async (rawUsername) => {
    setSearchError(null);
    const normalizedQuery = rawUsername.trim().toLowerCase();

    if (suggestions.state === 'invalid') {
      setSearchError('invalid');
      return;
    }

    if (suggestions.state === 'rate_limited') {
      setSearchError('rateLimited');
      return;
    }

    const exactSuggestion = suggestions.users.find(
      (suggestedUser) => suggestedUser.login.toLowerCase() === normalizedQuery
    );

    if (exactSuggestion) {
      openProfile(exactSuggestion.login);
      return;
    }

    try {
      const foundUser = await fetchGitHubUser(rawUsername);
      openProfile(foundUser.login);
    } catch (searchRequestError) {
      if (searchRequestError?.status === 404) {
        setSearchError('notFound');
        return;
      }

      if (searchRequestError?.status === 403) {
        setSearchError('rateLimited');
        return;
      }

      setSearchError('generic');
    }
  };

  const getSearchAlertText = () => {
    if (searchError === 'empty') return t('home.emptyQuery');
    if (searchError === 'invalid') return t('home.invalidUsername');
    if (searchError === 'notFound') return t('home.userNotFound');
    if (searchError === 'rateLimited') return t('error.rateLimitedDesc');
    return t('error.generic');
  };

  const searchAlertStatus = searchError === 'generic' ? 'error' : 'warning';
  const visibleSuggestions = useMemo(
    () => suggestions.users.slice(0, 3),
    [suggestions.users]
  );

  const showSuggestionsLoading =
    isTypeaheadActive &&
    !searchError &&
    suggestions.state === 'loading' &&
    normalizedSearchQuery.length >= suggestions.minQueryLength;
  const showSuggestionsList =
    isTypeaheadActive &&
    !searchError &&
    suggestions.state === 'ready' &&
    visibleSuggestions.length > 0;
  const showSuggestionsEmptyInline =
    isTypeaheadActive &&
    !searchError &&
    suggestions.state === 'empty' &&
    normalizedSearchQuery.length >= suggestions.minQueryLength;
  const showSuggestionsRateLimitInline =
    isTypeaheadActive &&
    !searchError &&
    suggestions.state === 'rate_limited' &&
    normalizedSearchQuery.length > 0;
  const showSuggestionsInvalidInline =
    isTypeaheadActive &&
    !searchError &&
    suggestions.state === 'invalid' &&
    normalizedSearchQuery.length > 0;
  const showSuggestionsErrorInline =
    isTypeaheadActive &&
    !searchError &&
    suggestions.state === 'error' &&
    normalizedSearchQuery.length >= suggestions.minQueryLength;
  const showMinCharactersHint =
    isTypeaheadActive &&
    !searchError &&
    normalizedSearchQuery.length > 0 &&
    normalizedSearchQuery.length < suggestions.minQueryLength &&
    suggestions.state !== 'invalid';

  return (
    <Box minH="100vh">

      {/* ── Top navigation bar ────────────────────────────────────── */}
      <Box
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(12px)"
        _dark={{ bg: 'rgba(13, 17, 23, 0.8)', borderColor: '#30363D' }}
        borderBottom="1px solid"
        borderColor="gray.200"
        position="sticky"
        top={0}
        zIndex={100}
      >
        <Container maxW="6xl">
          <Flex
            align="center"
            gap={4}
            py={3}
            direction={{ base: 'column', md: 'row' }}
          >
            <Button
              as={RouterLink}
              to="/"
              variant="ghost"
              size="sm"
              leftIcon={<ArrowBackIcon />}
              color="gray.600"
              _dark={{ color: 'gray.300' }}
              _hover={{ bg: 'gray.100', color: '#191919', _dark: { bg: 'gray.800', color: '#DEDEDE' } }}
              flexShrink={0}
            >
              {t('common.back')}
            </Button>

            <Divider orientation="vertical" h="24px" display={{ base: 'none', md: 'block' }} />

            <Box flex={1} w={{ base: '100%', md: 'auto' }}>
              <SearchBar
                initialValue={username}
                onError={() => setSearchError('empty')}
                onSearch={handleSearch}
                onQueryChange={handleQueryChange}
                showHint={false}
              />

              {searchError && (
                <Alert
                  status={searchAlertStatus}
                  borderRadius="md"
                  mt={2}
                  fontSize="sm"
                  onMouseLeave={() => setSearchError(null)}
                >
                  <AlertIcon />
                  {getSearchAlertText()}
                </Alert>
              )}

              {showSuggestionsLoading && (
                <HStack spacing={2} mt={2} color="gray.500" fontSize="sm" align="center">
                  <Spinner size="xs" />
                  <Text>{t('home.suggestionsLoading')}</Text>
                </HStack>
              )}

              {showMinCharactersHint && (
                <Text mt={2} color="gray.500" fontSize="sm">
                  {t('home.suggestionsMinChars', {
                    count: suggestions.minQueryLength,
                  })}
                </Text>
              )}

              {showSuggestionsInvalidInline && (
                <Alert status="warning" borderRadius="md" mt={2} fontSize="sm">
                  <AlertIcon />
                  {t('home.invalidUsername')}
                </Alert>
              )}

              {showSuggestionsEmptyInline && (
                <Alert status="warning" borderRadius="md" mt={2} fontSize="sm">
                  <AlertIcon />
                  {t('home.noSimilarUsers')}
                </Alert>
              )}

              {showSuggestionsRateLimitInline && (
                <Alert status="warning" borderRadius="md" mt={2} fontSize="sm">
                  <AlertIcon />
                  {t('error.rateLimitedDesc')}
                </Alert>
              )}

              {showSuggestionsErrorInline && (
                <Alert status="warning" borderRadius="md" mt={2} fontSize="sm">
                  <AlertIcon />
                  {t('error.generic')}
                </Alert>
              )}

              {showSuggestionsList && (
                <Box
                  mt={2}
                  p={3}
                  border="1px solid"
                  borderColor="#D0D7DE"
                  borderRadius="xl"
                  bg="#FFFFFF"
                  _dark={{ bg: '#161B22', borderColor: '#30363D' }}
                >
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mb={2}
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
                            <Text fontSize="xs" color="gray.500" noOfLines={1}>
                              {suggestedUser.type}
                            </Text>
                          </Box>
                        </HStack>
                      </Button>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>

            <Divider orientation="vertical" h="24px" display={{ base: 'none', md: 'block' }} />
            <SettingsControls />
          </Flex>
        </Container>
      </Box>

      {/* ── Main content ──────────────────────────────────────────── */}
      <Container maxW="6xl" py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }}>

        {/* Loading Skeleton */}
        {loading && <PageSkeleton />}

        {/* Error: user not found */}
        {!loading && error?.status === 404 && (
          <Center py={16}>
            <Box textAlign="center" maxW="sm">
              <Text fontSize="5xl" mb={4}>🔍</Text>
              <Heading size="md" color="gray.700" mb={2}>{t('error.userNotFound')}</Heading>
              <Text color="gray.400" mb={6} fontSize="sm">
                {t('error.userNotFoundDesc', { username })}
              </Text>
              <Button
                as={RouterLink}
                to="/"
                leftIcon={<SearchIcon />}
                colorScheme="blue"
                borderRadius="xl"
              >
                {t('common.searchAgain')}
              </Button>
            </Box>
          </Center>
        )}

        {/* Error: rate limit */}
        {!loading && error?.status === 403 && (
          <Alert status="warning" borderRadius="xl">
            <AlertIcon />
            <AlertTitle>{t('error.rateLimited')}</AlertTitle>
            <AlertDescription>{t('error.rateLimitedDesc')}</AlertDescription>
          </Alert>
        )}

        {/* Generic error */}
        {!loading && error && error.status !== 404 && error.status !== 403 && (
          <Alert status="error" borderRadius="xl">
            <AlertIcon />
            <AlertTitle>{t('error.generic')}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {/* ── Loaded user ──────────────────────────────────────────── */}
        {!loading && user && (
          <Grid
            templateColumns={{ base: '1fr', md: '300px 1fr' }}
            gap={{ base: 6, md: 8 }}
            alignItems="start"
          >
            {/* Left sidebar — user card */}
            <GridItem>
              <Box position={{ md: 'sticky' }} top={{ md: '80px' }}>
                <UserCard user={user} />
              </Box>
            </GridItem>

            {/* Right main — repo list */}
            <GridItem>
              <HStack mb={4}>
                <Heading size="sm" color="gray.700" _dark={{ color: 'gray.300' }}>
                  {t('profile.repositories')}
                </Heading>
                <Text fontSize="sm" color="gray.400">
                  ({user.public_repos.toLocaleString()})
                </Text>
              </HStack>
              <RepoList username={username} />
            </GridItem>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default ProfilePage;
