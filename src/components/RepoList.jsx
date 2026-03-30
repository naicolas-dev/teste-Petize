import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SortSelector } from './SortSelector';
import { RepoCard } from './RepoCard';
import { RepoSkeleton } from './LoadingSkeleton';

/**
 * RepoList - full repo listing with sort controls and infinite scroll.
 *
 * @param {{ username: string }} props
 */
export function RepoList({ username }) {
  const { t } = useTranslation();

  // Existing sort state remains unchanged.
  const [sort, setSort] = useState('updated');
  const [direction, setDirection] = useState('desc');

  // New filters.
  const [repoQuery, setRepoQuery] = useState('');
  const [language, setLanguage] = useState('all');

  const { repos, languages, loading, hasMore, error, loadMore } = useGitHubRepos(
    username,
    sort,
    direction,
    { query: repoQuery, language }
  );

  const sentinelRef = useIntersectionObserver(loadMore, !loading && hasMore);
  const hasActiveFilters = repoQuery.trim().length > 0 || language !== 'all';

  const controlStyles = {
    bg: '#FFFFFF',
    borderColor: '#D0D7DE',
    border: '1px solid',
    color: '#1F2328',
    _dark: { bg: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' },
    borderRadius: 'lg',
    fontSize: 'sm',
    _hover: { borderColor: '#8C959F' },
    _focus: { borderColor: '#0969DA', boxShadow: '0 0 0 1px #0969DA' },
  };

  const optionBg = useColorModeValue('#FFFFFF', '#0D1117');
  const optionColor = useColorModeValue('#1F2328', '#E6EDF3');

  return (
    <Box>
      <SortSelector
        sort={sort}
        direction={direction}
        onSortChange={setSort}
        onDirectionChange={setDirection}
      />

      <Flex direction={{ base: 'column', md: 'row' }} gap={3} pb={2}>
        <InputGroup size="sm" flex={1}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            id="repo-name-filter-input"
            value={repoQuery}
            onChange={(e) => setRepoQuery(e.target.value)}
            placeholder={t('filters.repoNamePlaceholder')}
            aria-label={t('filters.repoNameAria')}
            {...controlStyles}
          />
        </InputGroup>

        <Select
          id="repo-language-filter-select"
          size="sm"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          w={{ base: '100%', md: '220px' }}
          aria-label={t('filters.languageAria')}
          {...controlStyles}
        >
          <option value="all" style={{ background: optionBg, color: optionColor }}>
            {t('filters.languageAll')}
          </option>
          {languages.map((lang) => (
            <option key={lang} value={lang} style={{ background: optionBg, color: optionColor }}>
              {lang}
            </option>
          ))}
        </Select>
      </Flex>

      {error && (
        <Alert status="error" borderRadius="xl" mt={4}>
          <AlertIcon />
          <AlertTitle>{t('error.generic')}</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {repos.length > 0 && (
        <VStack spacing={3} align="stretch" mt={4}>
          {repos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </VStack>
      )}

      {!loading && !error && repos.length === 0 && (
        <Center py={12}>
          <Text color="gray.400" fontSize="sm">
            {hasActiveFilters ? t('profile.noReposFiltered') : t('profile.noRepos')}
          </Text>
        </Center>
      )}

      {loading && (
        <VStack spacing={3} align="stretch" mt={4}>
          <RepoSkeleton />
          <RepoSkeleton />
        </VStack>
      )}

      {!hasMore && repos.length > 0 && !loading && (
        <Center py={6}>
          <Text fontSize="xs" color="gray.400">{t('profile.noMoreRepos')}</Text>
        </Center>
      )}

      <Box ref={sentinelRef} h="1px" />
    </Box>
  );
}
