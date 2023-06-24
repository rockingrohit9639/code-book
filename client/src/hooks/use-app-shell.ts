import constate from 'constate'
import { useState } from 'react'

export function useAppShell() {
  const [isSiderCollapsed, setIsSiderCollapsed] = useState(false)

  return { isSiderCollapsed, setIsSiderCollapsed }
}

export const [AppShellProvider, useAppShellContext] = constate(useAppShell)
