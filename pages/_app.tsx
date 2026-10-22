import type { AppProps } from "next/app";
import type { ReactElement } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/source-serif-4";
import type { PageWithLayout } from "@/components/site/SiteLayout";
import { theme } from "@/theme";

type AppPropsWithLayout = AppProps & {
  Component: PageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return <ChakraProvider theme={theme}>{getLayout(<Component {...pageProps} />)}</ChakraProvider>;
}
