import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Text,
  Stack,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons';

/** Sort field options as expected by the GitHub API */
const SORT_OPTIONS = [
  { value: 'pushed', labelKey: 'sort.pushed' },
  { value: 'created', labelKey: 'sort.created' },
  { value: 'full_name', labelKey: 'sort.full_name' },
];

/**
 * SortSelector — a compound control for choosing sort field + direction.
 */
export function SortSelector({ sort, direction, onSortChange, onDirectionChange }) {
  const { t } = useTranslation();

  const isNameSort = sort === 'full_name';
  const directionOptions = [
    { value: 'desc', labelKey: isNameSort ? 'sort.name_desc' : 'sort.date_desc' },
    { value: 'asc', labelKey: isNameSort ? 'sort.name_asc' : 'sort.date_asc' },
  ];

  // Colors and styles consistent with SettingsControls.jsx
  const buttonBg = useColorModeValue('#FFFFFF', '#0D1117');
  const buttonBorder = useColorModeValue('#D0D7DE', '#30363D');
  const buttonHover = useColorModeValue('#F6F8FA', '#21262D');
  const textColor = useColorModeValue('#1F2328', '#E6EDF3');
  const menuBg = useColorModeValue('#FFFFFF', '#161B22');
  const menuShadow = useColorModeValue(
    '0 8px 24px rgba(140,149,159,0.2)',
    '0 8px 24px rgba(0,0,0,0.6)'
  );
  const itemHover = useColorModeValue('#F6F8FA', '#21262D');
  const activeColor = '#0969DA';

  const commonMenuButtonStyles = {
    bg: buttonBg,
    border: '1px solid',
    borderColor: buttonBorder,
    color: textColor,
    borderRadius: 'lg',
    fontSize: 'sm',
    fontWeight: 'medium',
    h: '32px',
    _hover: { bg: buttonHover, borderColor: '#8C959F' },
    _active: { bg: buttonHover },
  };

  const commonMenuListStyles = {
    bg: menuBg,
    borderColor: buttonBorder,
    boxShadow: menuShadow,
    borderRadius: 'xl',
    minW: '160px',
    p: 1,
    zIndex: 'popover',
  };

  const currentSortLabel = t(SORT_OPTIONS.find(o => o.value === sort)?.labelKey || '');
  const currentDirectionLabel = t(directionOptions.find(o => o.value === direction)?.labelKey || '');

  return (
    <Flex
      align={{ base: 'flex-start', sm: 'center' }}
      gap={4}
      direction={{ base: 'column', sm: 'row' }}
      bg="transparent"
      pb={4}
      pt={2}
    >
      {/* Sort field */}
      <Stack direction="row" align="center" spacing={2} flexShrink={0}>
        <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }} fontWeight="medium" whiteSpace="nowrap">
          {t('sort.label')}
        </Text>

        <Menu autoSelect={false} isLazy>
          <MenuButton
            as={Button}
            size="sm"
            variant="outline"
            rightIcon={<ChevronDownIcon boxSize={4} opacity={0.6} />}
            textAlign="left"
            w="160px"
            {...commonMenuButtonStyles}
          >
            <Text noOfLines={1}>{currentSortLabel}</Text>
          </MenuButton>
          <MenuList {...commonMenuListStyles}>
            {SORT_OPTIONS.map(({ value, labelKey }) => (
              <MenuItem
                key={value}
                onClick={() => onSortChange(value)}
                borderRadius="lg"
                bg="transparent"
                _hover={{ bg: itemHover }}
                _focus={{ bg: itemHover }}
                fontSize="sm"
                px={3}
                py={2}
              >
                <Flex align="center" justify="space-between" w="full">
                  <Text>{t(labelKey)}</Text>
                  {sort === value && <CheckIcon boxSize={3} color={activeColor} />}
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Stack>

      {/* Direction */}
      <Stack direction="row" align="center" spacing={2} flexShrink={0}>
        <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }} fontWeight="medium" whiteSpace="nowrap">
          {t('sort.direction')}
        </Text>

        <Menu autoSelect={false} isLazy>
          <MenuButton
            as={Button}
            size="sm"
            variant="outline"
            rightIcon={<ChevronDownIcon boxSize={4} opacity={0.6} />}
            textAlign="left"
            w="140px"
            {...commonMenuButtonStyles}
          >
            <Text noOfLines={1}>{currentDirectionLabel}</Text>
          </MenuButton>
          <MenuList {...commonMenuListStyles}>
            {directionOptions.map(({ value, labelKey }) => (
              <MenuItem
                key={value}
                onClick={() => onDirectionChange(value)}
                borderRadius="lg"
                bg="transparent"
                _hover={{ bg: itemHover }}
                _focus={{ bg: itemHover }}
                fontSize="sm"
                px={3}
                py={2}
              >
                <Flex align="center" justify="space-between" w="full">
                  <Text>{t(labelKey)}</Text>
                  {direction === value && <CheckIcon boxSize={3} color={activeColor} />}
                </Flex>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Stack>
    </Flex>
  );
}

