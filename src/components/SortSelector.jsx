import { useTranslation } from 'react-i18next';
import {
  Box,
  Select,
  Flex,
  Text,
  Stack,
} from '@chakra-ui/react';

/** Sort field options as expected by the GitHub API */
const SORT_OPTIONS = [
  { value: 'updated',   labelKey: 'sort.updated'   },
  { value: 'created',   labelKey: 'sort.created'   },
  { value: 'pushed',    labelKey: 'sort.pushed'     },
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

  const isNameSort = sort === 'full_name';
  const directionOptions = [
    { value: 'desc', labelKey: isNameSort ? 'sort.name_desc' : 'sort.date_desc' },
    { value: 'asc',  labelKey: isNameSort ? 'sort.name_asc'  : 'sort.date_asc'  },
  ];

  const selectStyles = {
    bg: 'white',
    borderColor: 'gray.200',
    borderRadius: 'lg',
    fontSize: 'sm',
    _hover: { borderColor: 'blue.400' },
    _focus: { borderColor: 'blue.500', boxShadow: '0 0 0 2px rgba(66,153,225,0.25)' },
  };

  return (
    <Flex
      align={{ base: 'flex-start', sm: 'center' }}
      gap={4}
      direction={{ base: 'column', sm: 'row' }}
      bg="gray.50"
      px={4}
      py={3}
      borderRadius="xl"
      border="1px solid"
      borderColor="gray.100"
    >
      {/* Sort field */}
      <Stack direction="row" align="center" spacing={2} flexShrink={0}>
        <Text fontSize="sm" color="gray.500" fontWeight="medium" whiteSpace="nowrap">
          {t('sort.label')}
        </Text>
        <Select
          id="sort-field-select"
          size="sm"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          w="160px"
          {...selectStyles}
        >
          {SORT_OPTIONS.map(({ value, labelKey }) => (
            <option key={value} value={value}>{t(labelKey)}</option>
          ))}
        </Select>
      </Stack>

      {/* Direction */}
      <Stack direction="row" align="center" spacing={2} flexShrink={0}>
        <Text fontSize="sm" color="gray.500" fontWeight="medium" whiteSpace="nowrap">
          {t('sort.direction')}
        </Text>
        <Select
          id="sort-direction-select"
          size="sm"
          value={direction}
          onChange={(e) => onDirectionChange(e.target.value)}
          w="130px"
          {...selectStyles}
        >
          {directionOptions.map(({ value, labelKey }) => (
            <option key={value} value={value}>{t(labelKey)}</option>
          ))}
        </Select>
      </Stack>
    </Flex>
  );
}
