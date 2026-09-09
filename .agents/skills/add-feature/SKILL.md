---
name: add-feature
description: >-
  Standard workflow for adding a new feature to the Browse Assist extension,
  including creating feature folders, declaring types, implementing content/background logic, building toggle UI, and registering with orchestrators.
---

# Guide to Adding a New Feature

Every feature in Browse Assist follows a **Feature-First** architecture: completely decoupled, modular, and dynamically toggleable at runtime.

## Workflow Steps

### Step 1: Declare Key and Types
Open `src/core/types.ts`:
1. Add the new feature key to the `FeatureKey` union:
   ```ts
   export type FeatureKey =
     | "allowRightClick"
     | "contextMenuActions"
     | "superDrag"
     | "yourNewFeature"; // <--- Add here
   ```
2. Update `DEFAULT_SETTINGS` with the default state (`true` or `false`) and any sub-configuration interfaces.
3. Declare metadata (display title, icon, description, category, default hotkey) in `FEATURE_METADATA`.

### Step 2: Create Feature Directory
Create directory `src/features/<feature-name>/`:

#### Case A: Web Page / DOM Intervention (`logic.ts`)
Create `src/features/<feature-name>/logic.ts`:
```ts
let isActive = false;

function handleEvent(e: Event) {
  // Event handling logic
}

export function activate(): void {
  if (isActive) return;
  isActive = true;
  window.addEventListener("event", handleEvent, { capture: true });
}

export function deactivate(): void {
  if (!isActive) return;
  isActive = false;
  window.removeEventListener("event", handleEvent, { capture: true });
}
```
*Note: Always remove all event listeners and injected elements in `deactivate()`.*

#### Case B: Service Worker Operations (`background.ts`)
Create `src/features/<feature-name>/background.ts`:
```ts
export function initBackground(): void {
  // Register context menus, alarms, or chrome.* listeners
}
```

### Step 3: Create Toggle Component for Popup
Create `src/features/<feature-name>/Toggle.tsx`:
- Use `useStorage` from `@plasmohq/storage/hook` to bind settings.
- Utilize shared components from `src/components/` (`Card`, `Switch`, `Slider`, `Kbd`).

### Step 4: Register into Orchestrators

1. **Content Script (`src/content.ts`)**:
   - Import `activate` and `deactivate`.
   - Register in the feature dispatch table:
     ```ts
     const featureHandlers: Record<FeatureKey, { activate: () => void; deactivate: () => void }> = {
       // ... existing features
       yourNewFeature: { activate, deactivate }
     };
     ```

2. **Background (`src/background.ts`)** *(if applicable)*:
   - Import and invoke `initBackground()` during extension initialization.

3. **Popup (`src/popup.tsx`)**:
   - Render `<YourFeatureToggle />` in the appropriate category panel.

### Step 5: Verification
Apply verification rules based on change scope (refer to `AGENTS.md`):
- Small change / UI-only: Proceed directly.
- Under 1,000 lines: Run `pnpm lint` and `pnpm typecheck`.
- 1,000+ lines: Run `pnpm lint`, `pnpm typecheck`, and `pnpm build`.
