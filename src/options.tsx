import { useStorage } from "@plasmohq/storage/hook"

import { Switch } from "~components/Switch"
import { AppIcon } from "~core/assets"
import { FEATURE_ICONS } from "~core/featureIcons"
import {
  DEFAULT_SETTINGS,
  FEATURES_LIST,
  STORAGE_KEYS,
  type FeatureKey,
  type FeatureSettings
} from "~core/types"

import "~style.css"

function OptionsPage() {
  const [settings, setSettings] = useStorage<FeatureSettings>(
    STORAGE_KEYS.SETTINGS,
    DEFAULT_SETTINGS
  )

  const resolved = settings ?? DEFAULT_SETTINGS

  const handleToggle = (key: FeatureKey) => {
    setSettings((prev) => ({
      ...(prev ?? DEFAULT_SETTINGS),
      [key]: !resolved[key]
    }))
  }

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-8 select-none">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <AppIcon className="w-12 h-12 rounded-2xl object-contain shadow-xl shadow-indigo-500/20 ring-1 ring-white/20" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Browse Assist Settings
              </h1>
              <p className="text-sm text-slate-400 mt-0.5">
                Configure your browsing quality-of-life toolkit and shortcuts
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white border border-slate-700 rounded-xl transition-all shadow-sm">
            Reset to Defaults
          </button>
        </header>

        {/* Feature List */}
        <section className="mt-8 space-y-4">
          <h2 className="text-base font-semibold text-slate-200">
            Active Modules
          </h2>

          <div className="grid gap-3.5">
            {FEATURES_LIST.map((feature) => {
              const isEnabled = resolved[feature.key]
              const IconComp = FEATURE_ICONS[feature.key].icon
              const iconColor = FEATURE_ICONS[feature.key].colorClass
              return (
                <div
                  key={feature.key}
                  className={`p-5 rounded-2xl border transition-all ${
                    isEnabled
                      ? "bg-slate-900/90 border-slate-700/80 shadow-md"
                      : "bg-slate-900/40 border-slate-800/60 opacity-60"
                  }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 shadow-inner mt-0.5">
                        <IconComp className={`w-5 h-5 ${iconColor}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-white">
                            {feature.title}
                          </h3>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                              isEnabled
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800 text-slate-400 border-slate-700"
                            }`}>
                            {isEnabled ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mt-1 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    <Switch
                      checked={isEnabled}
                      onChange={() => handleToggle(feature.key)}
                      size="md"
                      aria-label={`Toggle ${feature.title}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Shortcuts Reference Table */}
        <section className="mt-10 p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
          <h2 className="text-base font-semibold text-slate-200 mb-4">
            Keyboard & Mouse Shortcuts Reference
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3">Action</th>
                  <th className="pb-3">Shortcut / Trigger</th>
                  <th className="pb-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-3 font-medium text-white">Zoom In / Out</td>
                  <td className="py-3">
                    <kbd className="px-2 py-1 text-xs font-mono font-semibold rounded bg-slate-800 border border-slate-700 text-indigo-300">
                      Alt + Mouse Wheel
                    </kbd>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">
                    Fluidly zoom page from 50% up to 300%
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">Reset Zoom</td>
                  <td className="py-3">
                    <kbd className="px-2 py-1 text-xs font-mono font-semibold rounded bg-slate-800 border border-slate-700 text-indigo-300">
                      Alt + 0
                    </kbd>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">
                    Immediately reset page zoom to 100%
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">
                    Copy Link Text
                  </td>
                  <td className="py-3">
                    <kbd className="px-2 py-1 text-xs font-mono font-semibold rounded bg-slate-800 border border-slate-700 text-indigo-300">
                      Right Click Link
                    </kbd>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">
                    Select &quot;Copy Link Text&quot; from the context menu
                  </td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">
                    Smooth Scrolling
                  </td>
                  <td className="py-3">
                    <kbd className="px-2 py-1 text-xs font-mono font-semibold rounded bg-slate-800 border border-slate-700 text-indigo-300">
                      Mouse Wheel
                    </kbd>
                  </td>
                  <td className="py-3 text-slate-400 text-xs">
                    Inertial physics interpolation across all scroll containers
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500">
          Browse Assist • Manifest V3 • Built with Plasmo, React & Tailwind CSS
        </footer>
      </div>
    </div>
  )
}

export default OptionsPage
