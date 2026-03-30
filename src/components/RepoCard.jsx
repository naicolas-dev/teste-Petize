import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Link,
  Text,
  Badge,
  HStack,
  VStack,
  Tooltip,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
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
 * RepoCard — displays a single repository with name (link), description,
 * language badge, star count, and fork count.
 *
 * @param {{ repo: import('../schemas/githubRepo.schema').GitHubRepo }} props
 */
export function RepoCard({ repo }) {
  const { t } = useTranslation();

  const langColor = LANGUAGE_COLORS[repo.language] ?? '#8b949e';

  return (
    <Box
      id={`repo-card-${repo.name}`}
      as="article"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      p={{ base: 4, md: 5 }}
      bg="white"
      transition="all 0.18s ease"
      _hover={{
        borderColor: 'blue.300',
        boxShadow: '0 4px 16px rgba(66,153,225,0.12)',
        transform: 'translateY(-1px)',
      }}
    >
      {/* Repo name as external link */}
      <Link
        href={repo.html_url}
        isExternal
        fontWeight="semibold"
        fontSize="sm"
        color="blue.600"
        _hover={{ color: 'blue.800', textDecoration: 'underline' }}
        display="inline-block"
        mb={repo.description ? 2 : 0}
        wordBreak="break-word"
      >
        {repo.name}
      </Link>

      {/* Description */}
      {repo.description && (
        <Text fontSize="sm" color="gray.600" mb={3} noOfLines={2} lineHeight="tall">
          {repo.description}
        </Text>
      )}

      {/* Footer row: language · stars · forks */}
      <HStack spacing={4} mt="auto" flexWrap="wrap">
        {repo.language && (
          <HStack spacing={1}>
            <VscCircleFilled color={langColor} size={14} />
            <Text fontSize="xs" color="gray.500">{repo.language}</Text>
          </HStack>
        )}

        <Tooltip label={t('repo.stars')} placement="top" hasArrow>
          <HStack spacing={1} cursor="default">
            <StarIcon boxSize={3} color="yellow.500" />
            <Text fontSize="xs" color="gray.500">
              {repo.stargazers_count.toLocaleString()}
            </Text>
          </HStack>
        </Tooltip>

        <Tooltip label={t('repo.forks')} placement="top" hasArrow>
          <HStack spacing={1} cursor="default">
            <GoRepoForked size={13} color="#718096" />
            <Text fontSize="xs" color="gray.500">
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
    </Box>
  );
}
