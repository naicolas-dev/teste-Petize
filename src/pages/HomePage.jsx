import { Box, Heading, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

/**
 * HomePage — route: /
 * Entry point of the app: GitHub user search.
 */
function HomePage() {
  const { t } = useTranslation();

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Heading size="lg">{t('home.title')}</Heading>
    </Box>
  );
}

export default HomePage;
