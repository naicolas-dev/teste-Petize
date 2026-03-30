import { useParams, Link as RouterLink } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { ArrowBackIcon, SearchIcon } from '@chakra-ui/icons';
import { useGitHubUser } from '../hooks/useGitHubUser';
import { UserCard } from '../components/UserCard';
import { RepoList } from '../components/RepoList';
import { SearchBar } from '../components/SearchBar';
import { SettingsControls } from '../components/SettingsControls';
import { PageSkeleton } from '../components/LoadingSkeleton';

/**
 * ProfilePage — shows a GitHub user's profile and their repositories.
 * URL: /profile/:username
 */
export function ProfilePage() {
  const { username } = useParams();
  const { t }        = useTranslation();
  const { user, loading, error } = useGitHubUser(username);

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
              <SearchBar initialValue={username} />
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
