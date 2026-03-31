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
  Badge,
  useColorModeValue,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { BsTwitterX, BsGlobe, BsBuilding, BsGeoAlt, BsEnvelope } from 'react-icons/bs';
import { GoPeople, GoRepo, GoLink } from 'react-icons/go';
import { AiOutlineHeart } from 'react-icons/ai';
import { MdWorkOutline } from 'react-icons/md';

/**
 * Extracts all http(s) URLs found in a string of text.
 */
function extractLinksFromBio(bio) {
  if (!bio) return [];
  const urlRegex = /https?:\/\/[^\s<>"']+/g;
  return [...new Set(bio.match(urlRegex) ?? [])];
}

/**
 * Renders bio text with embedded URLs converted to clickable links.
 */
function BioWithLinks({ bio, linkColor }) {
  if (!bio) return null;

  const urlRegex = /https?:\/\/[^\s<>"']+/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = urlRegex.exec(bio)) !== null) {
    if (match.index > lastIndex) {
      parts.push(bio.slice(lastIndex, match.index));
    }
    parts.push(
      <Link key={key++} href={match[0]} isExternal color={linkColor} _hover={{ textDecoration: 'underline' }}>
        {match[0].replace(/^https?:\/\//, '')}
      </Link>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < bio.length) {
    parts.push(bio.slice(lastIndex));
  }

  return <>{parts}</>;
}

/**
 * Builds a full URL from a raw blog/site field that may lack the protocol.
 */
function normalizeBlogUrl(blog) {
  if (!blog) return null;
  return blog.startsWith('http') ? blog : `https://${blog}`;
}

/**
 * A single info row with an icon — shown only when `value` is truthy.
 */
function InfoRow({ icon, value, href, textMuted, linkColor }) {
  if (!value) return null;

  if (href) {
    return (
      <Link href={href} isExternal _hover={{ textDecoration: 'none' }}>
        <HStack spacing={2} fontSize="sm" color={linkColor} _hover={{ textDecoration: 'underline' }}>
          <Box flexShrink={0} color={textMuted}>{icon}</Box>
          <Text noOfLines={1}>{value}</Text>
          <ExternalLinkIcon boxSize={3} opacity={0.6} />
        </HStack>
      </Link>
    );
  }

  return (
    <HStack spacing={2} fontSize="sm">
      <Box flexShrink={0} color={textMuted}>{icon}</Box>
      <Text noOfLines={1} color={textMuted}>{value}</Text>
    </HStack>
  );
}

/**
 * UserCard — left-sidebar card modelled after the GitHub profile sidebar.
 * Shows avatar, name, bio (with clickable links), all available contact
 * and metadata fields, and follower / repo stats — all conditionally.
 *
 * @param {{ user: import('../schemas/githubUser.schema').GitHubUser }} props
 */
export function UserCard({ user }) {
  const { t } = useTranslation();

  const blogUrl    = normalizeBlogUrl(user.blog);
  const twitterUrl = user.twitter_username
    ? `https://twitter.com/${user.twitter_username}`
    : null;

  // URLs found inside the bio text
  const bioLinks = extractLinksFromBio(user.bio);

  const cardBg      = useColorModeValue('#FFFFFF', '#161B22');
  const borderColor = useColorModeValue('#D0D7DE', '#30363D');
  const textMain    = useColorModeValue('#1F2328', '#E6EDF3');
  const textMuted   = useColorModeValue('#57606A', '#8B949E');
  const dividerCol  = useColorModeValue('#D0D7DE', '#30363D');
  const linkColor   = useColorModeValue('#0969DA', '#58A6FF');
  const statBg      = useColorModeValue('#F6F8FA', '#21262D');

  return (
    <Box
      as="aside"
      bg={cardBg}
      border="1px solid"
      borderColor={borderColor}
      borderRadius="xl"
      boxShadow="sm"
      overflow="hidden"
      w="100%"
      position="sticky"
      top="90px"
    >
      {/* ── Header: avatar + name inline ─────────────────────────────── */}
      <Flex align="center" gap={3} p={{ base: 4, md: 5 }} pb={3}>
        <Avatar
          src={user.avatar_url}
          name={user.name ?? user.login}
          size="md"
          borderRadius="full"
          border="2px solid"
          borderColor={borderColor}
          flexShrink={0}
        />
        <VStack spacing={0} align="flex-start" minW={0}>
          {user.name && (
            <Heading
              as="h1"
              size="sm"
              color={textMain}
              fontWeight="700"
              noOfLines={1}
            >
              {user.name}
            </Heading>
          )}
          <Link
            href={user.html_url}
            isExternal
            fontSize="sm"
            color={textMuted}
            _hover={{ color: linkColor, textDecoration: 'none' }}
            noOfLines={1}
          >
            @{user.login}
          </Link>
          {user.type === 'Organization' && (
            <Badge colorScheme="purple" mt={0.5} fontSize="2xs">
              {t('profile.organization')}
            </Badge>
          )}
        </VStack>
      </Flex>

      <Divider borderColor={dividerCol} />

      {/* ── Body ─────────────────────────────────────────────────────── */}
      <VStack spacing={4} align="stretch" p={{ base: 4, md: 5 }}>

        {/* Bio with clickable links */}
        {user.bio && (
          <Text fontSize="sm" color={textMuted} lineHeight="tall">
            <BioWithLinks bio={user.bio} linkColor={linkColor} />
          </Text>
        )}

        {/* ── Stats block ──────────────────────────────────────────── */}
        <Flex gap={2} flexWrap="wrap">
          {/* Followers */}
          <Flex
            flex={1}
            minW="80px"
            align="center"
            justify="center"
            direction="column"
            bg={statBg}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            py={2}
            px={3}
            gap={0}
          >
            <HStack spacing={1} color={textMuted}>
              <GoPeople size={12} />
              <Text fontSize="xs" color={textMuted}>{t('profile.followers')}</Text>
            </HStack>
            <Text fontWeight="700" fontSize="sm" color={textMain}>
              {user.followers.toLocaleString()}
            </Text>
          </Flex>

          {/* Following */}
          <Flex
            flex={1}
            minW="80px"
            align="center"
            justify="center"
            direction="column"
            bg={statBg}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            py={2}
            px={3}
            gap={0}
          >
            <HStack spacing={1} color={textMuted}>
              <AiOutlineHeart size={12} />
              <Text fontSize="xs" color={textMuted}>{t('profile.following')}</Text>
            </HStack>
            <Text fontWeight="700" fontSize="sm" color={textMain}>
              {user.following.toLocaleString()}
            </Text>
          </Flex>

          {/* Public Repos */}
          <Flex
            flex={1}
            minW="80px"
            align="center"
            justify="center"
            direction="column"
            bg={statBg}
            borderRadius="lg"
            border="1px solid"
            borderColor={borderColor}
            py={2}
            px={3}
            gap={0}
          >
            <HStack spacing={1} color={textMuted}>
              <GoRepo size={12} />
              <Text fontSize="xs" color={textMuted}>{t('profile.repos')}</Text>
            </HStack>
            <Text fontWeight="700" fontSize="sm" color={textMain}>
              {user.public_repos.toLocaleString()}
            </Text>
          </Flex>
        </Flex>

        {/* ── Info rows ────────────────────────────────────────────── */}
        <VStack spacing={2} align="stretch">
          <InfoRow
            icon={<BsBuilding size={14} />}
            value={user.company?.replace(/^@/, '')}
            textMuted={textMuted}
            linkColor={linkColor}
          />
          <InfoRow
            icon={<BsGeoAlt size={14} />}
            value={user.location}
            textMuted={textMuted}
            linkColor={linkColor}
          />
          <InfoRow
            icon={<MdWorkOutline size={14} />}
            value={user.hireable ? t('profile.openToWork') : null}
            textMuted={textMuted}
            linkColor={linkColor}
          />
          <InfoRow
            icon={<BsEnvelope size={14} />}
            value={user.email}
            href={user.email ? `mailto:${user.email}` : null}
            textMuted={textMuted}
            linkColor={linkColor}
          />
          {blogUrl && (
            <InfoRow
              icon={<BsGlobe size={14} />}
              value={blogUrl.replace(/^https?:\/\//, '')}
              href={blogUrl}
              textMuted={textMuted}
              linkColor={linkColor}
            />
          )}
          {twitterUrl && (
            <InfoRow
              icon={<BsTwitterX size={14} />}
              value={`@${user.twitter_username}`}
              href={twitterUrl}
              textMuted={textMuted}
              linkColor={linkColor}
            />
          )}

          {/* Extra links extracted from bio */}
          {bioLinks
            .filter(l => l !== blogUrl && !l.includes('twitter.com'))
            .map((link) => (
              <InfoRow
                key={link}
                icon={<GoLink size={14} />}
                value={link.replace(/^https?:\/\//, '')}
                href={link}
                textMuted={textMuted}
                linkColor={linkColor}
              />
            ))
          }
        </VStack>

      </VStack>
    </Box>
  );
}
