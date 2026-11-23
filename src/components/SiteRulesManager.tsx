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

  // Add-rule modal & form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [patternInput, setPatternInput] = useState("")
  const [scopeMode, setScopeMode] = useState<"all" | "selected">("all")
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureKey[]>([
    "superDrag"
  ])
  const [formError, setFormError] = useState<string | null>(null)
  const addInputRef = useRef<HTMLInputElement | null>(null)

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
    setPatternInput(initialPattern)
    setScopeMode("all")
    setSelectedFeatures(["superDrag"])
    setFormError(null)
    setIsAddModalOpen(true)
  }

  const closeAddModal = () => {
    setIsAddModalOpen(false)
    setFormError(null)
  }

  useEffect(() => {
    if (!isAddModalOpen) return
    const timer = window.setTimeout(() => {
      const input = addInputRef.current
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
        closeAddModal()
      } else if (e.code === "Backquote" || e.key === "`") {
        e.stopPropagation()
      }
    }
    window.addEventListener("keydown", handleKeyDown, true)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("keydown", handleKeyDown, true)
    }
  }, [isAddModalOpen])

  // Inline edit state
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null)
  const [editPattern, setEditPattern] = useState("")
  const [editScopeMode, setEditScopeMode] = useState<"all" | "selected">("all")
  const [editFeatures, setEditFeatures] = useState<FeatureKey[]>([])
  const [editError, setEditError] = useState<string | null>(null)

  const toggleFeatureInList = (
    list: FeatureKey[],
    key: FeatureKey
  ): FeatureKey[] => {
    return list.includes(key) ? list.filter((k) => k !== key) : [...list, key]
  }

  const handleAddRule = (e: React.FormEvent) => {
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
    setPatternInput("")
    setFormError(null)
    setIsAddModalOpen(false)
  }

  const startEditing = (rule: SiteRule) => {
    setEditingRuleId(rule.id)
    setEditPattern(rule.pattern)
    if (rule.scope === "all") {
      setEditScopeMode("all")
      setEditFeatures(["superDrag"])
    } else {
      setEditScopeMode("selected")
      setEditFeatures([...rule.scope])
    }
    setEditError(null)
  }

  const saveEditing = (ruleId: string) => {
    const normalized = normalizeSitePattern(editPattern)
    if (!validateSitePattern(normalized)) {
      setEditError(t("siteRules.invalidPattern"))
      return
    }
    if (editScopeMode === "selected" && editFeatures.length === 0) {
      setEditError(t("siteRules.selectAtLeastOne"))
      return
    }

    const nextScope: SiteRuleScope =
      editScopeMode === "all" ? "all" : [...editFeatures]

    onChangeRules((prev) =>
      prev.map((r) =>
        r.id === ruleId ? { ...r, pattern: normalized, scope: nextScope } : r
      )
    )
    setEditingRuleId(null)
    setEditError(null)
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
              const isEditing = editingRuleId === rule.id

              return (
                <div
                  key={rule.id}
                  className={`px-3 py-2 transition-colors ${
                    rule.enabled
                      ? "hover:bg-app-surface-hover/40"
                      : "opacity-60 bg-app-surface/40"
                  }`}>
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={editPattern}
                          onChange={(e) => {
                            setEditPattern(e.target.value)
                            if (editError) setEditError(null)
                          }}
                          className="flex-1 h-8 px-2.5 text-xs font-mono rounded-lg bg-app-elevated border border-border-subtle text-content-primary focus:outline-none focus:border-accent/60"
                        />
                        <div className="inline-flex rounded-lg bg-app-elevated p-0.5 border border-border-subtle self-start">
                          <button
                            type="button"
                            onClick={() => setEditScopeMode("all")}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                              editScopeMode === "all"
                                ? "bg-accent text-white"
                                : "text-content-muted"
                            }`}>
                            {t("siteRules.scopeAll")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditScopeMode("selected")}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium ${
                              editScopeMode === "selected"
                                ? "bg-accent text-white"
                                : "text-content-muted"
                            }`}>
                            {t("siteRules.scopeSelected")}
                          </button>
                        </div>
                      </div>

                      {editScopeMode === "selected" && (
                        <div
                          className={`grid gap-1.5 ${
                            isOptions
                              ? "grid-cols-2 sm:grid-cols-3"
                              : "grid-cols-2"
                          }`}>
                          {ruleConfigurableFeatures.map((raw) => {
                            const meta = getLocalizedFeatureMeta(raw.key, t)
                            const active = editFeatures.includes(raw.key)
                            return (
                              <button
                                key={raw.key}
                                type="button"
                                onClick={() =>
                                  setEditFeatures((prev) =>
                                    toggleFeatureInList(prev, raw.key)
                                  )
                                }
                                className={`px-2 py-1 rounded-lg text-[11px] font-medium border text-left truncate ${
                                  active
                                    ? "bg-accent-subtle border-accent/40 text-accent"
                                    : "bg-app-elevated border-border-subtle text-content-secondary"
                                }`}>
                                {meta.title}
                              </button>
                            )
                          })}
                        </div>
                      )}

                      {editError && (
                        <p className="text-[11px] text-rose-400 font-medium">
                          {editError}
                        </p>
                      )}

                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingRuleId(null)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-app-elevated text-content-secondary hover:text-content-primary border border-border-subtle">
                          <X className="w-3 h-3" />
                          <span>{t("common.cancel")}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEditing(rule.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-accent text-white hover:opacity-90">
                          <Check className="w-3 h-3" />
                          <span>{t("siteRules.save")}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
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
                          onClick={() => startEditing(rule)}
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
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add Rule Modal */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={closeAddModal}>
          <form
            onSubmit={handleAddRule}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-app-elevated border border-border-subtle shadow-2xl p-4 sm:p-5 space-y-3.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-border-divider">
              <div>
                <h3 className="text-sm font-bold text-content-primary">
                  {t("siteRules.addRuleTitle")}
                </h3>
                <p className="text-[11px] text-content-muted mt-0.5">
                  {t("siteRules.wildcardHint")}
                </p>
              </div>
              <button
                type="button"
                onClick={closeAddModal}
                title={t("common.cancel")}
                className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-app-surface transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <input
                ref={addInputRef}
                type="text"
                value={patternInput}
                onChange={(e) => {
                  setPatternInput(e.target.value)
                  if (formError) setFormError(null)
                }}
                placeholder={t("siteRules.patternPlaceholder")}
                className="w-full h-9 px-3 text-xs font-mono rounded-lg bg-app-surface border border-border-subtle text-content-primary placeholder:text-content-faint focus:outline-none focus:border-accent/60 transition-colors"
              />

              {currentHostname && (
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    disabled={
                      isCurrentHostnameInRules ||
                      normalizeSitePattern(patternInput) === currentHostname
                    }
                    onClick={() => {
                      setPatternInput(currentHostname)
                      if (formError) setFormError(null)
                      addInputRef.current?.focus()
                    }}
                    title={
                      isCurrentHostnameInRules
                        ? t("siteRules.alreadyInList")
                        : t("siteRules.useCurrentDomainTip", {
                            host: currentHostname
                          })
                    }
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-app-surface border border-border-subtle text-content-secondary hover:text-accent hover:border-accent/40 transition-colors disabled:opacity-45 disabled:pointer-events-none max-w-full">
                    <Globe className="w-3 h-3 shrink-0 text-accent" />
                    <span className="truncate">
                      {t("siteRules.useCurrentDomain", {
                        host: currentHostname
                      })}
                    </span>
                  </button>

                  {isCurrentHostnameInRules && (
                    <span className="text-[10px] text-content-muted shrink-0">
                      {t("siteRules.alreadyInList")}
                    </span>
                  )}
                </div>
              )}
            </div>

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

              {scopeMode === "selected" && (
                <div
                  className={`grid gap-1.5 ${
                    isOptions ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
                  }`}>
                  {ruleConfigurableFeatures.map((raw) => {
                    const meta = getLocalizedFeatureMeta(raw.key, t)
                    const active = selectedFeatures.includes(raw.key)
                    const IconComp = raw.icon
                    return (
                      <button
                        key={raw.key}
                        type="button"
                        onClick={() =>
                          setSelectedFeatures((prev) =>
                            toggleFeatureInList(prev, raw.key)
                          )
                        }
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium border text-left transition-all ${
                          active
                            ? "bg-accent-subtle border-accent/40 text-accent"
                            : "bg-app-surface border-border-subtle text-content-secondary hover:text-content-primary"
                        }`}>
                        <IconComp className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{meta.title}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {formError && (
              <p className="text-[11px] text-rose-400 font-medium">
                {formError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border-divider">
              <button
                type="button"
                onClick={closeAddModal}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-app-surface text-content-secondary hover:text-content-primary border border-border-subtle transition-colors">
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-accent hover:opacity-90 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                <span>{t("siteRules.addButton")}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
