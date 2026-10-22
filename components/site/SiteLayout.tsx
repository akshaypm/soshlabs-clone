import { Box, Flex } from "@chakra-ui/react";
import type { NextPage } from "next";
import type { ReactElement, ReactNode } from "react";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNav } from "@/components/site/SiteNav";
import type { SiteChromeVariant } from "@/components/site/SiteChrome";

export type PageWithLayout<P = Record<string, never>> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type SiteLayoutProps = {
  variant?: SiteChromeVariant;
  children: ReactNode;
};

export function SiteLayout({ variant = "marketing", children }: SiteLayoutProps) {
  return (
    <Flex direction="column" minH="100vh" bg="bg.canvas" color="text.primary">
      <SiteNav variant={variant} />
      <Box as="main" flex="1" pt={20}>
        {children}
      </Box>
      {variant === "marketing" ? <SiteFooter /> : null}
    </Flex>
  );
}
