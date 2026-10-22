import { extendTheme, type StyleFunctionProps } from "@chakra-ui/react";

type ModeProps = { colorMode: string; colorScheme?: string };

/**
 * Chakra UI v2 theme. Color scales, semantic tokens, shadows, and component
 * variants follow the live soshlabs.ai bundle. Radii and breakpoints are the
 * Chakra defaults that bundle's CSS uses (it does not override them).
 */
export class SoshTheme {
  static readonly config = {
    initialColorMode: "light" as const,
    useSystemColorMode: false,
  };

  static readonly mustard = "#f79e1b";

  static pick<T>(props: ModeProps, light: T, dark: T): T {
    return props.colorMode === "dark" ? dark : light;
  }

  static scheme(props: ModeProps, lightShade: string, darkShade: string): string {
    const name = props.colorScheme || "brand";
    const shade = SoshTheme.pick(props, lightShade, darkShade);
    return `${name}.${shade}`;
  }

  static buttonSolidBrand(props: ModeProps) {
    return {
      bg: SoshTheme.pick(props, "brand.600", "brand.400"),
      color: "white",
      _hover: {
        bg: SoshTheme.pick(props, "brand.700", "brand.300"),
        transform: "translateY(-1px)",
        boxShadow: "soft-md",
      },
      _active: {
        bg: SoshTheme.pick(props, "brand.800", "brand.500"),
        transform: "translateY(0)",
      },
    };
  }

  static buttonSolidAccent(props: ModeProps) {
    return {
      bg: SoshTheme.pick(props, "accent.500", "accent.400"),
      color: "white",
      _hover: {
        bg: SoshTheme.pick(props, "accent.600", "accent.300"),
        transform: "translateY(-1px)",
        boxShadow: "soft-md",
      },
      _active: {
        bg: SoshTheme.pick(props, "accent.700", "accent.500"),
        transform: "translateY(0)",
      },
    };
  }

  static buttonSolidAmber(props: ModeProps) {
    return {
      bg: SoshTheme.mustard,
      color: "gray.900",
      _hover: {
        bg: SoshTheme.pick(props, "#e08c10", "#f9b44d"),
        transform: "translateY(-1px)",
        boxShadow: "soft-md",
      },
      _active: {
        bg: SoshTheme.pick(props, "#c97b0e", SoshTheme.mustard),
        transform: "translateY(0)",
      },
    };
  }

  static buttonSolid(props: StyleFunctionProps) {
    if (props.colorScheme === "brand") return SoshTheme.buttonSolidBrand(props);
    if (props.colorScheme === "accent") return SoshTheme.buttonSolidAccent(props);
    if (props.colorScheme === "amber") return SoshTheme.buttonSolidAmber(props);
    return {};
  }

  static buttonOutline(props: ModeProps) {
    return {
      borderWidth: "1.5px",
      borderColor: SoshTheme.pick(props, "brand.600", "brand.400"),
      color: SoshTheme.pick(props, "brand.700", "brand.300"),
      _hover: {
        bg: SoshTheme.pick(props, "brand.50", "brand.900"),
        transform: "translateY(-1px)",
      },
      _active: {
        bg: SoshTheme.pick(props, "brand.100", "brand.800"),
        transform: "translateY(0)",
      },
    };
  }

  static buttonGhost(props: ModeProps) {
    return {
      color: SoshTheme.pick(props, "slate.600", "slate.300"),
      _hover: { bg: SoshTheme.pick(props, "slate.100", "surface.700") },
      _active: { bg: SoshTheme.pick(props, "slate.200", "surface.600") },
    };
  }

  static buttonSubtle(props: ModeProps) {
    return {
      bg: SoshTheme.pick(props, "brand.50", "brand.900"),
      color: SoshTheme.pick(props, "brand.700", "brand.300"),
      _hover: {
        bg: SoshTheme.pick(props, "brand.100", "brand.800"),
        transform: "translateY(-1px)",
      },
      _active: {
        bg: SoshTheme.pick(props, "brand.200", "brand.700"),
        transform: "translateY(0)",
      },
    };
  }

  static cardBase(props: ModeProps) {
    return {
      container: {
        bg: SoshTheme.pick(props, "white", "surface.800"),
        borderRadius: "xl",
        border: "1px solid",
        borderColor: SoshTheme.pick(props, "slate.200", "surface.600"),
        boxShadow: SoshTheme.pick(props, "soft-sm", "dark-soft-sm"),
        transition: "all 0.2s ease",
        overflow: "hidden",
      },
    };
  }

