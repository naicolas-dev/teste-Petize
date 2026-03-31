import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Link,
  Text,
  Badge,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { StarIcon, TimeIcon } from '@chakra-ui/icons';
import { GoRepoForked } from 'react-icons/go';
import { VscCircleFilled } from 'react-icons/vsc';

/**
 * Colour map for the most common programming languages.
 * Mirrors GitHub's own language badge colours.
 */
const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python:     '#3572A5',
  Java:       '#b07219',
  'C#':       '#178600',
  'C++':      '#f34b7d',
  C:          '#555555',
  PHP:        '#4F5D95',
  Ruby:       '#701516',
  Go:         '#00ADD8',
  Rust:       '#dea584',
  Swift:      '#F05138',
  Kotlin:     '#A97BFF',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  Shell:      '#89e051',
  Dockerfile: '#384d54',
  Vue:        '#41b883',
};

/**
 * Formats ISO date string into a relative "updated X ago" or absolute label.
 */
function formatUpdatedAt(isoString, t, i18n) {
  if (!isoString) return null;

  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const locale = i18n.language.startsWith('pt') ? 'pt-BR' : 'en-US';
  const absolute = date.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });

  let relative;
  if (diffDays === 0) {
    relative = t('repo.updatedToday');
  } else if (diffDays === 1) {
    relative = t('repo.updatedYesterday');
  } else if (diffDays < 30) {
    relative = t('repo.updatedDaysAgo', { count: diffDays });
  } else if (diffMonths < 12) {
    relative = t('repo.updatedMonthsAgo', { count: diffMonths });
  } else {
    relative = t('repo.updatedYearsAgo', { count: diffYears });
  }

  return { relative, absolute };
}

/**
 * RepoCard — displays a single repository with name (link), description,
 * language badge, star count, fork count, and last updated date.
 *
 * @param {{ repo: import('../schemas/githubRepo.schema').GitHubRepo }} props
 */
export function RepoCard({ repo }) {
  const { t, i18n } = useTranslation();

  const langColor = LANGUAGE_COLORS[repo.language] ?? '#8b949e';
  const updated = formatUpdatedAt(repo.updated_at, t, i18n);

  return (
    <Box
      id={`repo-card-${repo.name}`}
      as="article"
      border="1px solid"
      borderColor="#D0D7DE"
      _dark={{ bg: '#161B22', borderColor: '#30363D' }}
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      bg="#FFFFFF"
      transition="all 0.2s cubic-bezier(.08,.52,.52,1)"
      boxShadow="sm"
      display="flex"
      flexDirection="column"
      _hover={{
        borderColor: '#8C959F',
        boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)',
        transform: 'translateY(-2px)',
        _dark: { borderColor: '#8B949E', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }
      }}
    >
      {/* Repo name as external link */}
      <Link
        href={repo.html_url}
        isExternal
        fontWeight="bold"
        fontSize="md"
        color="#0969DA"
        _dark={{ color: '#58A6FF' }}
        _hover={{ textDecoration: 'underline' }}
        display="inline-block"
        mb={repo.description ? 1.5 : 0}
        wordBreak="break-word"
      >
        {repo.name}
      </Link>

      {/* Description */}
      {repo.description && (
        <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }} mb={3} noOfLines={2} lineHeight="tall">
          {repo.description}
        </Text>
      )}

      {/* Footer row: language · stars · forks · updated */}
      <Flex mt="auto" justify="space-between" align="center" flexWrap="wrap" gap={2}>
        <HStack spacing={4} flexWrap="wrap">
          {repo.language && (
            <HStack spacing={1}>
              <VscCircleFilled color={langColor} size={14} />
              <Text fontSize="xs" fontFamily="mono" color="gray.500">{repo.language}</Text>
            </HStack>
          )}

          <Tooltip label={t('repo.stars')} placement="top" hasArrow>
            <HStack spacing={1} cursor="default">
              <StarIcon boxSize={3} color="yellow.500" />
              <Text fontSize="sm" fontFamily="mono" color="gray.600" _dark={{ color: 'gray.400' }}>
                {repo.stargazers_count.toLocaleString()}
              </Text>
            </HStack>
          </Tooltip>

          <Tooltip label={t('repo.forks')} placement="top" hasArrow>
            <HStack spacing={1} cursor="default">
              <GoRepoForked size={14} color="#718096" />
              <Text fontSize="sm" fontFamily="mono" color="gray.600" _dark={{ color: 'gray.400' }}>
                {repo.forks_count.toLocaleString()}
              </Text>
            </HStack>
          </Tooltip>

          {repo.archived && (
            <Badge colorScheme="orange" variant="subtle" fontSize="2xs">
              {t('repo.archived')}
            </Badge>
          )}
        </HStack>

        {/* Last updated */}
        {updated && (
          <Tooltip label={updated.absolute} placement="top" hasArrow>
            <HStack spacing={1} cursor="default" flexShrink={0}>
              <TimeIcon boxSize={3} color="gray.400" />
              <Text fontSize="xs" color="gray.400" whiteSpace="nowrap">
                {updated.relative}
              </Text>
            </HStack>
          </Tooltip>
        )}
      </Flex>
    </Box>
  );
}
