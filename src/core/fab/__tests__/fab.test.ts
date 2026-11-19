import { afterEach, describe, expect, it, vi } from "vitest"

import {
  bindFabRightClick,
  cancelFabReposition,
  clearFabDismissedOnTab,
  closeFabContextMenu,
  computeEdgePlacementFromPoint,
  dismissFabOnTab,
  isFabContextMenuOpen,
  isFabDismissedOnTab,
  isFabRepositioning,
  openFabContextMenu,
  resetAllFabDismissals
} from "~core/fab"

describe("shared FAB system", () => {
  afterEach(() => {
    closeFabContextMenu()
    cancelFabReposition()
    resetAllFabDismissals()
    vi.useRealTimers()
  })

  describe("computeEdgePlacementFromPoint", () => {
    const viewport = { left: 0, top: 0, width: 1000, height: 800 }

    it("snaps to the nearest of all 4 edges with clamped offsetPercent", () => {
      expect(
        computeEdgePlacementFromPoint({ x: 960, y: 400 }, viewport, [
          "left",
          "right",
          "top",
          "bottom"
        ])
      ).toEqual({ edge: "right", offsetPercent: 50 })

      expect(
        computeEdgePlacementFromPoint({ x: 250, y: 20 }, viewport, [
          "left",
          "right",
          "top",
          "bottom"
        ])
      ).toEqual({ edge: "top", offsetPercent: 25 })

      expect(
        computeEdgePlacementFromPoint({ x: 750, y: 790 }, viewport, [
          "left",
          "right",
          "top",
          "bottom"
        ])
      ).toEqual({ edge: "bottom", offsetPercent: 75 })

      expect(
        computeEdgePlacementFromPoint({ x: 10, y: 600 }, viewport, [
          "left",
          "right",
          "top",
          "bottom"
        ])
      ).toEqual({ edge: "left", offsetPercent: 75 })
    })

    it("restricts snapping to allowedEdges (e.g. left/right only for Quick Scroll)", () => {
      expect(
        computeEdgePlacementFromPoint({ x: 300, y: 10 }, viewport, [
          "left",
          "right"
        ])
      ).toEqual({ edge: "left", offsetPercent: 1 })

      expect(
        computeEdgePlacementFromPoint({ x: 700, y: 790 }, viewport, [
          "left",
          "right"
        ])
      ).toEqual({ edge: "right", offsetPercent: 99 })
    })

    it("supports video-relative non-zero origin bounds for PiP", () => {
      const videoRect = { left: 200, top: 100, width: 640, height: 360 }
      expect(
        computeEdgePlacementFromPoint({ x: 830, y: 190 }, videoRect, [
          "left",
          "right",
          "top",
          "bottom"
        ])
      ).toEqual({ edge: "right", offsetPercent: 25 })
    })
  })

  describe("tabDismissal", () => {
    it("tracks ephemeral per-tab dismissals independently", () => {
      expect(isFabDismissedOnTab("quickHub")).toBe(false)
      expect(isFabDismissedOnTab("quickScroll")).toBe(false)
      expect(isFabDismissedOnTab("pipHover")).toBe(false)

      dismissFabOnTab("quickHub")
      expect(isFabDismissedOnTab("quickHub")).toBe(true)
      expect(isFabDismissedOnTab("quickScroll")).toBe(false)

      clearFabDismissedOnTab("quickHub")
      expect(isFabDismissedOnTab("quickHub")).toBe(false)
    })
  })

  describe("contextMenu", () => {
    it("opens in Shadow DOM, triggers item action, and closes cleanly", () => {
      const onMove = vi.fn()
      const onClose = vi.fn()

      openFabContextMenu({
        x: 120,
        y: 160,
        theme: "dark",
        onClose,
        items: [
          {
            id: "move",
            label: "Move position",
            onSelect: onMove
          }
        ]
      })

      expect(isFabContextMenuOpen()).toBe(true)
      const host = document.getElementById("__browse_assist_fab_context_menu__")
      expect(host).not.toBeNull()

      const btn = host?.shadowRoot?.querySelector(
        'button[data-action-id="move"]'
      ) as HTMLButtonElement | null
      expect(btn).not.toBeNull()

      btn?.click()
      expect(onMove).toHaveBeenCalledTimes(1)
      expect(onClose).toHaveBeenCalledTimes(1)
      expect(isFabContextMenuOpen()).toBe(false)
    })

    it("closes when Escape is pressed", () => {
      const onClose = vi.fn()
      openFabContextMenu({
        x: 50,
        y: 50,
        onClose,
        items: [{ id: "hide", label: "Hide", onSelect: vi.fn() }]
      })

      expect(isFabContextMenuOpen()).toBe(true)
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
      expect(isFabContextMenuOpen()).toBe(false)
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  describe("bindFabRightClick (quick hold-drag vs context menu)", () => {
    it("opens context menu on a quick right-click release without movement", () => {
      const btn = document.createElement("button")
      document.body.appendChild(btn)
      const onCommit = vi.fn()

      const unbind = bindFabRightClick(btn, {
        allowedEdges: ["left", "right", "top", "bottom"],
        getInitialPlacement: () => ({ edge: "right", offsetPercent: 50 }),
        getBounds: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
        onPreview: vi.fn(),
        onCommit,
        getMenuItems: ({ startMove }) => [
          { id: "move", label: "Move", onSelect: startMove }
        ]
      })

      btn.dispatchEvent(
        new MouseEvent("pointerdown", {
          button: 2,
          clientX: 900,
          clientY: 400,
          bubbles: true
        })
      )
      window.dispatchEvent(
        new MouseEvent("pointerup", {
          button: 2,
          clientX: 901,
          clientY: 401,
          bubbles: true
        })
      )

      expect(isFabContextMenuOpen()).toBe(true)
      expect(isFabRepositioning()).toBe(false)
      expect(onCommit).not.toHaveBeenCalled()

      unbind()
      btn.remove()
    })

    it("enters quick reposition on right-button drag and commits on release", () => {
      const btn = document.createElement("button")
      document.body.appendChild(btn)
      const onPreview = vi.fn()
      const onCommit = vi.fn()

      const unbind = bindFabRightClick(btn, {
        allowedEdges: ["left", "right", "top", "bottom"],
        getInitialPlacement: () => ({ edge: "right", offsetPercent: 50 }),
        getBounds: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
        onPreview,
        onCommit,
        getMenuItems: ({ startMove }) => [
          { id: "move", label: "Move", onSelect: startMove }
        ]
      })

      btn.dispatchEvent(
        new MouseEvent("pointerdown", {
          button: 2,
          clientX: 900,
          clientY: 400,
          bubbles: true
        })
      )
      // Drag beyond 6px threshold -> activates quick move
      window.dispatchEvent(
        new MouseEvent("pointermove", {
          button: 2,
          clientX: 20,
          clientY: 400,
          bubbles: true
        })
      )
      expect(isFabRepositioning()).toBe(true)
      expect(isFabContextMenuOpen()).toBe(false)

      // Release right button -> commits placement without opening menu
      window.dispatchEvent(
        new MouseEvent("pointerup", {
          button: 2,
          clientX: 20,
          clientY: 400,
          bubbles: true
        })
      )
      expect(isFabRepositioning()).toBe(false)
      expect(isFabContextMenuOpen()).toBe(false)
      expect(onCommit).toHaveBeenCalledWith({ edge: "left", offsetPercent: 50 })

      unbind()
      btn.remove()
    })

    it("enters quick reposition automatically when holding right-click > 220ms", () => {
      vi.useFakeTimers()
      const btn = document.createElement("button")
      document.body.appendChild(btn)
      const onCommit = vi.fn()

      const unbind = bindFabRightClick(btn, {
        allowedEdges: ["left", "right"],
        getInitialPlacement: () => ({ edge: "right", offsetPercent: 50 }),
        getBounds: () => ({ left: 0, top: 0, width: 1000, height: 800 }),
        onPreview: vi.fn(),
        onCommit,
        getMenuItems: ({ startMove }) => [
          { id: "move", label: "Move", onSelect: startMove }
        ]
      })

      btn.dispatchEvent(
        new MouseEvent("pointerdown", {
          button: 2,
          clientX: 950,
          clientY: 400,
          bubbles: true
        })
      )
      vi.advanceTimersByTime(250)
      expect(isFabRepositioning()).toBe(true)

      window.dispatchEvent(
        new MouseEvent("pointerup", {
          button: 2,
          clientX: 10,
          clientY: 200,
          bubbles: true
        })
      )
      expect(onCommit).toHaveBeenCalledWith({ edge: "left", offsetPercent: 25 })

      unbind()
      btn.remove()
    })
  })
})
