---
name: ui-components
description: Design, implementation, and reuse guidelines for Browse Assist Popup UI components following Design Tokens and PowerToys aesthetic.
---

# UI Components & Design System Runbook

The Browse Assist popup interface follows the **PowerToys for Web Browsing** aesthetic: clean, refined, compact, and supporting seamless switching between Dark and Light themes.

---

## 1. Design Tokens & Color System

**Never hardcode hex colors** (`#1e293b`, `#fff`, `text-gray-400`...) in component markup. Always use the semantic Tailwind utility classes mapped to CSS custom properties defined in `src/style.css` and `tailwind.config.js`.

### Standard Color Tokens:

| Purpose | Tailwind Class | Meaning (Dark / Light) |
| :--- | :--- | :--- |
| **App Root Background** | `bg-app` | Slate-900 / Slate-50 |
| **Card / Tile Background** | `bg-app-surface` | Slate-800/40 / Slate-100/80 |
| **Card Hover Background** | `bg-app-surface-hover` | Slate-800/70 / Slate-200/90 |
| **Elevated Surface (Kbd, Menu)** | `bg-app-elevated` | Slate-800 / White |
| **Primary Text (Headings)** | `text-content-primary` | Slate-50 / Slate-900 |
| **Secondary Text (Feature Titles)**| `text-content-secondary`| Slate-300 / Slate-700 |
| **Muted Text (Descriptions)** | `text-content-muted` | Slate-400 / Slate-500 |
| **Faint Text (Icons, Hints)** | `text-content-faint` | Slate-500 / Slate-400 |
| **Subtle Border** | `border-subtle` | Slate-700/50 / Slate-300 |
| **Divider Border** | `border-divider` | Slate-800/80 / Slate-200 |
| **Accent Primary** | `bg-accent`, `text-accent` | Indigo-500 / Indigo-600 |
| **Accent Subtle & Glow** | `bg-accent-subtle`, `shadow-accent-glow` | Soft translucent indigo |

---

## 2. Shared Component Library (`src/components/`)

Before implementing custom UI controls, always check and reuse existing components:

1. **`Switch` (`src/components/Switch.tsx`)**:
   - Smooth toggle switch for enabling/disabling features.
   - Props: `checked: boolean`, `onChange: (checked: boolean) => void`, `disabled?: boolean`.

2. **`Card` (`src/components/Card.tsx`)**:
   - Standard container for feature controls, supporting header, description, badges, switches, and expandable config panels.

3. **`Kbd` (`src/components/Kbd.tsx`)**:
   - Keyboard keycap styling (`Alt`, `Shift`, `P`). Automatically adjusts across elevated backgrounds.

4. **`Slider` (`src/components/Slider.tsx`)**:
   - Slider control with real-time value readout, units, min/max, and step increments.

5. **`SegmentedControl` (`src/components/SegmentedControl.tsx`)**:
   - Pill-based segmented button for multi-choice settings (e.g. Presets: `Balanced`, `Ultra`, `Snappy`).

6. **`GridPicker` (`src/components/GridPicker.tsx`)**:
   - Interactive matrix selector for activating edge zones (e.g. Quick Scroll trigger locations).

7. **`Badge` (`src/components/Badge.tsx`)**:
   - Status badge indicator (`HOTKEY`, `BETA`, `EXPERIMENTAL`).

---

## 3. Rules for Creating New Components

When introducing a new component under `src/components/`:
1. **TypeScript Interface**: Declare explicit Props interfaces with descriptive JSDoc comments.
2. **Accessibility & Interactivity**:
   - Use meaningful `aria-label` or semantic HTML tags.
   - Always include smooth transitions (`transition-all duration-150`).
3. **Popup Frame Constraints**:
   - Popup width is fixed (360px - 400px), with a max height of 600px.
   - Avoid oversized UI elements that introduce unnecessary horizontal scrolling or excessive vertical spacing.
