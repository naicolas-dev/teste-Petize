import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HStack,
  Button,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  Flex,
  Divider,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';
import { MdTranslate, MdComputer } from 'react-icons/md';

const THEME_KEY = 'petize-theme';
const LANG_KEY  = 'petize-lng';

export function SettingsControls() {
  const { colorMode, setColorMode } = useColorMode();
  const { i18n, t } = useTranslation();

  const isPt  = i18n.language.startsWith('pt');
  const isDark = colorMode === 'dark';

  const [themePreference, setThemePreference] = useState(
    () => localStorage.getItem(THEME_KEY) || 'system'
  );

  const applyTheme = (pref) => {
    setThemePreference(pref);
    localStorage.setItem(THEME_KEY, pref);
    if (pref === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorMode(prefersDark ? 'dark' : 'light');
    } else {
      setColorMode(pref);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) applyTheme(saved);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem(LANG_KEY, lang);
  };

  // ─── Palette ──────────────────────────────────────────────────────
  const containerBg     = useColorModeValue('#FFFFFF', '#21262D');
  const containerBorder = useColorModeValue('#D0D7DE', '#30363D');
  const btnColor        = useColorModeValue('#1F2328', '#E6EDF3');
  const btnHover        = useColorModeValue('#F6F8FA', '#2D333B');
  const menuBg          = useColorModeValue('#FFFFFF', '#161B22');
  const menuBorder      = useColorModeValue('#D0D7DE', '#30363D');
  const menuShadow      = useColorModeValue(
    '0 8px 24px rgba(140,149,159,0.2)',
    '0 8px 24px rgba(0,0,0,0.6)'
  );
  const itemHover       = useColorModeValue('#F6F8FA', '#21262D');
  const divColor        = useColorModeValue('#D0D7DE', '#30363D');
  const labelColor      = useColorModeValue('#57606A', '#8B949E');
  const activeColor     = '#0969DA';

  // Current theme label + icon
  const themeLabel =
    themePreference === 'system' ? t('settings.systemMode') :
    themePreference === 'dark'   ? t('settings.darkMode')   :
                                   t('settings.lightMode');

  const themeIcon =
    themePreference === 'system' ? <MdComputer />   :
    themePreference === 'dark'   ? <MoonIcon />      :
                                   <SunIcon />;

  // Shared MenuList styling
  const listProps = {
    bg: menuBg,
    border: '1px solid',
    borderColor: menuBorder,
    boxShadow: menuShadow,
    borderRadius: 'xl',
    p: 1,
    minW: '170px',
    zIndex: 'popover',
  };

  // Row for each menu item — check at the right, no layout shift
  const Row = ({ label, icon, isActive, onClick }) => (
    <MenuItem
      onClick={onClick}
      borderRadius="lg"
      bg="transparent"
      color={btnColor}
      fontSize="sm"
      px={3}
      py={2}
      _hover={{ bg: itemHover }}
      _focus={{ bg: itemHover }}
    >
      <Flex align="center" justify="space-between" w="full">
        <Flex align="center" gap={2}>
          {icon}
          <Text>{label}</Text>
        </Flex>
        {isActive && <CheckIcon boxSize={3} color={activeColor} />}
      </Flex>
    </MenuItem>
  );

  return (
    // Pill-shaped container that groups both controls — visually obvious
    <HStack
      spacing={0}
      bg={containerBg}
      border="1px solid"
      borderColor={containerBorder}
      borderRadius="full"
      boxShadow="sm"
      overflow="hidden"
      h="32px"
    >
      {/* ── Language Menu ───────────────────────────────── */}
      <Menu placement="bottom-end" isLazy>
        <MenuButton
          as={Button}
          variant="ghost"
          size="xs"
          h="100%"
          px={3}
          gap={1}
          color={btnColor}
          borderRadius="0"
          fontWeight="600"
          fontSize="xs"
          _hover={{ bg: btnHover }}
          _active={{ bg: btnHover }}
          rightIcon={<ChevronDownIcon boxSize={3} />}
          leftIcon={<MdTranslate />}
        >
          {isPt ? 'pt-BR' : 'en-US'}
        </MenuButton>

        <MenuList {...listProps}>
          {/* section label */}
          <Text px={3} pt={1} pb={1} fontSize="11px" fontWeight="600" color={labelColor} textTransform="uppercase" letterSpacing="wider">
            {t('settings.language')}
          </Text>
          <Row
            label="Português (BR)"
            icon={<Text fontSize="sm">🇧🇷</Text>}
            isActive={isPt}
            onClick={() => applyLanguage('pt')}
          />
          <Row
            label="English (US)"
            icon={<Text fontSize="sm">🇺🇸</Text>}
            isActive={!isPt}
            onClick={() => applyLanguage('en')}
          />
        </MenuList>
      </Menu>

      {/* vertical separator */}
      <Divider orientation="vertical" borderColor={containerBorder} h="16px" />

      {/* ── Theme Menu ──────────────────────────────────── */}
      <Menu placement="bottom-end" isLazy>
        <MenuButton
          as={Button}
          variant="ghost"
          size="xs"
          h="100%"
          px={3}
          gap={1}
          color={btnColor}
          borderRadius="0"
          fontWeight="500"
          fontSize="xs"
          _hover={{ bg: btnHover }}
          _active={{ bg: btnHover }}
          rightIcon={<ChevronDownIcon boxSize={3} />}
          leftIcon={themeIcon}
        >
          {themeLabel}
        </MenuButton>

        <MenuList {...listProps}>
          {/* section label */}
          <Text px={3} pt={1} pb={1} fontSize="11px" fontWeight="600" color={labelColor} textTransform="uppercase" letterSpacing="wider">
            {t('settings.theme')}
          </Text>
          <Row
            label={t('settings.lightMode')}
            icon={<SunIcon boxSize={3.5} />}
            isActive={themePreference === 'light'}
            onClick={() => applyTheme('light')}
          />
          <Row
            label={t('settings.darkMode')}
            icon={<MoonIcon boxSize={3.5} />}
            isActive={themePreference === 'dark'}
            onClick={() => applyTheme('dark')}
          />
          <MenuDivider borderColor={divColor} my={1} />
          <Row
            label={t('settings.systemMode')}
            icon={<MdComputer />}
            isActive={themePreference === 'system'}
            onClick={() => applyTheme('system')}
          />
        </MenuList>
      </Menu>
    </HStack>
  );
}
