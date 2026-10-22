import { Box, Heading, Text } from "@chakra-ui/react";
import type { GetStaticProps } from "next";
import Head from "next/head";
import type { ReactElement } from "react";
import { SiteLayout, type PageWithLayout } from "@/components/site/SiteLayout";

const title = "Sosh AI: Social Media Marketing for Busy Founders";
const description =
  "Sosh AI is a done-for-you social media marketing partner for founders and small businesses. It plans your strategy, writes a full month of posts in your voice, and publishes across 14 platforms. You run it all by chat.";

const HomePage: PageWithLayout = () => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Box px={{ base: 4, md: 8 }} pb={{ base: 16, md: 24 }}>
        <Heading as="h1" size="xl">
          Sosh AI
        </Heading>
        <Text mt={4} maxW="3xl" color="text.secondary">
          Scaffold placeholder. Marketing pages land in later pull requests.
        </Text>
      </Box>
    </>
  );
};

HomePage.getLayout = (page: ReactElement) => <SiteLayout>{page}</SiteLayout>;

export const getStaticProps: GetStaticProps = () => {
  return { props: {} };
};

export default HomePage;
