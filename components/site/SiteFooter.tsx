import { Box, Container, Divider, Grid, HStack, Icon, Stack, Text } from "@chakra-ui/react";
import { Mail, MapPin } from "lucide-react";
import { BrandMark } from "@/components/brand/BrandMark";
import { PressLogo } from "@/components/brand/PressLogo";
import { SiteAnchor } from "@/components/site/SiteAnchor";
import { SiteChrome } from "@/components/site/SiteChrome";

export function SiteFooter() {
  return (
    <Box as="footer" bg="slate.50" borderTop="1px solid" borderColor="slate.200">
      <Container maxW="7xl" px={{ base: 4, md: 8 }} py={{ base: 10, md: 14 }}>
        <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={{ base: 8, md: 12 }}>
          <Box>
            <HStack spacing={2} mb={3} align="center">
              <Box color="text.primary" lineHeight={0}>
                <BrandMark />
              </Box>
              <Text
                fontFamily="heading"
                fontSize="sm"
                fontWeight="bold"
                color="text.primary"
                lineHeight="tall"
              >
                {SiteChrome.homeLabel()}
              </Text>
            </HStack>
            <Text fontSize="xs" color="slate.400" lineHeight="tall" mb={4}>
              {SiteChrome.tagline}
            </Text>
            <Stack spacing={2} mb={4} align="flex-start">
              <HStack spacing={2}>
                <Icon as={Mail} boxSize={3.5} color="slate.400" aria-hidden />
                <SiteAnchor
                  href={`mailto:${SiteChrome.email}`}
                  fontSize="xs"
                  color="slate.600"
                  lineHeight="tall"
                  transition="color 0.15s"
                  _hover={{ color: "brand.500", textDecoration: "none" }}
                >
                  {SiteChrome.email}
                </SiteAnchor>
              </HStack>
              <HStack spacing={2}>
                <Icon as={MapPin} boxSize={3.5} color="slate.400" aria-hidden />
                <Text fontSize="xs" color="slate.400" lineHeight="tall">
                  {SiteChrome.location}
                </Text>
              </HStack>
            </Stack>
          </Box>
          {SiteChrome.linkColumns().map((column) => (
            <Box as="nav" key={column.title} aria-label={column.title}>
              <Text
                fontFamily="heading"
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                letterSpacing="0.06em"
                color="slate.700"
                mb={3}
                lineHeight="tall"
              >
                {column.title}
              </Text>
              <Stack spacing={2} align="flex-start">
                {column.links.map((link) => (
                  <SiteAnchor
                    key={link.href}
                    href={link.href}
                    id={link.href === SiteChrome.cookieSettingsHref() ? SiteChrome.cookieSettingsId : undefined}
                    fontSize="sm"
                    color="slate.600"
                    lineHeight="tall"
                    transition="color 0.15s"
                    _hover={{ color: "brand.500", textDecoration: "none" }}
                  >
                    {link.label}
                  </SiteAnchor>
                ))}
              </Stack>
            </Box>
          ))}
        </Grid>

        <Box mt={{ base: 10, md: 12 }}>
          <Text
            textAlign="center"
            fontSize="xs"
            fontWeight="semibold"
            letterSpacing="0.08em"
            textTransform="uppercase"
            color="slate.400"
            lineHeight="tall"
            mb={{ base: 4, md: 5 }}
          >
            {SiteChrome.asSeenOnLabel}
          </Text>
          <Box
            as="ul"
            listStyleType="none"
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            columnGap={{ base: 8, md: 12 }}
            rowGap={{ base: 6, md: 8 }}
            p={0}
            m={0}
          >
            {SiteChrome.pressMentions().map((mention) => (
              <Box as="li" key={mention.label} display="flex" alignItems="center" minH="40px">
                <PressLogo name={mention.label} href={mention.href} />
              </Box>
            ))}
          </Box>
        </Box>

        <Divider borderColor="slate.200" opacity={0.6} my={8} />
        <Text
          fontFamily="heading"
          fontSize="xs"
          color="slate.400"
          textAlign="center"
          lineHeight="tall"
        >
          {SiteChrome.copyright}
        </Text>
      </Container>
    </Box>
  );
}
