export type SiteChromeVariant = "marketing" | "minimal";

export type SiteLinkItem = {
  label: string;
  href: string;
};

export type PressMention = {
  label: string;
  href?: string;
};

/**
 * Shared marketing chrome: routes, copy, and focus treatment.
 * Link lists live here so nav and footer stay in step.
 */
export class SiteChrome {
  static readonly menuId = "site-nav-menu";
  static readonly cookieSettingsId = "cookie-settings";
  static readonly email = "bonjour@soshlabs.ai";
  static readonly location = "Vancouver, BC, Canada";
  static readonly tagline = "World\u2019s simplest social media workflow.";
  static readonly copyright =
    "\u00A9 2026 Sosh AI. All rights reserved. Built in Vancouver, Canada.";
  static readonly asSeenOnLabel = "As Seen On";

  static signInHref(): string {
    return "/sign-in";
  }

  static startHref(): string {
    return "/start";
  }

  static cookieSettingsHref(): string {
    return `#${SiteChrome.cookieSettingsId}`;
  }

  static homeLabel(): string {
    return "Sosh AI";
  }

  static primaryLinks(): SiteLinkItem[] {
    return [
      { label: "Is It For Me?", href: "/is-it-for-you" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Pricing", href: "/pricing" },
    ];
  }

  static productLinks(): SiteLinkItem[] {
    return [
      ...SiteChrome.primaryLinks(),
      { label: "Compare", href: "/compare" },
      { label: "Getting Started", href: "/docs/getting-started" },
    ];
  }

  static companyLinks(): SiteLinkItem[] {
    return [
      { label: "About", href: "/about" },
      { label: "Contact", href: `mailto:${SiteChrome.email}` },
    ];
  }

  static legalLinks(): SiteLinkItem[] {
    return [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Data Processing Agreement", href: "/dpa" },
      { label: "Cookie Settings", href: SiteChrome.cookieSettingsHref() },
    ];
  }

  static linkColumns(): { title: string; links: SiteLinkItem[] }[] {
    return [
      { title: "Product", links: SiteChrome.productLinks() },
      { title: "Company", links: SiteChrome.companyLinks() },
      { title: "Legal", links: SiteChrome.legalLinks() },
    ];
  }

  static pressMentions(): PressMention[] {
    return [
      { label: "MSN" },
      { label: "New Ventures BC" },
      {
        label: "Web Summit Vancouver",
        href: "https://vancouver.websummit.com/summaries/van26/the-future-of-ai-and-machine-learning-2/",
      },
    ];
  }

  static isAppRoute(href: string): boolean {
    return href.startsWith("/") && !href.startsWith("//");
  }

  static focusRing() {
    return {
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "brand.emphasis",
        outlineOffset: "2px",
        boxShadow: "brand-glow",
      },
    } as const;
  }
}
