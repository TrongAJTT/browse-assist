import { isInternalElement } from "./domUtils"

export class ScopeManager {
  private _depth = 0
  private baseElement: HTMLElement | null = null

  public get depth(): number {
    return this._depth
  }

  public reset(): void {
    this._depth = 0
    this.baseElement = null
  }

  /**
   * Expands scope to parentElement if valid.
   * Returns the new parent element or null if cannot expand.
   */
  public expand(current: HTMLElement): HTMLElement | null {
    const parent = current.parentElement
    if (
      parent &&
      parent !== document.body &&
      parent !== document.documentElement &&
      !isInternalElement(parent)
    ) {
      if (this._depth === 0) {
        this.baseElement = current
      }
      this._depth++
      return parent
    }
    return null
  }

  /**
   * Shrinks scope back towards the baseElement.
   * Returns the child element or null if already at base.
   */
  public shrink(current: HTMLElement): HTMLElement | null {
    if (this._depth > 1 && current.firstElementChild) {
      this._depth--
      let child = current.firstElementChild as HTMLElement | null
      if (this.baseElement) {
        const matchingChild = Array.from(current.children).find((c) =>
          c.contains(this.baseElement!)
        ) as HTMLElement | undefined
        if (matchingChild) child = matchingChild
      }
      return child || null
    }

    if (this._depth === 1 && this.baseElement) {
      this._depth = 0
      const base = this.baseElement
      return base
    }

    return null
  }
}