  static cardElevated(props: ModeProps) {
    return {
      container: {
        boxShadow: SoshTheme.pick(props, "soft-md", "dark-soft-md"),
        _hover: {
          boxShadow: SoshTheme.pick(props, "card-hover", "dark-card-hover"),
          transform: "translateY(-2px)",
        },
      },
    };
  }

  static cardOutline(props: ModeProps) {
    return {
      container: {
        boxShadow: "none",
        borderColor: SoshTheme.pick(props, "slate.200", "surface.600"),
      },
    };
  }

  static cardFilled(props: ModeProps) {
    return {
      container: {
        bg: SoshTheme.pick(props, "slate.50", "surface.700"),
        borderColor: "transparent",
        boxShadow: "none",
      },
    };
  }

  static inputOutline(props: ModeProps) {
    return {
      field: {
        borderRadius: "lg",
        borderWidth: "1.5px",
        borderColor: SoshTheme.pick(props, "slate.200", "surface.600"),
        bg: SoshTheme.pick(props, "white", "surface.800"),
        _hover: { borderColor: SoshTheme.pick(props, "slate.300", "surface.500") },
        _focus: {
          borderColor: SoshTheme.pick(props, "brand.500", "brand.400"),
          boxShadow: "brand-glow",
        },
        _placeholder: { color: SoshTheme.pick(props, "slate.400", "slate.500") },
      },
    };
  }

  static inputFilled(props: ModeProps) {
    return {
      field: {
        borderRadius: "lg",
        bg: SoshTheme.pick(props, "slate.100", "surface.700"),
        borderWidth: "1.5px",
        borderColor: "transparent",
        _hover: { bg: SoshTheme.pick(props, "slate.200", "surface.600") },
        _focus: {
          bg: SoshTheme.pick(props, "white", "surface.800"),
          borderColor: SoshTheme.pick(props, "brand.500", "brand.400"),
          boxShadow: "brand-glow",
        },
      },
    };
  }

  static badgeSubtle(props: StyleFunctionProps) {
    return {
      bg: SoshTheme.scheme(props, "50", "900"),
      color: SoshTheme.scheme(props, "700", "300"),
    };
  }

  static badgeSolid(props: StyleFunctionProps) {
    return {
      bg: SoshTheme.scheme(props, "500", "400"),
      color: "white",
    };
  }

  static badgeOutline(props: StyleFunctionProps) {
    return {
      borderWidth: "1.5px",
      borderColor: SoshTheme.scheme(props, "500", "400"),
      color: SoshTheme.scheme(props, "600", "300"),
      bg: "transparent",
    };
  }

  static tagSubtle(props: StyleFunctionProps) {
    return {
      container: {
        bg: SoshTheme.scheme(props, "50", "900"),
        color: SoshTheme.scheme(props, "700", "300"),
      },
    };
  }

  static tagSolid(props: StyleFunctionProps) {
    return {
      container: {
        bg: SoshTheme.scheme(props, "500", "400"),
        color: "white",
      },
    };
  }

  static tagOutline(props: StyleFunctionProps) {
    return {
      container: {
        borderWidth: "1.5px",
        borderColor: SoshTheme.scheme(props, "500", "400"),
        color: SoshTheme.scheme(props, "600", "300"),
        bg: "transparent",
      },
    };
  }

  static global(props: ModeProps) {
    return {
      "html, body": {
        bg: SoshTheme.pick(props, "slate.50", "surface.900"),
        color: SoshTheme.pick(props, "slate.900", "slate.50"),
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      },
      "::selection": {
        bg: SoshTheme.pick(props, "brand.100", "brand.700"),
        color: SoshTheme.pick(props, "brand.900", "brand.100"),
      },
      "::-webkit-scrollbar": { width: "8px", height: "8px" },
      "::-webkit-scrollbar-track": {
        bg: SoshTheme.pick(props, "slate.100", "surface.800"),
      },
      "::-webkit-scrollbar-thumb": {
        bg: SoshTheme.pick(props, "slate.300", "surface.600"),
        borderRadius: "full",
        border: "2px solid transparent",
        backgroundClip: "content-box",
      },
      "::-webkit-scrollbar-thumb:hover": {
        bg: SoshTheme.pick(props, "slate.400", "surface.500"),
      },
    };
  }

