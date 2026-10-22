import { Text, VisuallyHidden } from "@chakra-ui/react";
import { SiteAnchor } from "@/components/site/SiteAnchor";

type PressLogoProps = {
  name: string;
  href?: string;
};

/**
 * Placeholder for a press logo in the As Seen On row. Renders the publication
 * name until a licensed asset is passed in. Swap the graphic here later.
 */
export function PressLogo({ name, href }: PressLogoProps) {
  const label = (
    <Text
      as="span"
      fontFamily="heading"
      fontSize="sm"
      fontWeight="semibold"
      letterSpacing="0.01em"
      color="slate.600"
      lineHeight="tall"
    >
      {name}
    </Text>
  );

  if (!href) {
    return label;
  }

  return (
    <SiteAnchor
      href={href}
      display="inline-flex"
      alignItems="center"
      minH="40px"
      transition="color 0.2s ease, transform 0.2s ease"
      _hover={{ color: "brand.500", textDecoration: "none", transform: "translateY(-2px)" }}
    >
      {label}
      <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
    </SiteAnchor>
  );
}
