"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useThemeConfig() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const currentTheme = theme === "system" ? systemTheme : theme

  return {
    theme: mounted ? currentTheme : undefined,
    setTheme,
    mounted,
    isLight: currentTheme === "light",
    isDark: currentTheme === "dark",
  }
}