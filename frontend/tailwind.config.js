/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "surface-dim": "#dad9e1",
        "surface-container-low": "#f4f3fa",
        "on-secondary-fixed-variant": "#38485d",
        "on-primary-fixed": "#00164e",
        "surface": "#faf8ff",
        "on-primary-container": "#90a8ff",
        "on-primary": "#ffffff",
        "primary": "#00236f",
        "surface-container-lowest": "#ffffff",
        "tertiary-container": "#6e2c00",
        "error-container": "#ffdad6",
        "error": "#ba1a1a",
        "tertiary-fixed-dim": "#ffb691",
        "on-error": "#ffffff",
        "inverse-surface": "#2f3036",
        "outline-variant": "#c5c5d3",
        "primary-container": "#1e3a8a",
        "tertiary-fixed": "#ffdbcb",
        "secondary-container": "#d0e1fb",
        "on-error-container": "#93000a",
        "on-tertiary": "#ffffff",
        "secondary-fixed": "#d3e4fe",
        "surface-container-high": "#e9e7ef",
        "on-secondary-container": "#54647a",
        "surface-tint": "#4059aa",
        "primary-fixed": "#dce1ff",
        "on-tertiary-fixed": "#341100",
        "on-tertiary-container": "#f39461",
        "outline": "#757682",
        "on-background": "#1a1b21",
        "secondary-fixed-dim": "#b7c8e1",
        "on-secondary-fixed": "#0b1c30",
        "secondary": "#505f76",
        "tertiary": "#4b1c00",
        "primary-fixed-dim": "#b6c4ff",
        "surface-variant": "#e3e1e9",
        "on-tertiary-fixed-variant": "#773205",
        "surface-bright": "#faf8ff",
        "surface-container": "#eeedf4",
        "surface-container-highest": "#e3e1e9",
        "background": "#faf8ff",
        "on-primary-fixed-variant": "#264191",
        "inverse-on-surface": "#f1f0f7",
        "on-secondary": "#ffffff",
        "inverse-primary": "#b6c4ff",
        "on-surface": "#1a1b21",
        "on-surface-variant": "#444651"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        base: "4px",
        "container-max": "1200px",
        xl: "40px",
        gutter: "24px",
        "2xl": "64px",
        lg: "24px",
        xs: "4px",
        md: "16px",
        sm: "8px"
      },
      fontFamily: {
        "label-sm": ["Inter"],
        "body-md": ["Inter"],
        "display-lg": ["Inter"],
        "headline-md": ["Inter"],
        "display-lg-mobile": ["Inter"],
        "headline-md-mobile": ["Inter"],
        "title-lg": ["Inter"]
      },
      fontSize: {
        "label-sm": ["14px", { lineHeight: "1.2", letterSpacing: "0.01em", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        "display-lg": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-md": ["30px", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "600" }],
        "display-lg-mobile": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-md-mobile": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "title-lg": ["20px", { lineHeight: "1.4", fontWeight: "600" }]
      }
    }
  },
  plugins: []
}
