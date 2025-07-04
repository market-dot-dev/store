import containerQueriesPlugin from "@tailwindcss/container-queries";
import formsPlugin from "@tailwindcss/forms";
import typographyPlugin from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animatePlugin from "tailwindcss-animate";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}" // @NOTE: Required as site-templates are in lib folder
  ],
  theme: {
    extend: {
      colors: {
        stone: {
          "150": "#F3F2F2",
          "250": "#E3E0DF",
          "500": "#746D69"
        },
        swamp: {
          "50": "#CDCEB6",
          "100": "#C5C5AA",
          "200": "#B4B592",
          "300": "#A4A47A",
          "400": "#929263",
          "500": "#70704D",
          "600": "#4F4F36",
          "700": "#2E2D1F",
          "800": "#0C0C08",
          DEFAULT: "#929263"
        },
        marketing: {
          primary: "#222214",
          secondary: "#8C8C88",
          background: "#F5F5F4",
          accent: {
            DEFAULT: "#E8E8E4",
            active: "#E0E0DB"
          },
          camo: {
            DEFAULT: "#C2CBA8",
            accent: "#878E6B"
          },
          swamp: {
            "10": "rgba(239, 239, 236, 1)",
            DEFAULT: "rgba(143, 143, 112, 1)",
            "10%": "rgba(143, 143, 112, 0.1)"
          },
          green: {
            "10": "rgba(233, 234, 229, 1)",
            DEFAULT: "rgba(125, 136, 97, 1)",
            "10%": "rgba(125, 136, 97, 0.1)"
          },
          purple: {
            "10": "#E8E8EB",
            DEFAULT: "rgba(118, 120, 158, 1)",
            "10%": "rgba(118, 120, 158, 0.1)"
          },
          orange: {
            "10": "rgba(238, 234, 225, 1)",
            DEFAULT: "rgba(178, 134, 52, 1)",
            "10%": "rgba(178, 134, 52, 0.1)"
          }
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      height: {
        "4.5": "18px"
      },
      width: {
        "4.5": "18px"
      },
      boxShadow: {
        "border-sm": "0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgb(0 0 0 / 0.06)",
        border:
          "0 0 0 1px rgba(0, 0, 0, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        "border-md":
          "0 0 0 1px rgba(0, 0, 0, 0.06), 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        "border-lg":
          "0 0 0 1px rgba(0, 0, 0, 0.06), 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        "border-xl":
          "0 0 0 1px rgba(0, 0, 0, 0.06), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        "border-b": "0 1px 0 0 rgba(0, 0, 0, 0.1)"
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      fontSize: {
        xxs: [
          "11px",
          {
            lineHeight: "12px"
          }
        ],
        "marketing-xs": [
          "12px",
          {
            lineHeight: "16px",
            letterSpacing: "-0.02em"
          }
        ],
        "marketing-sm": [
          "16px",
          {
            lineHeight: "24px",
            letterSpacing: "-0.02em"
          }
        ],
        "marketing-base": [
          "20px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.025em"
          }
        ],
        "marketing-md": [
          "24px",
          {
            lineHeight: "28px",
            letterSpacing: "-0.025em"
          }
        ],
        "marketing-lg": [
          "30px",
          {
            lineHeight: "32px",
            letterSpacing: "-0.025em"
          }
        ],
        "marketing-xl": [
          "37px",
          {
            lineHeight: "40px",
            letterSpacing: "-0.035em"
          }
        ],
        "marketing-2xl": [
          "46px",
          {
            lineHeight: "48px",
            letterSpacing: "-0.035em"
          }
        ],
        "marketing-3xl": [
          "58px",
          {
            lineHeight: "52px",
            letterSpacing: "-0.035em"
          }
        ],
        "marketing-4xl": [
          "72px",
          {
            lineHeight: "64px",
            letterSpacing: "-0.045em"
          }
        ],
        "marketing-5xl": [
          "91px",
          {
            lineHeight: "72px",
            letterSpacing: "-0.045em"
          }
        ]
      },
      tracking: {
        tightish: "-0.0125em"
      },
      fontFamily: {
        sans: [...fontFamily.sans],
        mono: ["Consolas", ...fontFamily.mono] // @TODO: Check if "Consolas" is actually a default font
      },
      typography: {
        DEFAULT: {
          css: {
            "blockquote p:first-of-type::before": {
              content: "none"
            },
            "blockquote p:first-of-type::after": {
              content: "none"
            }
          }
        }
      },
      animation: {
        scroll: "scroll 40s linear infinite"
      },
      screens: {
        xxs: "375px",
        xs: "410px"
      },
      containers: {
        "3xl": "60rem"
      },
      letterSpacing: {
        tightish: "-0.0125em"
      }
    }
  },
  // @NOTE: 20-04-2025: Commenting this out for now, as unsure what it will affect.
  // safelist: [
  //   {
  //     pattern:
  //       /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  //     variants: ["hover", "ui-selected"]
  //   },
  //   {
  //     pattern:
  //       /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  //     variants: ["hover", "ui-selected"]
  //   },
  //   {
  //     pattern:
  //       /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
  //     variants: ["hover", "ui-selected"]
  //   },
  //   {
  //     pattern:
  //       /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
  //   },
  //   {
  //     pattern:
  //       /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
  //   },
  //   {
  //     pattern:
  //       /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/
  //   }
  // ],
  plugins: [typographyPlugin, formsPlugin, animatePlugin, containerQueriesPlugin],
  corePlugins: {
    boxShadowColor: false
  }
} satisfies Config;
