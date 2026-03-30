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
const LANG_KEY = 'petize-lng';

export function SettingsControls() {
  const { setColorMode } = useColorMode();
  const { i18n, t } = useTranslation();

  const isPt = i18n.language.startsWith('pt');

  const [themePreference, setThemePreference] = useState(
    () => localStorage.getItem(THEME_KEY) || 'system'
  );

  const applyTheme = (preference) => {
    setThemePreference(preference);
    localStorage.setItem(THEME_KEY, preference);

    if (preference === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setColorMode(prefersDark ? 'dark' : 'light');
      return;
    }

    setColorMode(preference);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) applyTheme(savedTheme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyLanguage = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem(LANG_KEY, language);
  };

  const containerBg = useColorModeValue('#FFFFFF', '#21262D');
  const containerBorder = useColorModeValue('#D0D7DE', '#30363D');
  const buttonColor = useColorModeValue('#1F2328', '#E6EDF3');
  const buttonHover = useColorModeValue('#F6F8FA', '#2D333B');
  const menuBg = useColorModeValue('#FFFFFF', '#161B22');
  const menuBorder = useColorModeValue('#D0D7DE', '#30363D');
  const menuShadow = useColorModeValue(
    '0 8px 24px rgba(140,149,159,0.2)',
    '0 8px 24px rgba(0,0,0,0.6)'
  );
  const itemHover = useColorModeValue('#F6F8FA', '#21262D');
  const dividerColor = useColorModeValue('#D0D7DE', '#30363D');
  const labelColor = useColorModeValue('#57606A', '#8B949E');
  const activeColor = '#0969DA';

  const themeLabel =
    themePreference === 'system'
      ? t('settings.systemMode')
      : themePreference === 'dark'
        ? t('settings.darkMode')
        : t('settings.lightMode');

  const themeIcon =
    themePreference === 'system'
      ? <MdComputer />
      : themePreference === 'dark'
        ? <MoonIcon />
        : <SunIcon />;

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

  const Row = ({ label, icon, isActive, onClick }) => (
    <MenuItem
      onClick={onClick}
      borderRadius="lg"
      bg="transparent"
      color={buttonColor}
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
      <Menu placement="bottom-end" isLazy>
        <MenuButton
          as={Button}
          variant="ghost"
          size="xs"
          h="100%"
          px={3}
          gap={1}
          color={buttonColor}
          borderRadius="0"
          fontWeight="600"
          fontSize="xs"
          _hover={{ bg: buttonHover }}
          _active={{ bg: buttonHover }}
          rightIcon={<ChevronDownIcon boxSize={3} />}
          leftIcon={<MdTranslate />}
          aria-label={t('settings.languageMenuAria')}
        >
          {isPt ? t('settings.languageCodePt') : t('settings.languageCodeEn')}
        </MenuButton>

        <MenuList {...listProps}>
          <Text
            px={3}
            pt={1}
            pb={1}
            fontSize="11px"
            fontWeight="600"
            color={labelColor}
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {t('settings.language')}
          </Text>
          <Row
            label={t('settings.languagePtBr')}
            icon={<Text fontSize="xs" fontWeight="bold">PT</Text>}
            isActive={isPt}
            onClick={() => applyLanguage('pt')}
          />
          <Row
            label={t('settings.languageEnUs')}
            icon={<Text fontSize="xs" fontWeight="bold">EN</Text>}
            isActive={!isPt}
            onClick={() => applyLanguage('en')}
          />
        </MenuList>
      </Menu>

      <Divider orientation="vertical" borderColor={containerBorder} h="16px" />

      <Menu placement="bottom-end" isLazy>
        <MenuButton
          as={Button}
          variant="ghost"
          size="xs"
          h="100%"
          px={3}
          gap={1}
          color={buttonColor}
          borderRadius="0"
          fontWeight="500"
          fontSize="xs"
          _hover={{ bg: buttonHover }}
          _active={{ bg: buttonHover }}
          rightIcon={<ChevronDownIcon boxSize={3} />}
          leftIcon={themeIcon}
          aria-label={t('settings.themeMenuAria')}
        >
          {themeLabel}
        </MenuButton>

        <MenuList {...listProps}>
          <Text
            px={3}
            pt={1}
            pb={1}
            fontSize="11px"
            fontWeight="600"
            color={labelColor}
            textTransform="uppercase"
            letterSpacing="wider"
          >
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
          <MenuDivider borderColor={dividerColor} my={1} />
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
