import { useEffect, useMemo, useRef, useState } from 'react';
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
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
} from '@chakra-ui/react';
import { ArrowBackIcon, SearchIcon, SettingsIcon } from '@chakra-ui/icons';
import { useGitHubUser } from '../hooks/useGitHubUser';
import { UserCard } from '../components/UserCard';
import { RepoList } from '../components/RepoList';
import { SearchBar } from '../components/SearchBar';
import { SettingsControls } from '../components/SettingsControls';
import { PageSkeleton } from '../components/LoadingSkeleton';
import { fetchGitHubUser } from '../services/github.service';
import { useGitHubUserSuggestions } from '../hooks/useGitHubUserSuggestions';

/**
 * ProfilePage - shows a GitHub user's profile and their repositories.
 * URL: /profile/:username
 */
export function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, loading, error } = useGitHubUser(username);

  const [searchError, setSearchError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(username ?? '');
  const [isMobileSearchVisible, setIsMobileSearchVisible] = useState(true);
  const manualRevealUntilRef = useRef(0);
  const lastScrollYRef = useRef(0);

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

  useEffect(() => {
    const onScroll = () => {
      const isMobile = window.matchMedia('(max-width: 47.99em)').matches;
      if (!isMobile) return;

      const currentY = window.scrollY || 0;
      const delta = Math.abs(currentY - lastScrollYRef.current);
      lastScrollYRef.current = currentY;

      if (currentY <= 0) return;
      if (delta < 2) return;

      if (Date.now() < manualRevealUntilRef.current) {
        return;
      }

      setIsMobileSearchVisible((prevVisible) => (prevVisible ? false : prevVisible));

      if (document.activeElement instanceof HTMLInputElement) {
        document.activeElement.blur();
      }
    };

    lastScrollYRef.current = window.scrollY || 0;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const revealMobileSearch = () => {
    manualRevealUntilRef.current = Date.now() + 1200;
    lastScrollYRef.current = window.scrollY || 0;
    setIsMobileSearchVisible(true);
  };

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

  const renderSearchArea = (compactMobile) => (
    <Box flex={1} w={{ base: '100%', md: 'auto' }}>
      <SearchBar
        initialValue={username}
        onError={() => setSearchError('empty')}
        onSearch={handleSearch}
        onQueryChange={handleQueryChange}
        showHint={false}
        compactMobile={compactMobile}
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
                  </Box>
                </HStack>
              </Button>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );

  return (
    <Box minH="100vh">
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
          <Box display={{ base: 'block', md: 'none' }} py={3}>
            <Flex align="center" justify="space-between" mb={3}>
              <Button
                as={RouterLink}
                to="/"
                variant="ghost"
                size="sm"
                leftIcon={<ArrowBackIcon />}
                color="gray.600"
                _dark={{ color: 'gray.300' }}
                _hover={{ bg: 'gray.100', color: '#191919', _dark: { bg: 'gray.800', color: '#DEDEDE' } }}
              >
                {t('common.back')}
              </Button>

              <HStack spacing={2}>
                <IconButton
                  icon={<SearchIcon />}
                  aria-label={t('profile.openSearchAria')}
                  variant="ghost"
                  size="sm"
                  onClick={revealMobileSearch}
                  display={isMobileSearchVisible ? 'none' : 'flex'}
                />

                <Popover placement="bottom-end" isLazy>
                  <PopoverTrigger>
                    <IconButton
                      icon={<SettingsIcon />}
                      aria-label={t('settings.openMenuAria')}
                      variant="ghost"
                      size="sm"
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    w="auto"
                    minW="0"
                    borderRadius="xl"
                    borderColor="#D0D7DE"
                    _dark={{ bg: '#161B22', borderColor: '#30363D' }}
                  >
                    <PopoverArrow />
                    <PopoverBody p={2}>
                      <SettingsControls />
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </HStack>
            </Flex>

            <Box
              maxH={isMobileSearchVisible ? '560px' : '0px'}
              opacity={isMobileSearchVisible ? 1 : 0}
              overflow="hidden"
              pointerEvents={isMobileSearchVisible ? 'auto' : 'none'}
              transition="max-height 0.24s ease, opacity 0.2s ease"
            >
              {renderSearchArea(true)}
            </Box>
          </Box>

          <Flex align="center" gap={4} py={3} display={{ base: 'none', md: 'flex' }}>
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

            <Divider orientation="vertical" h="24px" />
            {renderSearchArea(false)}
            <Divider orientation="vertical" h="24px" />
            <SettingsControls />
          </Flex>
        </Container>
      </Box>

      <Container maxW="6xl" py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }}>
        {loading && <PageSkeleton />}

        {!loading && error?.status === 404 && (
          <Center py={16}>
            <Box textAlign="center" maxW="sm">
              <SearchIcon boxSize={8} color="gray.400" mb={4} />
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

        {!loading && error?.status === 403 && (
          <Alert status="warning" borderRadius="xl">
            <AlertIcon />
            <AlertTitle>{t('error.rateLimited')}</AlertTitle>
            <AlertDescription>{t('error.rateLimitedDesc')}</AlertDescription>
          </Alert>
        )}

        {!loading && error && error.status !== 404 && error.status !== 403 && (
          <Alert status="error" borderRadius="xl">
            <AlertIcon />
            <AlertTitle>{t('error.generic')}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {!loading && user && (
          <Grid
            templateColumns={{ base: '1fr', md: '300px 1fr' }}
            gap={{ base: 6, md: 8 }}
            alignItems="start"
          >
            <GridItem>
              <Box position={{ md: 'sticky' }} top={{ md: '80px' }}>
                <UserCard user={user} />
              </Box>
            </GridItem>

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
