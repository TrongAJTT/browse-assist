/**
 * Image Hover Preview - Content Script Logic
 * Displays a floating Shadow DOM preview card when hovering over thumbnails or image links.
 */

import {
  DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG,
  type ImageHoverPreviewConfig
} from "~core/types"

let isActive = false
let currentConfig: ImageHoverPreviewConfig = {
  ...DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG
}

let hostElement: HTMLDivElement | null = null
let shadowRoot: ShadowRoot | null = null
let cardElement: HTMLDivElement | null = null
let previewImg: HTMLImageElement | null = null
let dimensionsBadge: HTMLDivElement | null = null

let hoverTimer: number | null = null
let activeTarget: HTMLElement | null = null
let lastPointerTarget: EventTarget | null = null
let lastPointerX = 0
let lastPointerY = 0

const IMAGE_EXT_REGEX =
  /\.(png|jpe?g|webp|gif|avif|svg|bmp|ico)(\?.*)?(#.*)?$/i

function isModifierSatisfied(e: MouseEvent | KeyboardEvent): boolean {
  switch (currentConfig.triggerModifier) {
    case "alt":
      return e.altKey
    case "ctrl":
      return e.ctrlKey
    case "shift":
    default:
      return e.shiftKey
  }
}

function isImageUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith("data:image/")) return true
  try {
    const parsed = new URL(url, window.location.href)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false
    }
    return IMAGE_EXT_REGEX.test(parsed.pathname)
  } catch {
    return false
  }
}

function resolvePreviewTarget(target: EventTarget | null): {
  element: HTMLElement
  src: string
} | null {
  if (!(target instanceof HTMLElement)) return null
  if (target.closest("[data-browse-assist-internal]")) return null

  const img =
    target instanceof HTMLImageElement ? target : target.closest("img")
  if (img) {
    const src = img.currentSrc || img.src
    if (!src) return null
    const rect = img.getBoundingClientRect()
    // Skip tiny icons/trackers
    if (rect.width < 24 || rect.height < 24) return null
    return { element: img, src }
  }

  if (currentConfig.previewImageLinks) {
    const anchor = target.closest("a")
    if (anchor && anchor.href && isImageUrl(anchor.href)) {
      return { element: anchor, src: anchor.href }
    }
  }

  return null
}

function ensureShadowDOM(): void {
  if (hostElement && document.documentElement.contains(hostElement)) return

  hostElement = document.createElement("div")
  hostElement.id = "browse-assist-image-preview-host"
  hostElement.setAttribute("data-browse-assist-internal", "true")
  hostElement.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 2147483646;
  `
  document.documentElement.appendChild(hostElement)

  shadowRoot = hostElement.attachShadow({ mode: "closed" })

  const style = document.createElement("style")
  style.textContent = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    @keyframes ihp-zoom-in {
      from {
        opacity: 0;
        transform: scale(0.93);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes ihp-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes ihp-slide-in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .ihp-card {
      position: fixed;
      display: none;
      flex-direction: column;
      border-radius: 12px;
      overflow: hidden;
      background: rgba(15, 23, 42, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.18);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      pointer-events: none;
    }
    .ihp-card.ihp-visible {
      display: flex;
    }
    .ihp-card.ihp-visible[data-animation="zoom"] {
      animation: ihp-zoom-in 0.16s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .ihp-card.ihp-visible[data-animation="fade"] {
      animation: ihp-fade-in 0.14s ease-out both;
    }
    .ihp-card.ihp-visible[data-animation="slide"] {
      animation: ihp-slide-in 0.16s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    .ihp-card.ihp-visible[data-animation="none"] {
      animation: none;
    }
    @media (prefers-reduced-motion: reduce) {
      .ihp-card.ihp-visible {
        animation: none !important;
      }
    }
    .ihp-img {
      display: block;
      object-fit: contain;
      background: rgba(0, 0, 0, 0.25);
    }
    .ihp-badge {
      position: absolute;
      bottom: 8px;
      right: 8px;
      padding: 2px 7px;
      border-radius: 6px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #f8fafc;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px;
      font-weight: 600;
    }
  `

  cardElement = document.createElement("div")
  cardElement.className = "ihp-card"

  previewImg = document.createElement("img")
  previewImg.className = "ihp-img"
  previewImg.alt = ""

  dimensionsBadge = document.createElement("div")
  dimensionsBadge.className = "ihp-badge"

  cardElement.appendChild(previewImg)
  cardElement.appendChild(dimensionsBadge)

  shadowRoot.appendChild(style)
  shadowRoot.appendChild(cardElement)
}

function positionCard(naturalWidth: number, naturalHeight: number): void {
  if (!cardElement || !previewImg) return

  const maxPercent = Math.max(30, Math.min(90, currentConfig.maxSizePercent || 65)) / 100
  const maxW = Math.floor(window.innerWidth * maxPercent)
  const maxH = Math.floor(window.innerHeight * maxPercent)

  const scale = Math.min(1, maxW / naturalWidth, maxH / naturalHeight)
  const displayW = Math.max(80, Math.round(naturalWidth * scale))
  const displayH = Math.max(80, Math.round(naturalHeight * scale))

  previewImg.style.width = `${displayW}px`
  previewImg.style.height = `${displayH}px`

  const gap = 16
  let left = lastPointerX + gap
  if (left + displayW + 12 > window.innerWidth) {
    left = Math.max(12, lastPointerX - displayW - gap)
  }

  let top = lastPointerY - displayH / 2
  top = Math.max(12, Math.min(window.innerHeight - displayH - 12, top))

  cardElement.style.left = `${left}px`
  cardElement.style.top = `${top}px`
}

