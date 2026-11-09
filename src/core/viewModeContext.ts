import { createContext, useContext } from "react"
import type { ViewMode } from "./types"

export const ViewModeContext = createContext<ViewMode>("list")

export const useViewMode = (): ViewMode => useContext(ViewModeContext)
