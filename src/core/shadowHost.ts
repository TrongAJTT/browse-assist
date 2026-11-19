/**
 * Creates a CSS-isolated Shadow DOM host appended to `document.documentElement`
 * so host page CSS (e.g. global `svg`, `button`, or `div` rules) cannot distort
 * extension-injected overlays, toolbars, indicators, or toasts.
 */
export function createShadowHost(
  id: string,
  zIndex = 2147483647
): { host: HTMLDivElement; shadow: ShadowRoot } {
  const existing = document.getElementById(id)
  if (existing && existing.parentNode) {
    existing.parentNode.removeChild(existing)
  }

  const host = document.createElement("div")
  host.id = id
  host.setAttribute("data-browse-assist-internal", "true")
  host.style.cssText = `
    all: initial;
    position: fixed;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    z-index: ${zIndex};
    pointer-events: none;
  `

  const shadow = host.attachShadow({ mode: "open" })
  const resetStyle = document.createElement("style")
  resetStyle.textContent = `
    *, *::before, *::after { box-sizing: border-box; }
    svg { display: block; margin: 0; padding: 0; flex-shrink: 0; }
    button { font-family: inherit; line-height: 1; margin: 0; }
  `
  shadow.appendChild(resetStyle)
  document.documentElement.appendChild(host)

  return { host, shadow }
}