export function hidePreview(): void {
  if (hoverTimer !== null) {
    window.clearTimeout(hoverTimer)
    hoverTimer = null
  }
  activeTarget = null
  if (cardElement) {
    cardElement.classList.remove("ihp-visible")
  }
  if (previewImg) {
    previewImg.onload = null
    previewImg.onerror = null
    previewImg.removeAttribute("src")
  }
}

function showPreviewFor(src: string, targetEl: HTMLElement): void {
  if (!isActive) return
  ensureShadowDOM()
  if (!cardElement || !previewImg || !dimensionsBadge) return

  const currentImg = previewImg
  const currentCard = cardElement
  const currentBadge = dimensionsBadge

  currentImg.onload = () => {
    if (!isActive || activeTarget !== targetEl) return
    const nw = currentImg.naturalWidth || 320
    const nh = currentImg.naturalHeight || 240

    // For <img> elements, skip preview if image is already displayed near or larger than natural size
    if (targetEl instanceof HTMLImageElement) {
      const rect = targetEl.getBoundingClientRect()
      if (nw <= rect.width * 1.1 && nh <= rect.height * 1.1) {
        return
      }
    }

    positionCard(nw, nh)
    if (currentConfig.showDimensions) {
      currentBadge.textContent = `${nw} × ${nh}`
      currentBadge.style.display = "block"
    } else {
      currentBadge.style.display = "none"
    }
    currentCard.dataset.animation =
      currentConfig.animation ?? DEFAULT_IMAGE_HOVER_PREVIEW_CONFIG.animation
    currentCard.classList.add("ihp-visible")
  }

  currentImg.onerror = () => {
    hidePreview()
  }

  currentImg.src = src
}

function triggerPreviewForTarget(rawTarget: EventTarget | null): void {
  const resolved = resolvePreviewTarget(rawTarget)
  if (!resolved) return
  if (activeTarget === resolved.element) return

  hidePreview()
  activeTarget = resolved.element

  const delay = Math.max(0, currentConfig.delayMs ?? 250)
  if (delay === 0) {
    showPreviewFor(resolved.src, resolved.element)
  } else {
    hoverTimer = window.setTimeout(() => {
      hoverTimer = null
      if (activeTarget === resolved.element) {
        showPreviewFor(resolved.src, resolved.element)
      }
    }, delay)
  }
}

function onPointerOver(e: MouseEvent): void {
  if (!isActive) return
  lastPointerX = e.clientX
  lastPointerY = e.clientY
  lastPointerTarget = e.target

  if (!isModifierSatisfied(e)) return
  triggerPreviewForTarget(e.target)
}

function onPointerMove(e: MouseEvent): void {
  lastPointerX = e.clientX
  lastPointerY = e.clientY
  lastPointerTarget = e.target
}

function onPointerOut(e: MouseEvent): void {
  if (e.target === lastPointerTarget) {
    const related = e.relatedTarget as Node | null
    if (!related || !(lastPointerTarget instanceof Node) || !lastPointerTarget.contains(related)) {
      lastPointerTarget = null
    }
  }
  if (!activeTarget) return
  const related = e.relatedTarget as Node | null
  if (related && activeTarget.contains(related)) return
  if (e.target === activeTarget || activeTarget.contains(e.target as Node)) {
    hidePreview()
  }
}

function onKeyDown(e: KeyboardEvent): void {
  if (!isActive) return
  if (e.key === "Escape") {
    hidePreview()
    return
  }

  if (!e.repeat && !activeTarget && isModifierSatisfied(e)) {
    const targetAtCursor =
      lastPointerTarget ||
      (typeof document.elementFromPoint === "function"
        ? document.elementFromPoint(lastPointerX, lastPointerY)
        : null)
    if (targetAtCursor) {
      triggerPreviewForTarget(targetAtCursor)
    }
  }
}

function onKeyUp(e: KeyboardEvent): void {
  if (!isActive || !activeTarget) return
  if (!isModifierSatisfied(e)) {
    hidePreview()
  }
}

export function updateImageHoverPreviewConfig(
  config?: Partial<ImageHoverPreviewConfig>
): void {
  if (!config) return
  currentConfig = { ...currentConfig, ...config }
}

export function activate(config?: ImageHoverPreviewConfig): void {
  if (config) {
    updateImageHoverPreviewConfig(config)
  }

  if (isActive || typeof window === "undefined") return
  isActive = true

  document.addEventListener("mouseover", onPointerOver, true)
  document.addEventListener("mousemove", onPointerMove, { passive: true, capture: true })
  document.addEventListener("mouseout", onPointerOut, true)
  window.addEventListener("scroll", hidePreview, { passive: true, capture: true })
  window.addEventListener("mousedown", hidePreview, { passive: true, capture: true })
  window.addEventListener("keydown", onKeyDown, true)
  window.addEventListener("keyup", onKeyUp, true)
}

export function deactivate(): void {
  if (!isActive || typeof window === "undefined") return
  isActive = false
  lastPointerTarget = null

  hidePreview()

  document.removeEventListener("mouseover", onPointerOver, true)
  document.removeEventListener("mousemove", onPointerMove, true)
  document.removeEventListener("mouseout", onPointerOut, true)
  window.removeEventListener("scroll", hidePreview, true)
  window.removeEventListener("mousedown", hidePreview, true)
  window.removeEventListener("keydown", onKeyDown, true)
  window.removeEventListener("keyup", onKeyUp, true)

  if (hostElement && hostElement.parentNode) {
    hostElement.parentNode.removeChild(hostElement)
  }
  hostElement = null
  shadowRoot = null
  cardElement = null
  previewImg = null
  dimensionsBadge = null
}
