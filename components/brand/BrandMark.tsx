import { Box } from "@chakra-ui/react";

/**
 * Neutral stand-in for the Sosh mark. Replace the graphic in this component
 * when logo rights are confirmed. Do not hotlink the live asset.
 */
export function BrandMark() {
  return (
    <Box
      as="svg"
      boxSize={4}
      viewBox="0 0 16 16"
      aria-hidden="true"
      flexShrink={0}
      display="block"
    >
      <circle cx="8" cy="8" r="5.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </Box>
  );
}
