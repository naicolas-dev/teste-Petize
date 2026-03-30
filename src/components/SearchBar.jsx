import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';

/**
 * SearchBar — controlled search input that navigates to /profile/:username on submit.
 * Props:
 *   initialValue {string}   - Pre-fill the input (useful when on profile page)
 *   onError      {function} - Called when the user submits an empty query
 */
export function SearchBar({ initialValue = '', onError }) {
  const { t }       = useTranslation();
  const navigate    = useNavigate();
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      onError?.();
      return;
    }
    navigate(`/profile/${encodeURIComponent(trimmed)}`);
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="100%">
      <Flex gap={3} direction={{ base: 'column', sm: 'row' }}>
        <InputGroup size="lg" flex={1}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            id="search-username-input"
            variant="outline"
            size="lg"
            placeholder={t('home.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fontSize="md"
          />
        </InputGroup>

        <Button
          id="search-submit-button"
          type="submit"
          variant="solid"
          size="lg"
          px={8}
          fontWeight="semibold"
          flexShrink={0}
        >
          {t('home.searchButton')}
        </Button>
      </Flex>

      {/* Hint text */}
      <Text mt={2} fontSize="sm" color="gray.400" textAlign={{ base: 'center', sm: 'left' }}>
        {t('home.searchHint')}
      </Text>
    </Box>
  );
}
