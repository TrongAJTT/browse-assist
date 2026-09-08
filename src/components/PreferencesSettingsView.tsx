import { Laptop, Moon, Palette, Sun } from "lucide-react"
import type React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { GridPicker, type GridPickerItem } from "~components/GridPicker"
import { SubSettingsLayout } from "~components/SubSettingsLayout"
import {
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
  type FeatureSettings,
  type ThemeMode
} from "~core/types"

interface PreferencesSettingsViewProps {
  onBack: () => void
}

const THEME_OPTIONS: GridPickerItem<ThemeMode>[] = [
  {
    id: "dark",
    label: "Dark",
    icon: <Moon className="w-3.5 h-3.5" />
  },
  {
    id: "light",
    label: "Light",
    icon: <Sun className="w-3.5 h-3.5" />
  },
  {
    id: "system",
    label: "System",
    icon: <Laptop className="w-3.5 h-3.5" />
  }
]

/**
 * Preferences / General Settings view.
 * Configures appearance theme mode and other global preferences.
 */
export const PreferencesSettingsView: React.FC<
  PreferencesSettingsViewProps
> = ({ onBack }) => {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const currentTheme = settings?.theme ?? DEFAULT_SETTINGS.theme

  const handleSelectTheme = (theme: ThemeMode) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      theme
    }))
  }

  return (
    <SubSettingsLayout title="Preferences" onBack={onBack}>
      <div className="space-y-4">
        {/* Appearance Section */}
        <div className="space-y-2.5">
          <span className="section-header">Appearance</span>

          <div className="space-y-2.5">
            <div>
              <div className="flex items-center gap-1.5">
                <Palette className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold text-content-primary">
                  Theme Mode
                </span>
              </div>
              <p className="text-[11px] text-content-muted mt-0.5 leading-snug">
                Choose light, dark, or automatically synchronize with your
                operating system display settings.
              </p>
            </div>

            <GridPicker<ThemeMode>
              items={THEME_OPTIONS}
              value={currentTheme}
              onChange={handleSelectTheme}
              columns={3}
            />
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
