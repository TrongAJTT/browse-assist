import { Globe, PauseCircle, PlayCircle, SlidersHorizontal } from "lucide-react"
import type React from "react"

import { useI18n } from "~core/useI18n"

interface CurrentSiteBarProps {
  hostname: string
  isFullyPaused: boolean
  blockedCount: number
  onTogglePause: () => void
  onOpenRules: () => void
}

/**
 * Compact active-site control strip at the top of Popup main view.
 * Lets users pause/resume all features on the current domain in 1 click.
 */
export const CurrentSiteBar: React.FC<CurrentSiteBarProps> = ({
  hostname,
  isFullyPaused,
  blockedCount,
  onTogglePause,
  onOpenRules
}) => {
  const { t } = useI18n()

  return (
    <div
      className={`mb-2 px-2.5 py-1.5 rounded-xl border transition-colors flex items-center justify-between gap-2 ${
        isFullyPaused
          ? "bg-rose-500/10 border-rose-500/30"
          : blockedCount > 0
            ? "bg-amber-500/10 border-amber-500/30"
            : "bg-app-surface border-border-subtle"
      }`}>
      <button
        type="button"
        onClick={onOpenRules}
        title={t("siteRules.openRulesTip")}
        className="flex items-center gap-2 min-w-0 flex-1 text-left group focus:outline-none">
        <Globe
          className={`w-3.5 h-3.5 shrink-0 ${
            isFullyPaused
              ? "text-rose-400"
              : blockedCount > 0
                ? "text-amber-400"
                : "text-emerald-400"
          }`}
        />
        <span className="text-xs font-semibold text-content-primary truncate group-hover:text-accent transition-colors">
          {hostname}
        </span>

        {isFullyPaused ? (
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/20 text-rose-400 shrink-0">
            {t("siteRules.statusPaused")}
          </span>
        ) : blockedCount > 0 ? (
          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/20 text-amber-400 shrink-0">
            {t("siteRules.statusExcludedCount", { count: String(blockedCount) })}
          </span>
        ) : null}
      </button>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onTogglePause}
          title={
            isFullyPaused
              ? t("siteRules.resumeSiteTip", { host: hostname })
              : t("siteRules.pauseSiteTip", { host: hostname })
          }
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all active:scale-95 focus:outline-none ${
            isFullyPaused
              ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30"
              : "bg-app-elevated text-content-secondary hover:text-rose-400 hover:bg-rose-500/10 border border-border-subtle"
          }`}>
          {isFullyPaused ? (
            <>
              <PlayCircle className="w-3 h-3" />
              <span>{t("siteRules.resume")}</span>
            </>
          ) : (
            <>
              <PauseCircle className="w-3 h-3" />
              <span>{t("siteRules.pause")}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onOpenRules}
          title={t("siteRules.openRulesTip")}
          className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-app-elevated border border-transparent hover:border-border-subtle transition-all active:scale-95 focus:outline-none">
          <SlidersHorizontal className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
