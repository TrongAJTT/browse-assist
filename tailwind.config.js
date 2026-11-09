/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./src/**/*.{ts,tsx,html,css}"
  ],
  theme: {
    extend: {
      colors: {
        app: {
          DEFAULT: "var(--bg-app)",
          header: "var(--bg-header)",
          surface: "var(--bg-surface)",
          "surface-hover": "var(--bg-surface-hover)",
          elevated: "var(--bg-elevated)",
          glass: "var(--bg-glass)"
        },
        border: {
          subtle: "var(--border-subtle)",
          divider: "var(--border-divider)",
          focus: "var(--border-focus)"
        },
        content: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          faint: "var(--text-faint)"
        },
        accent: {
          DEFAULT: "var(--accent-primary)",
          hover: "var(--accent-hover)",
          subtle: "var(--accent-subtle)",
          glow: "var(--accent-glow)"
        }
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif"
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          '"Courier New"',
          "monospace"
        ]
      }
    }
  },
  plugins: []
};
