import { useTranslation } from 'react-i18next';
import {
  Box,
  Select,
  Flex,
  Text,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

/** Sort field options as expected by the GitHub API */
const SORT_OPTIONS = [
  { value: 'pushed',    labelKey: 'sort.pushed'     },
  { value: 'created',   labelKey: 'sort.created'   },
  { value: 'full_name', labelKey: 'sort.full_name'  },
];



/**
 * SortSelector — a compound control for choosing sort field + direction.
 *
 * Props:
 *   sort         {string}   current sort field value
 *   direction    {string}   current direction value
 *   onSortChange    {fn}    called with new sort field string
 *   onDirectionChange {fn}  called with new direction string
 */
export function SortSelector({ sort, direction, onSortChange, onDirectionChange }) {
  const { t } = useTranslation();
  const optionBg = useColorModeValue('#FFFFFF', '#0D1117');
  const optionColor = useColorModeValue('#1F2328', '#E6EDF3');

  const isNameSort = sort === 'full_name';
  const directionOptions = [
    { value: 'desc', labelKey: isNameSort ? 'sort.name_desc' : 'sort.date_desc' },
    { value: 'asc',  labelKey: isNameSort ? 'sort.name_asc'  : 'sort.date_asc'  },
  ];

  const selectStyles = {
    bg: '#FFFFFF',
    borderColor: '#D0D7DE',
    border: '1px solid',
    color: '#1F2328',
    _dark: { bg: '#0D1117', borderColor: '#30363D', color: '#E6EDF3' },
    borderRadius: 'lg',
    fontSize: 'sm',
    _hover: { borderColor: '#8C959F' },
    _focus: { borderColor: '#0969DA', boxShadow: '0 0 0 1px #0969DA' },
  };

  return (
    <Flex
      align={{ base: 'flex-start', sm: 'center' }}
      gap={4}
      direction={{ base: 'column', sm: 'row' }}
      bg="transparent"
      _dark={{ bg: 'transparent' }}
      pb={4}
      pt={2}
    >
      {/* Sort field */}
      <Stack direction="row" align="center" spacing={2} flexShrink={0}>
        <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }} fontWeight="medium" whiteSpace="nowrap">
          {t('sort.label')}
        </Text>
        <Select
          id="sort-field-select"
          size="sm"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          w="160px"
          aria-label={t('sort.fieldAria')}
          {...selectStyles}
        >
          {SORT_OPTIONS.map(({ value, labelKey }) => (
            <option key={value} value={value} style={{ background: optionBg, color: optionColor }}>
              {t(labelKey)}
            </option>
          ))}
        </Select>
      </Stack>

      {/* Direction */}
      <Stack direction="row" align="center" spacing={2} flexShrink={0}>
        <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }} fontWeight="medium" whiteSpace="nowrap">
          {t('sort.direction')}
        </Text>
        <Select
          id="sort-direction-select"
          size="sm"
          value={direction}
          onChange={(e) => onDirectionChange(e.target.value)}
          w="130px"
          aria-label={t('sort.directionAria')}
          {...selectStyles}
        >
          {directionOptions.map(({ value, labelKey }) => (
            <option key={value} value={value} style={{ background: optionBg, color: optionColor }}>
              {t(labelKey)}
            </option>
          ))}
        </Select>
      </Stack>
    </Flex>
  );
}
