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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { SearchIcon, ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';
import { useGitHubRepos } from '../hooks/useGitHubRepos';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { SortSelector } from './SortSelector';
import { RepoCard } from './RepoCard';
import { RepoSkeleton } from './LoadingSkeleton';

/**
 * RepoList - full repo listing with sort controls and infinite scroll.
 */
export function RepoList({ username }) {
  const { t } = useTranslation();

  const [sort, setSort] = useState('pushed');
  const [direction, setDirection] = useState('desc');
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

  // Styles consistent with SortSelector.jsx
  const buttonBg = useColorModeValue('#FFFFFF', '#0D1117');
  const buttonBorder = useColorModeValue('#D0D7DE', '#30363D');
  const buttonHover = useColorModeValue('#F6F8FA', '#21262D');
  const textColor = useColorModeValue('#1F2328', '#E6EDF3');
  const menuBg = useColorModeValue('#FFFFFF', '#161B22');
  const menuShadow = useColorModeValue(
    '0 8px 24px rgba(140,149,159,0.2)',
    '0 8px 24px rgba(0,0,0,0.6)'
  );
  const itemHover = useColorModeValue('#F6F8FA', '#21262D');
  const activeColor = '#0969DA';

  const controlStyles = {
    bg: buttonBg,
    borderColor: buttonBorder,
    border: '1px solid',
    color: textColor,
    borderRadius: 'lg',
    fontSize: 'sm',
    _hover: { borderColor: '#8C959F' },
    _focus: { borderColor: '#0969DA', boxShadow: '0 0 0 1px #0969DA' },
  };

  const menuButtonStyles = {
    ...controlStyles,
    fontWeight: 'medium',
    h: '32px',
    _hover: { ...controlStyles._hover, bg: buttonHover },
    _active: { bg: buttonHover },
  };

  const menuListStyles = {
    bg: menuBg,
    borderColor: buttonBorder,
    boxShadow: menuShadow,
    borderRadius: 'xl',
    minW: '200px',
    maxH: '300px',
    overflowY: 'auto',
    p: 1,
    zIndex: 'popover',
    // Custom Scrollbar for better UI
    sx: {
      '&::-webkit-scrollbar': { width: '4px' },
      '&::-webkit-scrollbar-track': { background: 'transparent' },
      '&::-webkit-scrollbar-thumb': { 
        background: useColorModeValue('#D0D7DE', '#30363D'), 
        borderRadius: '4px' 
      },
      '&::-webkit-scrollbar-thumb:hover': { 
        background: useColorModeValue('#8C959F', '#484F58') 
      },
    },
  };

  const currentLanguageLabel = language === 'all' ? t('filters.languageAll') : language;

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
            h="32px"
            {...controlStyles}
          />
        </InputGroup>

        <Menu autoSelect={false} isLazy>
          <MenuButton
            as={Button}
            size="sm"
            variant="outline"
            rightIcon={<ChevronDownIcon boxSize={4} opacity={0.6} />}
            textAlign="left"
            w={{ base: '100%', md: '220px' }}
            {...menuButtonStyles}
          >
            <Text noOfLines={1}>{currentLanguageLabel}</Text>
          </MenuButton>
          <MenuList {...menuListStyles}>
            <MenuItem
              onClick={() => setLanguage('all')}
              borderRadius="lg"
              bg="transparent"
              _hover={{ bg: itemHover }}
              _focus={{ bg: itemHover }}
              fontSize="sm"
              px={3}
              py={2}
            >
              <Flex align="center" justify="space-between" w="full">
                <Text>{t('filters.languageAll')}</Text>
                {language === 'all' && <CheckIcon boxSize={3} color={activeColor} />}
              </Flex>
            </MenuItem>
            {languages.map((lang) => (
              <MenuItem
                key={lang}
                onClick={() => setLanguage(lang)}
                borderRadius="lg"
                bg="transparent"
                _hover={{ bg: itemHover }}
                _focus={{ bg: itemHover }}
                fontSize="sm"
                px={3}
                py={2}
              >
                <Flex align="center" justify="space-between" w="full">
                  <Text>{lang}</Text>
                  {language === lang && <CheckIcon boxSize={3} color={activeColor} />}
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
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
