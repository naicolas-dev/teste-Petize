import { useTranslation } from 'react-i18next';
import {
  HStack,
  IconButton,
  Button,
  useColorMode,
  Tooltip,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { MdTranslate } from 'react-icons/md';

/**
 * SettingsControls — grouped buttons to toggle Light/Dark Mode and Language (EN/PT).
 * Local Storage functionality:
 *   - useColorMode (Chakra) natively saves to localStorage ('chakra-ui-color-mode').
 *   - i18n saves to localStorage manually inside the toggle logic.
 */
export function SettingsControls() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { i18n, t } = useTranslation();

  const isDark = colorMode === 'dark';
  const isPt = i18n.language.startsWith('pt');

  const toggleLanguage = () => {
    const nextLng = isPt ? 'en' : 'pt';
    i18n.changeLanguage(nextLng);
    // Note: ensure i18n/index.js respects this key on initial boot if configured manually
    localStorage.setItem('petize-lng', nextLng);
  };

  return (
    <HStack spacing={2}>
      {/* Language Toggle */}
      <Tooltip label={isPt ? t('settings.switchToEn') : t('settings.switchToPt')} hasArrow placement="bottom-end">
        <Button
          onClick={toggleLanguage}
          variant="ghost"
          size="sm"
          leftIcon={<MdTranslate />}
          fontFamily="monospace"
        >
          {isPt ? 'EN' : 'PT'}
        </Button>
      </Tooltip>

      {/* Theme Toggle */}
      <Tooltip label={isDark ? t('settings.lightMode') : t('settings.darkMode')} hasArrow placement="bottom-end">
        <IconButton
          icon={isDark ? <SunIcon /> : <MoonIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          size="sm"
          aria-label="Toggle theme"
        />
      </Tooltip>
    </HStack>
  );
}