  static create() {
    return extendTheme({
      config: SoshTheme.config,
      colors: {
        brand: {
          50: "#EFFCF9",
          100: "#C6F7EE",
          200: "#8EEFDD",
          300: "#56DFC6",
          400: "#2BBFA5",
          500: "#0D9B84",
          600: "#0A7D6B",
          700: "#076054",
          800: "#05453D",
          900: "#032B27",
        },
        accent: {
          50: "#FFF5F2",
          100: "#FFE0D6",
          200: "#FFC4AD",
          300: "#FFA384",
          400: "#FF7F5C",
          500: "#F05E3B",
          600: "#D44425",
          700: "#B03118",
          800: "#8C230F",
          900: "#6B1809",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        surface: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#1A2332",
          800: "#131C28",
          900: "#0C1220",
        },
        mustard: SoshTheme.mustard,
      },
      fonts: {
        heading:
          "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
        body: "'Source Serif 4 Variable', 'Source Serif 4', Georgia, 'Times New Roman', serif",
      },
      fontWeights: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      radii: {
        none: "0",
        sm: "0.125rem",
        base: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      breakpoints: {
        base: "0em",
        sm: "30em",
        md: "48em",
        lg: "62em",
        xl: "80em",
        "2xl": "96em",
      },
      shadows: {
        "soft-sm":
          "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.03)",
        "soft-md":
          "0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)",
        "soft-lg":
          "0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)",
        "soft-xl":
          "0 20px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)",
        "brand-glow": "0 0 0 3px rgba(13, 155, 132, 0.15)",
        "accent-glow": "0 0 0 3px rgba(240, 94, 59, 0.15)",
        "card-hover":
          "0 12px 24px -4px rgba(15, 23, 42, 0.1), 0 4px 8px -2px rgba(15, 23, 42, 0.05)",
        "dark-soft-sm":
          "0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px -1px rgba(0, 0, 0, 0.15)",
        "dark-soft-md":
          "0 4px 6px -1px rgba(0, 0, 0, 0.25), 0 2px 4px -2px rgba(0, 0, 0, 0.15)",
        "dark-card-hover":
          "0 12px 24px -4px rgba(0, 0, 0, 0.35), 0 4px 8px -2px rgba(0, 0, 0, 0.2)",
      },
      semanticTokens: {
        colors: {
          "bg.canvas": { default: "slate.50", _dark: "surface.900" },
          "bg.surface": { default: "white", _dark: "surface.800" },
          "bg.subtle": { default: "slate.100", _dark: "surface.700" },
          "bg.muted": { default: "slate.200", _dark: "surface.600" },
          "text.primary": { default: "slate.900", _dark: "slate.50" },
          "text.secondary": { default: "slate.600", _dark: "slate.300" },
          "text.muted": { default: "slate.400", _dark: "slate.500" },
          "text.inverse": { default: "white", _dark: "slate.900" },
          "brand.subtle": { default: "brand.50", _dark: "brand.900" },
          "brand.muted": { default: "brand.100", _dark: "brand.800" },
          "brand.emphasis": { default: "brand.500", _dark: "brand.400" },
          "brand.solid": { default: "brand.600", _dark: "brand.400" },
          "brand.text": { default: "brand.700", _dark: "brand.300" },
          "accent.subtle": { default: "accent.50", _dark: "accent.900" },
          "accent.emphasis": { default: "accent.500", _dark: "accent.400" },
          "accent.solid": { default: "accent.600", _dark: "accent.400" },
          "border.default": { default: "slate.200", _dark: "surface.600" },
          "border.muted": { default: "slate.100", _dark: "surface.700" },
          "border.emphasis": { default: "brand.500", _dark: "brand.400" },
        },
      },
      styles: {
        global: SoshTheme.global,
      },
      components: {
        Button: {
          baseStyle: {
            fontFamily: "heading",
            fontWeight: "semibold",
            borderRadius: "lg",
            transition: "all 0.2s ease",
          },
          defaultProps: { colorScheme: "brand" },
          variants: {
            solid: SoshTheme.buttonSolid,
            outline: SoshTheme.buttonOutline,
            ghost: SoshTheme.buttonGhost,
            subtle: SoshTheme.buttonSubtle,
          },
        },
        Card: {
          baseStyle: SoshTheme.cardBase,
          variants: {
            elevated: SoshTheme.cardElevated,
            outline: SoshTheme.cardOutline,
            filled: SoshTheme.cardFilled,
          },
        },
        Input: {
          baseStyle: { field: { fontFamily: "body" } },
          variants: {
            outline: SoshTheme.inputOutline,
            filled: SoshTheme.inputFilled,
          },
          defaultProps: { variant: "outline" },
        },
        Badge: {
          baseStyle: {
            fontFamily: "heading",
            fontWeight: "semibold",
            borderRadius: "full",
            textTransform: "none",
            letterSpacing: "0.01em",
          },
          variants: {
            subtle: SoshTheme.badgeSubtle,
            solid: SoshTheme.badgeSolid,
            outline: SoshTheme.badgeOutline,
          },
        },
        Tag: {
          baseStyle: {
            container: {
              fontFamily: "heading",
              fontWeight: "medium",
              borderRadius: "full",
            },
          },
          variants: {
            subtle: SoshTheme.tagSubtle,
            solid: SoshTheme.tagSolid,
            outline: SoshTheme.tagOutline,
          },
        },
        Heading: {
          baseStyle: { fontWeight: "bold", letterSpacing: "-0.02em" },
        },
        Text: {
          baseStyle: { lineHeight: "tall" },
        },
        Tooltip: {
          baseStyle: (props: ModeProps) => ({
            bg: SoshTheme.pick(props, "slate.800", "slate.200"),
            color: SoshTheme.pick(props, "white", "slate.900"),
            fontFamily: "heading",
            fontSize: "xs",
            fontWeight: "medium",
            px: 3,
            py: 1.5,
            borderRadius: "lg",
            boxShadow: "soft-lg",
          }),
        },
        Modal: {
          baseStyle: (props: ModeProps) => ({
            dialog: {
              bg: SoshTheme.pick(props, "white", "surface.800"),
              borderRadius: "xl",
              boxShadow: "soft-xl",
            },
            overlay: { bg: "blackAlpha.600", backdropFilter: "blur(8px)" },
          }),
        },
        Drawer: {
          baseStyle: (props: ModeProps) => ({
            dialog: { bg: SoshTheme.pick(props, "white", "surface.800") },
            overlay: { bg: "blackAlpha.600", backdropFilter: "blur(8px)" },
          }),
        },
        Menu: {
          baseStyle: (props: ModeProps) => ({
            list: {
              bg: SoshTheme.pick(props, "white", "surface.800"),
              border: "1px solid",
              borderColor: SoshTheme.pick(props, "slate.200", "surface.600"),
              borderRadius: "xl",
              // The live bundle references dark-soft-lg, which is not a defined shadow.
              boxShadow: SoshTheme.pick(props, "soft-lg", "dark-soft-lg"),
              py: 2,
            },
            item: {
              fontFamily: "heading",
              fontSize: "sm",
              bg: "transparent",
              _hover: { bg: SoshTheme.pick(props, "slate.50", "surface.700") },
              _focus: { bg: SoshTheme.pick(props, "slate.50", "surface.700") },
              borderRadius: "md",
              mx: 2,
              px: 3,
            },
          }),
        },
        Table: {
          variants: {
            simple: (props: ModeProps) => ({
              th: {
                fontFamily: "heading",
                fontWeight: "semibold",
                textTransform: "none",
                letterSpacing: "0.01em",
                fontSize: "xs",
                color: SoshTheme.pick(props, "slate.500", "slate.400"),
                borderColor: SoshTheme.pick(props, "slate.200", "surface.600"),
              },
              td: {
                borderColor: SoshTheme.pick(props, "slate.100", "surface.600"),
              },
            }),
          },
        },
        Tabs: {
          variants: {
            line: (props: ModeProps) => ({
              tab: {
                fontFamily: "heading",
                fontWeight: "semibold",
                color: SoshTheme.pick(props, "slate.500", "slate.400"),
                _selected: {
                  color: SoshTheme.pick(props, "brand.600", "brand.300"),
                  borderColor: SoshTheme.pick(props, "brand.600", "brand.400"),
                },
                _hover: { color: SoshTheme.pick(props, "slate.700", "slate.200") },
              },
              tablist: {
                borderColor: SoshTheme.pick(props, "slate.200", "surface.600"),
              },
            }),
          },
        },
      },
    });
  }
}

export const theme = SoshTheme.create();
