import {
  Check,
  Globe,
  Pencil,
  Plus,
  Shield,
  ShieldOff,
  Trash2,
  X
} from "lucide-react"
import type React from "react"
import { useMemo, useState } from "react"

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

  // Add-rule form state
  const [patternInput, setPatternInput] = useState("")
  const [scopeMode, setScopeMode] = useState<"all" | "selected">("all")
  const [selectedFeatures, setSelectedFeatures] = useState<FeatureKey[]>([
    "superDrag"
  ])
  const [formError, setFormError] = useState<string | null>(null)

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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25">
          <ShieldOff className="w-2.5 h-2.5" />
          {t("siteRules.scopeAll")}
        </span>
      )
    }

    return (
      <div className="flex flex-wrap gap-1">
        {scope.map((key) => {
          const meta = getLocalizedFeatureMeta(key, t)
          return (
            <span
              key={key}
              className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-app-elevated text-content-secondary border border-border-subtle">
              {meta.title}
            </span>
          )
        })}
      </div>
    )
  }

  return (
    <div className={isOptions ? "space-y-5" : "space-y-4"}>
      {/* 1. Current Site Quick Controls (Popup when on http/https tab) */}
      {currentHostname && (
        <div className="p-3 rounded-xl bg-app-surface border border-border-subtle space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Globe className="w-4 h-4 text-accent shrink-0" />
              <div className="min-w-0">
                <div className="text-[11px] text-content-muted leading-none">
                  {t("siteRules.currentSite")}
                </div>
                <div className="text-xs font-bold text-content-primary truncate mt-1">
                  {currentHostname}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-medium text-content-secondary">
                {t("siteRules.pauseAllOnSite")}
              </span>
              <Switch
                checked={currentSummary.isFullyPaused}
                onChange={() =>
                  onChangeRules((prev) =>
                    togglePauseSiteRule(prev, currentHostname)
                  )
                }
                ariaLabel={t("siteRules.pauseAllOnSite")}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-border-divider space-y-2">
            <p className="text-[11px] text-content-muted">
              {t("siteRules.quickExcludeDesc")}
            </p>
            <div className="flex flex-wrap gap-1.5">
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
                    className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all disabled:opacity-50 ${
                      isBlocked
                        ? "bg-rose-500/15 border-rose-500/35 text-rose-400 line-through"
                        : "bg-app-elevated border-border-subtle text-content-secondary hover:text-content-primary hover:border-accent/40"
                    }`}>
                    <IconComp className="w-3 h-3 shrink-0" />
                    <span>{meta.title}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Add Custom Rule Form */}
      <form
        onSubmit={handleAddRule}
        className="p-3.5 rounded-xl bg-app-surface border border-border-subtle space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="section-header">{t("siteRules.addRuleTitle")}</span>
          <span className="text-[10px] text-content-muted">
            {t("siteRules.wildcardHint")}
          </span>
        </div>

        <div
          className={`flex gap-2 ${
            isOptions ? "flex-col sm:flex-row sm:items-center" : "flex-col"
          }`}>
          <input
            type="text"
            value={patternInput}
            onChange={(e) => {
              setPatternInput(e.target.value)
              if (formError) setFormError(null)
            }}
            placeholder={t("siteRules.patternPlaceholder")}
            className="flex-1 h-8 px-2.5 text-xs font-mono rounded-lg bg-app-elevated border border-border-subtle text-content-primary placeholder:text-content-faint focus:outline-none focus:border-accent/60 transition-colors"
          />

          <div className="flex items-center gap-2 shrink-0">
            <div className="inline-flex rounded-lg bg-app-elevated p-0.5 border border-border-subtle">
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

            <button
              type="submit"
              className="inline-flex items-center gap-1 h-8 px-3 rounded-lg bg-accent hover:opacity-90 active:scale-95 text-white text-xs font-semibold transition-all shadow-sm">
              <Plus className="w-3.5 h-3.5" />
              <span>{t("siteRules.addButton")}</span>
            </button>
          </div>
        </div>

        {scopeMode === "selected" && (
          <div
            className={`grid gap-1.5 pt-1 ${
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
                      : "bg-app-elevated border-border-subtle text-content-secondary hover:text-content-primary"
                  }`}>
                  <IconComp className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{meta.title}</span>
                </button>
              )
            })}
          </div>
        )}

        {formError && (
          <p className="text-[11px] text-rose-400 font-medium">{formError}</p>
        )}
      </form>

      {/* 3. Saved Rules List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="section-header">
              {t("siteRules.savedRulesTitle")}
            </span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-app-surface text-content-muted border border-border-subtle">
              {rules.length}
            </span>
          </div>
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
          <div className="space-y-2">
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
                  className={`p-3 rounded-xl border transition-colors ${
                    rule.enabled
                      ? "bg-app-surface border-border-subtle"
                      : "bg-app-surface/50 border-border-divider opacity-70"
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
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-semibold text-content-primary break-all">
                            {rule.pattern}
                          </span>
                          {isMatchingCurrent && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-accent-subtle text-accent border border-accent/30">
                              {t("siteRules.matchesThisTab")}
                            </span>
                          )}
                        </div>
                        {renderScopeSummary(rule.scope)}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditing(rule)}
                          title={t("siteRules.editTip")}
                          className="p-1.5 rounded-lg text-content-muted hover:text-content-primary hover:bg-app-elevated transition-colors">
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
                          className="p-1.5 rounded-lg text-content-muted hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <Switch
                          checked={rule.enabled}
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
    </div>
  )
}
