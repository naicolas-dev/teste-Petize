import { Box, Heading } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * ProfilePage — route: /profile/:username
 * Displays the GitHub user profile for the given username param.
 * Accessible via direct link, e.g. /profile/torvalds
 */
function ProfilePage() {
  const { username } = useParams();
  const { t } = useTranslation();

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Heading size="lg">{t('profile.title', { username })}</Heading>
    </Box>
  );
}

export default ProfilePage;
