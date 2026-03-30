import {
  Box,
  VStack,
  HStack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Divider,
  Flex,
  Grid,
  GridItem,
  Container,
} from '@chakra-ui/react';

/**
 * RepoSkeleton — A skeleton loader that mirrors the RepoCard layout.
 */
export function RepoSkeleton() {
  return (
    <Box
      p={5}
      bg="white"
      _dark={{ bg: '#161B22', borderColor: '#30363D' }}
      border="1px solid"
      borderColor="#D0D7DE"
      borderRadius="xl"
      w="100%"
    >
      <VStack align="stretch" spacing={3}>
        <Skeleton h="20px" w="40%" borderRadius="md" />
        <SkeletonText noOfLines={2} spacing="4" skeletonHeight="2" />
        <HStack spacing={4} pt={2}>
          <Skeleton h="12px" w="60px" borderRadius="full" />
          <Skeleton h="12px" w="40px" borderRadius="full" />
          <Skeleton h="12px" w="40px" borderRadius="full" />
        </HStack>
      </VStack>
    </Box>
  );
}

/**
 * ProfileSkeleton — A skeleton loader that mirrors the UserCard layout.
 */
export function ProfileSkeleton() {
  return (
    <Box
      bg="#FFFFFF"
      _dark={{ bg: '#161B22', borderColor: '#30363D' }}
      border="1px solid"
      borderColor="#D0D7DE"
      borderRadius="xl"
      p={6}
      w="100%"
    >
      {/* Avatar + name block */}
      <VStack spacing={4} align="center" mb={5}>
        <SkeletonCircle size="120px" />
        <VStack spacing={2} w="100%" align="center">
          <Skeleton h="24px" w="70%" borderRadius="md" />
          <Skeleton h="16px" w="40%" borderRadius="md" />
        </VStack>
      </VStack>

      {/* Bio */}
      <VStack spacing={2} mb={6}>
        <Skeleton h="12px" w="90%" borderRadius="full" />
        <Skeleton h="12px" w="80%" borderRadius="full" />
      </VStack>

      <Divider mb={6} />

      {/* Stats */}
      <Flex justify="space-around" mb={6}>
        <VStack spacing={1}>
          <Skeleton h="20px" w="40px" borderRadius="md" />
          <Skeleton h="10px" w="50px" borderRadius="full" />
        </VStack>
        <Divider orientation="vertical" h="30px" />
        <VStack spacing={1}>
          <Skeleton h="20px" w="40px" borderRadius="md" />
          <Skeleton h="10px" w="50px" borderRadius="full" />
        </VStack>
        <Divider orientation="vertical" h="30px" />
        <VStack spacing={1}>
          <Skeleton h="20px" w="40px" borderRadius="md" />
          <Skeleton h="10px" w="50px" borderRadius="full" />
        </VStack>
      </Flex>

      <Divider mb={6} />

      {/* Info rows */}
      <VStack spacing={3} align="stretch">
        <HStack spacing={3}>
          <SkeletonCircle size="14px" />
          <Skeleton h="12px" w="60%" borderRadius="full" />
        </HStack>
        <HStack spacing={3}>
          <SkeletonCircle size="14px" />
          <Skeleton h="12px" w="50%" borderRadius="full" />
        </HStack>
        <HStack spacing={3}>
          <SkeletonCircle size="14px" />
          <Skeleton h="12px" w="70%" borderRadius="full" />
        </HStack>
      </VStack>
    </Box>
  );
}

/**
 * PageSkeleton — Orchestrates the full page loading state.
 */
export function PageSkeleton() {
  return (
    <Grid
      templateColumns={{ base: '1fr', md: '300px 1fr' }}
      gap={{ base: 6, md: 8 }}
      alignItems="start"
    >
      <GridItem>
        <ProfileSkeleton />
      </GridItem>
      <GridItem>
        <VStack align="stretch" spacing={4}>
          <HStack mb={2}>
            <Skeleton h="18px" w="120px" borderRadius="md" />
            <Skeleton h="14px" w="60px" borderRadius="full" />
          </HStack>
          <RepoSkeleton />
          <RepoSkeleton />
          <RepoSkeleton />
          <RepoSkeleton />
        </VStack>
      </GridItem>
    </Grid>
  );
}
