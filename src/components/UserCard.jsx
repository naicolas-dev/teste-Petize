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
import { BsTwitterX, BsGlobe, BsBuilding, BsGeoAlt, BsEnvelope, BsLink45Deg } from 'react-icons/bs';
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

  const content = (
    <HStack spacing={2} fontSize="sm">
      <Box flexShrink={0} color={textMuted} display="flex" alignItems="center">
        {icon}
      </Box>
      <Text noOfLines={1} color={href ? linkColor : textMuted}>
        {value}
      </Text>
    </HStack>
  );

  if (href) {
    return (
      <Link href={href} isExternal _hover={{ textDecoration: 'underline' }}>
        {content}
      </Link>
    );
  }

  return content;
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

  const cardBg      = useColorModeValue('#FFFFFF', '#161B22');
  const borderColor = useColorModeValue('#D0D7DE', '#30363D');
  const textMain    = useColorModeValue('#1F2328', '#E6EDF3');
  const textMuted   = useColorModeValue('#57606A', '#8B949E');
  const linkColor   = useColorModeValue('#0969DA', '#58A6FF');

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
      p={{ base: 4, md: 5 }}
    >
      <VStack spacing={4} align="stretch">
        {/* ── Header: Avatar + (Name & Username) side-by-side ────────── */}
        <HStack spacing={4} align="center">
          <Avatar
            src={user.avatar_url}
            name={user.name ?? user.login}
            size="lg"
            borderRadius="full"
            flexShrink={0}
          />
          <VStack spacing={0} align="flex-start" minW={0}>
            {user.name && (
              <Heading
                as="h1"
                fontSize="xl"
                color={textMain}
                fontWeight="700"
                noOfLines={1}
                lineHeight="1.2"
              >
                {user.name}
              </Heading>
            )}
            <Text
              fontSize="md"
              color={textMuted}
              noOfLines={1}
            >
              @{user.login}
            </Text>
          </VStack>
        </HStack>

        {/* ── Bio ────────────────────────────────────────────────────── */}
        {user.bio && (
          <Text fontSize="sm" color={textMuted} lineHeight="tall">
            <BioWithLinks bio={user.bio} linkColor={linkColor} />
          </Text>
        )}

        {/* ── Stats and Info Rows (Unified List Layout) ──────────────── */}
        <VStack spacing={2} align="stretch">
          {/* Followers */}
          <HStack spacing={2} fontSize="sm">
            <Box color={textMuted}><GoPeople size={16} /></Box>
            <Text color={textMuted}>
              <Text as="span" fontWeight="600" color={textMain}>{user.followers.toLocaleString()}</Text> {t('profile.followers')}
            </Text>
          </HStack>

          {/* Following */}
          <HStack spacing={2} fontSize="sm">
            <Box color={textMuted}><AiOutlineHeart size={16} /></Box>
            <Text color={textMuted}>
              <Text as="span" fontWeight="600" color={textMain}>{user.following.toLocaleString()}</Text> {t('profile.following')}
            </Text>
          </HStack>

          {/* Spacing before general info */}
          <Box pt={2} />

          <InfoRow
            icon={<BsBuilding size={16} />}
            value={user.company?.replace(/^@/, '')}
            textMuted={textMuted}
            linkColor={linkColor}
          />
          <InfoRow
            icon={<BsGeoAlt size={16} />}
            value={user.location}
            textMuted={textMuted}
            linkColor={linkColor}
          />
          <InfoRow
            icon={<BsEnvelope size={16} />}
            value={user.email}
            href={user.email ? `mailto:${user.email}` : null}
            textMuted={textMuted}
            linkColor={linkColor}
          />
          {blogUrl && (
            <InfoRow
              icon={<BsLink45Deg size={16} />}
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
        </VStack>
      </VStack>
    </Box>
  );
}
