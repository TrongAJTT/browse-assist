import { ExternalLink, ShieldCheck } from "lucide-react"
import type React from "react"

import { SubSettingsLayout } from "~components/SubSettingsLayout"
import { AppIcon } from "~core/assets"
import { APP_INFO } from "~core/constants"

interface AboutViewProps {
  onBack: () => void
}

export const AboutView: React.FC<AboutViewProps> = ({ onBack }) => {
  return (
    <SubSettingsLayout title="About" onBack={onBack}>
      <div className="flex flex-col space-y-4 text-slate-300">
        {/* Header summary */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/60">
          <AppIcon className="w-10 h-10 rounded-xl object-contain shadow-md shadow-indigo-500/10 ring-1 ring-white/10 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">
                {APP_INFO.name}
              </h2>
              <span className="px-1.5 py-0.2 text-[10px] font-mono font-semibold rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                v{APP_INFO.version}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">
              {APP_INFO.description}
            </p>
          </div>
        </div>

        {/* Project Links */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Project & Author
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <a
              href={APP_INFO.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all text-slate-200 hover:text-white">
              <span className="font-medium">Source Code</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
            <a
              href={APP_INFO.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all text-slate-200 hover:text-white">
              <span className="font-medium">@{APP_INFO.author}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Core Libraries */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Open Source Libraries
          </span>
          <div className="space-y-1 rounded-xl bg-slate-800/30 border border-slate-700/50 p-2 text-xs divide-y divide-slate-800/60">
            {APP_INFO.libraries.map((lib) => (
              <a
                key={lib.name}
                href={lib.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-1.5 px-1 hover:text-indigo-300 transition-colors group">
                <span className="text-slate-300 group-hover:text-indigo-200 font-medium">
                  {lib.name}
                </span>
                <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[10.5px]">
                  <span>v{lib.version}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Privacy pledge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-400 text-xs">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="leading-tight">
            100% Offline & Private. No analytics, tracking or external data
            transmission.
          </span>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
