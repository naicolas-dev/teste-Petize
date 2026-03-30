import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
} from '@chakra-ui/react';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SortSelector } from './SortSelector';
import { RepoCard } from './RepoCard';
import { RepoSkeleton } from './LoadingSkeleton';

/**
 * RepoList — full repo listing with sort controls and infinite scroll.
 *
 * @param {{ username: string }} props
 */
export function RepoList({ username }) {
  const { t } = useTranslation();

  // Sort/direction state lives here so SortSelector can be decoupled
  const [sort,      setSort]      = useState('updated');
  const [direction, setDirection] = useState('desc');

  const { repos, loading, hasMore, error, loadMore } = useGitHubRepos(
    username, sort, direction
  );

  // Sentinel element — when it enters viewport → loadMore is called
  const sentinelRef = useIntersectionObserver(loadMore, !loading && hasMore);

  return (
    <Box>
      {/* Sort controls */}
      <SortSelector
        sort={sort}
        direction={direction}
        onSortChange={setSort}
        onDirectionChange={setDirection}
      />

      {/* Error state */}
      {error && (
        <Alert status="error" borderRadius="xl" mt={4}>
          <AlertIcon />
          <AlertTitle>{t('error.generic')}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {/* Repo cards grid */}
      {repos.length > 0 && (
        <VStack spacing={3} align="stretch" mt={4}>
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </VStack>
      )}

      {/* Empty state (loaded, no error, no repos) */}
      {!loading && !error && repos.length === 0 && (
        <Center py={12}>
          <Text color="gray.400" fontSize="sm">{t('profile.noRepos')}</Text>
        </Center>
      )}

      {/* Loading Skeletons for infinite scroll */}
      {loading && (
        <VStack spacing={3} align="stretch" mt={4}>
          <RepoSkeleton />
          <RepoSkeleton />
        </VStack>
      )}

      {/* End-of-list message */}
      {!hasMore && repos.length > 0 && !loading && (
        <Center py={6}>
          <Text fontSize="xs" color="gray.400">{t('profile.noMoreRepos')}</Text>
        </Center>
      )}

      {/* Invisible sentinel for IntersectionObserver */}
      <Box ref={sentinelRef} h="1px" />
    </Box>
  );
}
