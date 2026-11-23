import {
  Check,
  ChevronDown,
  Globe,
  Pencil,
  Plus,
  Shield,
  ShieldOff,
  Trash2,
  X
} from "lucide-react"
import type React from "react"
import { useEffect, useMemo, useRef, useState } from "react"

import { isColorPickerSupported } from "~core/browserDetect"
import {
  FEATURE_CATALOG_LIST,
  getLocalizedFeatureMeta
} from "~core/featureCatalog"
import {
  extractHostname,
  getUrlExclusionSummary,
  matchesSitePattern,
  normalizeSitePattern,
  toggleFeatureOnSiteRule,
  togglePauseSiteRule,
  validateSitePattern
} from "~core/siteRules"
import type { FeatureKey, SiteRule, SiteRuleScope } from "~core/types"
import { useI18n } from "~core/useI18n"

import { Switch } from "./Switch"

interface SiteRulesManagerProps {
  variant: "popup" | "options"
  rules: SiteRule[]
  onChangeRules: (updater: (prev: SiteRule[]) => SiteRule[]) => void
  currentUrl?: string | null
}

/**
 * Shared responsive Per-Site Rules manager used by both Popup and Options page.
 */
export const SiteRulesManager: React.FC<SiteRulesManagerProps> = ({
  variant,
  rules,
  onChangeRules,
  currentUrl
}) => {
  const { t } = useI18n()
  const isOptions = variant === "options"

  const currentHostname = useMemo(
    () => (currentUrl ? extractHostname(currentUrl) : null),
    [currentUrl]
  )

  const currentSummary = useMemo(() => {
    if (!currentUrl) {
      return { isFullyPaused: false, blockedFeatures: new Set<FeatureKey>() }
    }
    return getUrlExclusionSummary(currentUrl, rules)
  }, [currentUrl, rules])

  const ruleConfigurableFeatures = useMemo(
    () =>
      FEATURE_CATALOG_LIST.filter(
        (f) =>
          f.key !== "allowRightClick" &&
          (f.key !== "colorPicker" || isColorPickerSupported)
      ),
    []
  )

  // Current-site per-feature drawer state (collapsed by default to keep popup compact)
  const [isQuickExcludeOpen, setIsQuickExcludeOpen] = useState(false)

  // Rule modal (shared for Add & Edit) and form state
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false)
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)
  const [patternInput, setPatternInput] = useState("")
  const [scopeMode, setScopeMode] = useState<"all" | "selected">("all")
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureKey[]>([
    "superDrag"
  ])
  const [formError, setFormError] = useState<string | null>(null)
  const modalInputRef = useRef<HTMLInputElement | null>(null)

  const isCurrentHostnameInRules = useMemo(
    () =>
      Boolean(
        currentHostname &&
          rules.some(
            (r) => normalizeSitePattern(r.pattern) === currentHostname
          )
      ),
    [currentHostname, rules]
  )

  const openAddModal = () => {
    const initialPattern =
      currentHostname && !isCurrentHostnameInRules ? currentHostname : ""
    setEditingRuleId(null)
    setPatternInput(initialPattern)
    setScopeMode("all")
    setSelectedFeatures(["superDrag"])
    setFormError(null)
    setIsRuleModalOpen(true)
  }

  const openEditModal = (rule: SiteRule) => {
    setEditingRuleId(rule.id)
    setPatternInput(rule.pattern)
    if (rule.scope === "all") {
      setScopeMode("all")
      setSelectedFeatures(["superDrag"])
    } else {
      setScopeMode("selected")
      setSelectedFeatures([...rule.scope])
    }
    setFormError(null)
    setIsRuleModalOpen(true)
  }

  const closeRuleModal = () => {
    setIsRuleModalOpen(false)
    setEditingRuleId(null)
    setFormError(null)
  }

  useEffect(() => {
    if (!isRuleModalOpen) return
    const timer = window.setTimeout(() => {
      const input = modalInputRef.current
      if (!input) return
      input.focus()
      if (input.value.length > 0) {
        input.select()
      }
    }, 20)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        e.stopPropagation()
        closeRuleModal()
      } else if (e.code === "Backquote" || e.key === "`") {
        e.stopPropagation()
      }
    }
    window.addEventListener("keydown", handleKeyDown, true)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [isRuleModalOpen])

  const toggleFeatureInList = (
    list: FeatureKey[],
    key: FeatureKey
  ): FeatureKey[] => {
    return list.includes(key) ? list.filter((k) => k !== key) : [...list, key]
  }

  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = normalizeSitePattern(patternInput)
    if (!validateSitePattern(normalized)) {
      setFormError(t("siteRules.invalidPattern"))
      return
    }
    if (scopeMode === "selected" && selectedFeatures.length === 0) {
      setFormError(t("siteRules.selectAtLeastOne"))
      return
    }

    const nextScope: SiteRuleScope =
      scopeMode === "all" ? "all" : [...selectedFeatures]

    if (editingRuleId) {
      onChangeRules((prev) =>
        prev.map((r) =>
          r.id === editingRuleId
            ? { ...r, pattern: normalized, scope: nextScope }
            : r
        )
      )
    } else {
      const newRule: SiteRule = {
        id:
          typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `rule_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        pattern: normalized,
        enabled: true,
        scope: nextScope
      }
      onChangeRules((prev) => [newRule, ...prev])
    }

    closeRuleModal()
  }

  const renderScopeSummary = (scope: SiteRuleScope) => {
    if (scope === "all") {
      return (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25">
          <ShieldOff className="w-2.5 h-2.5" />
          {t("siteRules.scopeAll")}
        </span>
      )
    }

    const titles = scope.map((key) => getLocalizedFeatureMeta(key, t).title)
    const maxVisible = isOptions ? 4 : 2
    const visibleTitles = titles.slice(0, maxVisible)
    const overflowCount = titles.length - visibleTitles.length
    const fullTitleTooltip = overflowCount > 0 ? titles.join(", ") : undefined

    return (
      <div
        className="flex items-center gap-1 flex-wrap"
        title={fullTitleTooltip}>
        {visibleTitles.map((title, idx) => (
          <span
            key={scope[idx]}
            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-app-elevated text-content-secondary border border-border-subtle truncate max-w-[130px]">
            {title}
          </span>
        ))}
        {overflowCount > 0 && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-app-elevated text-content-muted border border-border-subtle">
            +{overflowCount}
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={isOptions ? "space-y-4" : "space-y-3"}>
      {/* 1. Current Site Quick Controls (Popup when on http/https tab) */}
      {currentHostname && (
        <div className="rounded-xl bg-app-surface border border-border-subtle overflow-hidden">
          <div className="px-3 py-2 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setIsQuickExcludeOpen((prev) => !prev)}
              className="flex items-center gap-2 min-w-0 flex-1 text-left group focus:outline-none">
              <Globe className="w-4 h-4 text-accent shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-content-primary truncate group-hover:text-accent transition-colors">
                    {currentHostname}
                  </span>
                  {currentSummary.blockedFeatures.size > 0 &&
                    !currentSummary.isFullyPaused && (
                      <span className="badge-warning shrink-0">
                        {t("siteRules.statusExcludedCount", {
                          count: currentSummary.blockedFeatures.size
                        })}
                      </span>
                    )}
                </div>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-content-muted shrink-0 transition-transform duration-150 ${
                  isQuickExcludeOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div className="flex items-center gap-1.5 pl-2 border-l border-border-divider shrink-0">
              <span className="text-[10px] font-medium text-content-muted">
                {t("siteRules.pauseAllOnSite")}
              </span>
              <Switch
                checked={currentSummary.isFullyPaused}
                size="sm"
                onChange={() =>
                  onChangeRules((prev) =>
                    togglePauseSiteRule(prev, currentHostname)
                  )
                }
                ariaLabel={t("siteRules.pauseAllOnSite")}
              />
            </div>
          </div>

          {isQuickExcludeOpen && (
            <div className="px-3 pb-2.5 pt-2 border-t border-border-divider space-y-1.5">
              <p className="text-[10px] text-content-muted">
                {t("siteRules.quickExcludeDesc")}
              </p>
              <div className="grid grid-cols-2 gap-1">
                {ruleConfigurableFeatures.map((raw) => {
                  const meta = getLocalizedFeatureMeta(raw.key, t)
                  const isBlocked =
                    currentSummary.isFullyPaused ||
                    currentSummary.blockedFeatures.has(raw.key)
                  const IconComp = raw.icon
                  return (
                    <button
                      key={raw.key}
                      type="button"
                      disabled={currentSummary.isFullyPaused}
                      onClick={() =>
                        onChangeRules((prev) =>
                          toggleFeatureOnSiteRule(prev, currentHostname, raw.key)
                        )
                      }
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10.5px] font-medium border transition-all disabled:opacity-50 min-w-0 ${
                        isBlocked
                          ? "bg-rose-500/15 border-rose-500/35 text-rose-400 line-through"
                          : "bg-app-elevated border-border-subtle text-content-secondary hover:text-content-primary hover:border-accent/40"
                      }`}>
                      <IconComp className="w-3 h-3 shrink-0" />
                      <span className="truncate">{meta.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Saved Rules List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="section-header">
              {t("siteRules.savedRulesTitle")}
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-app-surface text-content-muted border border-border-subtle">
              {rules.length}
            </span>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg bg-accent hover:opacity-90 active:scale-95 text-white text-[11px] font-semibold transition-all shadow-sm">
            <Plus className="w-3.5 h-3.5" />
            <span>{t("siteRules.addRuleTitle")}</span>
          </button>
        </div>

        {rules.length === 0 ? (
          <div className="p-5 rounded-xl bg-app-surface/60 border border-dashed border-border-subtle text-center space-y-1.5">
            <Shield className="w-5 h-5 text-content-faint mx-auto" />
            <p className="text-xs font-medium text-content-secondary">
              {t("siteRules.emptyTitle")}
            </p>
            <p className="text-[11px] text-content-muted max-w-md mx-auto">
              {t("siteRules.emptyDesc")}
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-app-surface border border-border-subtle divide-y divide-border-divider overflow-hidden">
            {rules.map((rule) => {
              const isMatchingCurrent = Boolean(
                currentUrl &&
                  rule.enabled &&
                  matchesSitePattern(currentUrl, rule.pattern)
              )

              return (
                <div
                  key={rule.id}
                  className={`px-3 py-2 transition-colors ${
                    rule.enabled
                      ? "hover:bg-app-surface-hover/40"
                      : "opacity-60 bg-app-surface/40"
                  }`}>
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-xs font-mono font-semibold text-content-primary truncate">
                          {rule.pattern}
                        </span>
                        {isMatchingCurrent && (
                          <span className="badge-accent shrink-0">
                            {t("siteRules.matchesThisTab")}
                          </span>
                        )}
                      </div>
                      {renderScopeSummary(rule.scope)}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => openEditModal(rule)}
                        title={t("siteRules.editTip")}
                        className="p-1 rounded-md text-content-muted hover:text-content-primary hover:bg-app-elevated transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onChangeRules((prev) =>
                            prev.filter((r) => r.id !== rule.id)
                          )
                        }
                        title={t("siteRules.deleteTip")}
                        className="p-1 rounded-md text-content-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Switch
                        checked={rule.enabled}
                        size="sm"
                        onChange={(enabled) =>
                          onChangeRules((prev) =>
                            prev.map((r) =>
                              r.id === rule.id ? { ...r, enabled } : r
                            )
                          )
                        }
                        ariaLabel={rule.pattern}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Rule Modal */}
      {isRuleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={closeRuleModal}>
          <form
            onSubmit={handleSaveRule}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-app-elevated border border-border-subtle shadow-2xl p-4 sm:p-5 space-y-3.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-border-divider">
              <div>
                <h3 className="text-sm font-bold text-content-primary">
                  {editingRuleId
                    ? t("siteRules.editTip")
                    : t("siteRules.addRuleTitle")}
                </h3>
                <p className="text-[11px] text-content-muted mt-0.5">
                  {t("siteRules.wildcardHint")}
                </p>
              </div>
              <button
                type="button"
                onClick={closeRuleModal}
                title={t("common.cancel")}
                className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-app-surface transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              ref={modalInputRef}
              type="text"
              value={patternInput}
              onChange={(e) => {
                setPatternInput(e.target.value)
                if (formError) setFormError(null)
              }}
              placeholder={t("siteRules.patternPlaceholder")}
              className="w-full h-9 px-3 text-xs font-mono rounded-lg bg-app-surface border border-border-subtle text-content-primary placeholder:text-content-faint focus:outline-none focus:border-accent/60 transition-colors"
            />

            <div className="space-y-2">
              <div className="inline-flex rounded-lg bg-app-surface p-0.5 border border-border-subtle">
                <button
                  type="button"
                  onClick={() => setScopeMode("all")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    scopeMode === "all"
                      ? "bg-accent text-white shadow-sm"
                      : "text-content-muted hover:text-content-primary"
                  }`}>
                  {t("siteRules.scopeAll")}
                </button>
                <button
                  type="button"
                  onClick={() => setScopeMode("selected")}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    scopeMode === "selected"
                      ? "bg-accent text-white shadow-sm"
                      : "text-content-muted hover:text-content-primary"
                  }`}>
                  {t("siteRules.scopeSelected")}
                </button>
              </div>

              <div
                className={`grid gap-1.5 ${
                  isOptions ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
                }`}>
                {ruleConfigurableFeatures.map((raw) => {
                  const meta = getLocalizedFeatureMeta(raw.key, t)
                  const isAllMode = scopeMode === "all"
                  const isExcluded =
                    isAllMode || selectedFeatures.includes(raw.key)
                  const IconComp = raw.icon
                  return (
                    <button
                      key={raw.key}
                      type="button"
                      disabled={isAllMode}
                      onClick={() =>
                        setSelectedFeatures((prev) =>
                          toggleFeatureInList(prev, raw.key)
                        )
                      }
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium border text-left transition-all ${
                        isAllMode
                          ? "bg-rose-500/15 border-rose-500/35 text-rose-400 line-through opacity-70 cursor-not-allowed"
                          : isExcluded
                            ? "bg-rose-500/15 border-rose-500/35 text-rose-400 line-through"
                            : "bg-app-surface border-border-subtle text-content-secondary hover:text-content-primary hover:border-accent/40"
                      }`}>
                      <IconComp className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{meta.title}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {formError && (
              <p className="text-[11px] text-rose-400 font-medium">
                {formError}
              </p>
            )}

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-divider">
              <div className="min-w-0 flex-1">
                {!editingRuleId && currentHostname && (
                  <span
                    className="inline-flex max-w-full"
                    title={
                      isCurrentHostnameInRules
                        ? t("siteRules.alreadyInList")
                        : t("siteRules.useCurrentDomainTip", {
                            host: currentHostname
                          })
                    }>
                    <button
                      type="button"
                      disabled={
                        isCurrentHostnameInRules ||
                        normalizeSitePattern(patternInput) === currentHostname
                      }
                      onClick={() => {
                        setPatternInput(currentHostname)
                        if (formError) setFormError(null)
                        modalInputRef.current?.focus()
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-app-surface border border-border-subtle text-content-secondary hover:text-accent hover:border-accent/40 transition-colors disabled:opacity-45 disabled:cursor-not-allowed max-w-full min-w-0">
                      <Globe className="w-3 h-3 shrink-0 text-accent" />
                      <span className="truncate">
                        {t("siteRules.useCurrentDomain", {
                          host: currentHostname
                        })}
                      </span>
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={closeRuleModal}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-app-surface text-content-secondary hover:text-content-primary border border-border-subtle transition-colors">
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-accent hover:opacity-90 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm">
                  {editingRuleId ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t("siteRules.save")}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t("siteRules.addButton")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
