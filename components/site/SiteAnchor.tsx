import type { LinkProps } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { SiteChrome } from "@/components/site/SiteChrome";

type SiteAnchorProps = LinkProps & {
  href: string;
};

/** App routes use Next.js Link. Mailto, hash, and external URLs stay real anchors. */
export function SiteAnchor({ href, children, ...props }: SiteAnchorProps) {
  const focus = SiteChrome.focusRing();

  if (SiteChrome.isAppRoute(href)) {
    return (
      <Link as={NextLink} href={href} {...focus} {...props}>
        {children}
      </Link>
    );
  }

  const opensNewTab = href.startsWith("http");

  return (
    <Link
      href={href}
      {...focus}
      {...(opensNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {children}
    </Link>
  );
}
