import { useState, useEffect, useRef } from 'react';
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
 * SearchBar - controlled search input for GitHub username lookup.
 *
 * Props:
 *   initialValue {string}   pre-fill value (profile page)
 *   onError      {function} called when query is empty
 *   onSearch     {function} optional async callback receiving trimmed query
 *   onQueryChange {function} optional callback receiving the raw input value
 *   showHint     {boolean}  controls hint visibility
 */
export function SearchBar({
  initialValue = '',
  onError,
  onSearch,
  onQueryChange,
  showHint = true,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const onQueryChangeRef = useRef(onQueryChange);

  useEffect(() => {
    onQueryChangeRef.current = onQueryChange;
  }, [onQueryChange]);

  useEffect(() => {
    setQuery(initialValue);
    onQueryChangeRef.current?.(initialValue);
  }, [initialValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      onError?.();
      return;
    }

    if (onSearch) {
      setIsSubmitting(true);
      try {
        await onSearch(trimmed);
      } finally {
        setIsSubmitting(false);
      }
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
            onChange={(e) => {
              setQuery(e.target.value);
              onQueryChange?.(e.target.value);
            }}
            fontSize="md"
            aria-label={t('home.searchInputAria')}
            autoComplete="off"
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
          isLoading={isSubmitting}
          loadingText={t('home.searchLoading')}
          aria-label={t('home.searchButtonAria')}
        >
          {t('home.searchButton')}
        </Button>
      </Flex>

      {showHint && (
        <Text mt={2} fontSize="sm" color="gray.400" textAlign={{ base: 'center', sm: 'left' }}>
          {t('home.searchHint')}
        </Text>
      )}
    </Box>
  );
}
