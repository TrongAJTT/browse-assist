import { ExternalLink } from "lucide-react"
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
      <div className="flex flex-col space-y-4 text-content-secondary">
        {/* Header summary */}
        <div className="flex items-center gap-3">
          <AppIcon className="w-12 h-12 rounded-xl object-contain shadow-md shadow-accent-glow ring-1 ring-white/10 shrink-0" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-content-primary tracking-tight">
                {APP_INFO.name}
              </h2>
              <span className="badge-kbd">v{APP_INFO.version}</span>
            </div>
            <p className="text-xs text-content-muted mt-0.5 leading-snug">
              {APP_INFO.description}
            </p>
          </div>
        </div>

        {/* Project Links */}
        <div className="space-y-1.5">
          <span className="section-header">Project & Legal</span>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <a
              href={APP_INFO.homePageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-app-surface hover:bg-app-card border border-border-subtle hover:border-accent/40 transition-all text-content-primary group">
              <span className="font-medium truncate">Home page</span>
              <ExternalLink className="w-3 h-3 text-content-muted group-hover:text-accent shrink-0 ml-1" />
            </a>
            <a
              href={APP_INFO.termsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-app-surface hover:bg-app-card border border-border-subtle hover:border-accent/40 transition-all text-content-primary group">
              <span className="font-medium truncate">Terms</span>
              <ExternalLink className="w-3 h-3 text-content-muted group-hover:text-accent shrink-0 ml-1" />
            </a>
            <a
              href={APP_INFO.privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-app-surface hover:bg-app-card border border-border-subtle hover:border-accent/40 transition-all text-content-primary group">
              <span className="font-medium truncate">Policy</span>
              <ExternalLink className="w-3 h-3 text-content-muted group-hover:text-accent shrink-0 ml-1" />
            </a>
          </div>
        </div>

        {/* Core Libraries */}
        <div className="space-y-2">
          <span className="section-header">Open Source Libraries</span>
          <div className="space-y-1 rounded-lg bg-app-surface border border-border-subtle p-2 text-xs divide-y divide-border-divider">
            {APP_INFO.libraries.map((lib) => (
              <a
                key={lib.name}
                href={lib.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-1.5 px-1 hover:text-accent transition-colors group">
                <span className="text-content-secondary group-hover:text-accent font-medium">
                  {lib.name}
                </span>
                <div className="flex items-center gap-3 text-content-muted font-mono text-[11px]">
                  <span>v{lib.version}</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Declared Permissions & Privacy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="section-header">Declared Permissions</span>
          </div>

          <div className="space-y-1.5 rounded-lg bg-app-surface border border-border-subtle p-2 text-xs divide-y divide-border-divider">
            {APP_INFO.permissions.map((perm) => (
              <div
                key={perm.key}
                className="pt-1.5 first:pt-0 pb-0.5 flex flex-col gap-0.5">
                <div className="flex items-center justify-left gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-content-primary">
                      {perm.name}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-app-card border border-border-subtle text-content-muted">
                    {perm.key}
                  </span>
                </div>
                <p className="text-[11px] text-content-muted leading-relaxed pl-4.5">
                  {perm.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SubSettingsLayout>
  )
}
