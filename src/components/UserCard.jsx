import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  VStack,
  HStack,
  Avatar,
  Text,
  Heading,
  Link,
  Divider,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  Tooltip,
  Badge,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { BsTwitterX, BsGlobe, BsBuilding, BsGeoAlt, BsEnvelope } from 'react-icons/bs';
import { GoOrganization, GoPeople } from 'react-icons/go';

/**
 * A single info row with an icon — shown only when `value` is truthy.
 */
function InfoRow({ icon, value, href }) {
  if (!value) return null;

  const text = (
    <HStack spacing={2} color="gray.600" _dark={{ color: '#e6edf3' }} fontSize="sm">
      <Box color="gray.400" flexShrink={0}>{icon}</Box>
      <Text noOfLines={1}>{value}</Text>
    </HStack>
  );

  if (href) {
    return (
      <Link href={href} isExternal _hover={{ textDecoration: 'none' }}>
        <HStack spacing={2} color="blue.600" fontSize="sm" _hover={{ color: 'blue.800' }}>
          <Box color="gray.400" flexShrink={0}>{icon}</Box>
          <Text noOfLines={1}>{value}</Text>
          <ExternalLinkIcon boxSize={3} />
        </HStack>
      </Link>
    );
  }

  return text;
}

/**
 * Builds a full URL from a raw blog/site field that may lack the protocol.
 */
function normalizeBlogUrl(blog) {
  if (!blog) return null;
  return blog.startsWith('http') ? blog : `https://${blog}`;
}

/**
 * UserCard — left-sidebar card displaying all public GitHub profile data.
 *
 * @param {{ user: import('../schemas/githubUser.schema').GitHubUser }} props
 */
export function UserCard({ user }) {
  const { t } = useTranslation();

  const blogUrl    = normalizeBlogUrl(user.blog);
  const twitterUrl = user.twitter_username
    ? `https://twitter.com/${user.twitter_username}`
    : null;

  return (
    <Box
      as="aside"
      bg="#FFFFFF"
      _dark={{ bg: '#161B22', borderColor: '#30363D' }}
      border="1px solid"
      borderColor="#D0D7DE"
      borderRadius="xl"
      boxShadow="sm"
      p={{ base: 5, md: 6 }}
      w="100%"
      position="sticky"
      top="90px"
    >
      {/* Avatar + name block */}
      <VStack spacing={3} align="center" mb={5}>
        <Avatar
          src={user.avatar_url}
          name={user.name ?? user.login}
          size="2xl"
          borderRadius="full"
          border="1px solid"
          borderColor="#D0D7DE"
          _dark={{ borderColor: '#30363D' }}
          boxShadow="sm"
        />
        <VStack spacing={0.5} textAlign="center">
          {user.name && (
            <Heading as="h1" size="md" color="#1F2328" _dark={{ color: '#E6EDF3' }} fontWeight="bold">
              {user.name}
            </Heading>
          )}
          <Link
            href={user.html_url}
            isExternal
            fontSize="sm"
            color="gray.500"
            _hover={{ color: 'blue.500' }}
          >
            @{user.login}
          </Link>
          {user.type === 'Organization' && (
            <Badge colorScheme="purple" mt={1}>{t('profile.organization')}</Badge>
          )}
        </VStack>
      </VStack>

      {/* Bio */}
      {user.bio && (
        <Text fontSize="sm" color="gray.600" _dark={{ color: '#e6edf3' }} textAlign="center" mb={4} lineHeight="tall">
          {user.bio}
        </Text>
      )}

      {/* Social link buttons (website + twitter) */}
      {(blogUrl || twitterUrl) && (
        <VStack spacing={2} mb={4}>
          {blogUrl && (
            <Button
              as={Link}
              href={blogUrl}
              isExternal
              size="sm"
              variant="outline"
              borderColor="#D0D7DE"
              color="#24292F"
              bg="#F6F8FA"
              _dark={{ color: '#C9D1D9', borderColor: '#30363D', bg: '#21262D' }}
              leftIcon={<BsGlobe />}
              rightIcon={<ExternalLinkIcon />}
              w="100%"
              _hover={{ textDecoration: 'none', bg: '#F3F4F6', _dark: { bg: '#30363D' } }}
            >
              {t('profile.website')}
            </Button>
          )}
          {twitterUrl && (
            <Button
              as={Link}
              href={twitterUrl}
              isExternal
              size="sm"
              variant="outline"
              borderColor="#D0D7DE"
              color="#24292F"
              bg="#F6F8FA"
              _dark={{ color: '#C9D1D9', borderColor: '#30363D', bg: '#21262D' }}
              leftIcon={<BsTwitterX />}
              rightIcon={<ExternalLinkIcon />}
              w="100%"
              _hover={{ textDecoration: 'none', bg: '#F3F4F6', _dark: { bg: '#30363D' } }}
            >
              {t('profile.twitter')}
            </Button>
          )}
        </VStack>
      )}

      <Divider mb={4} />

      {/* Stats row */}
      <Flex justify="space-around" mb={4}>
        <Tooltip label={t('profile.followers')} hasArrow>
          <Stat textAlign="center" cursor="default">
            <StatNumber fontSize="lg" fontFamily="mono" fontWeight="bold" color="gray.800" _dark={{ color: 'gray.200' }}>
              {user.followers.toLocaleString()}
            </StatNumber>
            <StatLabel fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="widest">{t('profile.followers')}</StatLabel>
          </Stat>
        </Tooltip>
        <Divider orientation="vertical" h="40px" alignSelf="center" />
        <Tooltip label={t('profile.following')} hasArrow>
          <Stat textAlign="center" cursor="default">
            <StatNumber fontSize="lg" fontFamily="mono" fontWeight="bold" color="gray.800" _dark={{ color: 'gray.200' }}>
              {user.following.toLocaleString()}
            </StatNumber>
            <StatLabel fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="widest">{t('profile.following')}</StatLabel>
          </Stat>
        </Tooltip>
        <Divider orientation="vertical" h="40px" alignSelf="center" />
        <Tooltip label={t('profile.publicRepos')} hasArrow>
          <Stat textAlign="center" cursor="default">
            <StatNumber fontSize="lg" fontFamily="mono" fontWeight="bold" color="gray.800" _dark={{ color: 'gray.200' }}>
              {user.public_repos.toLocaleString()}
            </StatNumber>
            <StatLabel fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="widest">{t('profile.repos')}</StatLabel>
          </Stat>
        </Tooltip>
      </Flex>

      <Divider mb={4} />

      {/* Extra info rows */}
      <VStack spacing={2} align="stretch">
        <InfoRow icon={<BsBuilding size={14} />} value={user.company?.replace(/^@/, '')} />
        <InfoRow icon={<BsGeoAlt size={14} />}   value={user.location} />
        <InfoRow
          icon={<BsEnvelope size={14} />}
          value={user.email}
          href={user.email ? `mailto:${user.email}` : null}
        />
      </VStack>
    </Box>
  );
}
