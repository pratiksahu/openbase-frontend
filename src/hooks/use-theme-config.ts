"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeConfig() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedTheme = theme === "system" ? systemTheme : theme
  const isLight = resolvedTheme === "light"
  const isDark = resolvedTheme === "dark"

  return {
    theme: resolvedTheme,
    isLight,
    isDark,
    mounted,
  }
}