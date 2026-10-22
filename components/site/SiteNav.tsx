import {
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  useDisclosure,
  type BoxProps,
} from "@chakra-ui/react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Menu, X } from "lucide-react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BrandMark } from "@/components/brand/BrandMark";
import { SiteAnchor } from "@/components/site/SiteAnchor";
import { SiteChrome, type SiteChromeVariant, type SiteLinkItem } from "@/components/site/SiteChrome";

class NavMotion {
  /**
   * Framer props are not part of Chakra's BoxProps. They are forwarded at
   * runtime (initial, animate, and variants are not style props). The duration
   * lives on the variant so it is not eaten as a CSS transition.
   */
  static props(reducedMotion: boolean | null): BoxProps {
    const reduced = reducedMotion === true;
    const variants: Variants = {
      hidden: reduced ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 },
      shown: {
        y: 0,
        opacity: 1,
        transition: { duration: reduced ? 0 : 0.5, ease: "easeOut" },
      },
    };

    return {
      initial: "hidden",
      animate: "shown",
      variants,
    } as BoxProps;
  }
}

type SiteNavProps = {
  variant?: SiteChromeVariant;
};

function LogoLockup() {
  return (
    <SiteAnchor
      href="/"
      aria-label="Sosh AI home"
      display="inline-flex"
      alignItems="center"
      gap={2.5}
      flexShrink={0}
      _hover={{ textDecoration: "none" }}
    >
      <Flex
        align="center"
        justify="center"
        boxSize={8}
        borderRadius="lg"
        bg="brand.600"
        color="white"
        flexShrink={0}
      >
        <BrandMark />
      </Flex>
      <Text
        as="span"
        fontFamily="heading"
        fontSize="lg"
        fontWeight="extrabold"
        letterSpacing="-0.03em"
        color="text.primary"
        lineHeight="tall"
      >
        {SiteChrome.homeLabel()}
      </Text>
    </SiteAnchor>
  );
}

function DesktopLinks({ pathname }: { pathname: string }) {
  return (
    <HStack display={{ base: "none", md: "flex" }} spacing={8}>
      {SiteChrome.primaryLinks().map((link) => (
        <NavTextLink key={link.href} link={link} pathname={pathname} />
      ))}
    </HStack>
  );
}

function NavTextLink({
  link,
  pathname,
  onNavigate,
}: {
  link: SiteLinkItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <SiteAnchor
      href={link.href}
      aria-current={pathname === link.href ? "page" : undefined}
      onClick={onNavigate}
      fontSize="sm"
      fontFamily="heading"
      fontWeight="medium"
      color="slate.600"
      lineHeight="tall"
      transition="color 0.15s"
      _hover={{ color: "brand.500", textDecoration: "none" }}
    >
      {link.label}
    </SiteAnchor>
  );
}

function SignInLink({ display }: { display?: BoxProps["display"] }) {
  return (
    <Button
      as={NextLink}
      href={SiteChrome.signInHref()}
      variant="ghost"
      color="brand.600"
      size="sm"
      display={display}
      _hover={{ bg: "slate.100" }}
      {...SiteChrome.focusRing()}
    >
      Sign in
    </Button>
  );
}

function StartLink({ children }: { children: string }) {
  return (
    <Button
      as={NextLink}
      href={SiteChrome.startHref()}
      colorScheme="accent"
      size="sm"
      flexShrink={0}
      {...SiteChrome.focusRing()}
    >
      {children}
    </Button>
  );
}

function MarketingNav() {
  const reducedMotion = useReducedMotion();
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { pathname } = useRouter();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  return (
    <Box
      as={motion.nav}
      {...NavMotion.props(reducedMotion)}
      aria-label="Primary"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex="banner"
      bg="transparent"
      backdropFilter="blur(12px)"
    >
      <Container maxW="8xl" px={{ base: 4, md: 8 }}>
        <Flex align="center" justify="space-between" gap={3} py={3}>
          <LogoLockup />
          <DesktopLinks pathname={pathname} />
          <HStack spacing={3} flexShrink={0}>
            <IconButton
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls={SiteChrome.menuId}
              icon={<Icon as={isOpen ? X : Menu} boxSize={5} aria-hidden />}
              onClick={onToggle}
              variant="ghost"
              color="slate.600"
              display={{ base: "inline-flex", md: "none" }}
              h={8}
              w={8}
              minW={8}
              px={0}
              _hover={{ bg: "slate.100" }}
              {...SiteChrome.focusRing()}
            />
            <SignInLink display={{ base: "none", md: "inline-flex" }} />
            <StartLink>Start for Free</StartLink>
          </HStack>
        </Flex>
        <Box display={{ base: "block", md: "none" }}>
          <Collapse in={isOpen} animateOpacity>
            <Stack id={SiteChrome.menuId} spacing={1} pb={4} align="stretch">
              {SiteChrome.primaryLinks().map((link) => (
                <SiteAnchor
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onClick={onClose}
                  width="full"
                  py={2.5}
                  px={3}
                  borderRadius="lg"
                  fontSize="sm"
                  fontFamily="heading"
                  fontWeight="medium"
                  color="slate.600"
                  bg="transparent"
                  lineHeight="tall"
                  transition="all 0.15s"
                  _hover={{ color: "brand.500", bg: "slate.50", textDecoration: "none" }}
                >
                  {link.label}
                </SiteAnchor>
              ))}
              <SiteAnchor
                href={SiteChrome.signInHref()}
                onClick={onClose}
                width="full"
                py={2.5}
                px={3}
                borderRadius="lg"
                fontSize="sm"
                fontFamily="heading"
                fontWeight="medium"
                color="brand.600"
                lineHeight="tall"
                transition="all 0.15s"
                _hover={{ color: "brand.500", bg: "slate.50", textDecoration: "none" }}
              >
                Sign in
              </SiteAnchor>
            </Stack>
          </Collapse>
        </Box>
      </Container>
    </Box>
  );
}

function MinimalNav() {
  return (
    <Flex
      as="nav"
      aria-label="Primary"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex="banner"
      align="center"
      justify="space-between"
      gap={3}
      px={4}
      py={3}
      bg="whiteAlpha.800"
      backdropFilter="blur(16px)"
      borderBottom="1px solid"
      borderColor="border.default"
    >
      <LogoLockup />
      <HStack spacing={3} flexShrink={0}>
        <SignInLink />
        <StartLink>Get Started</StartLink>
      </HStack>
    </Flex>
  );
}

export function SiteNav({ variant = "marketing" }: SiteNavProps) {
  if (variant === "minimal") {
    return <MinimalNav />;
  }

  return <MarketingNav />;
}
