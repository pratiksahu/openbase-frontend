"use client"

import { useThemeConfig } from "@/hooks/use-theme-config"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ThemeTest() {
  const { theme, isLight, isDark, mounted } = useThemeConfig()

  if (!mounted) {
    return <div>Loading theme...</div>
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold">Theme Test Page</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Current Theme</CardTitle>
          <CardDescription>Testing theme functionality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Badge variant="outline" className="text-lg p-2">
                Current theme: {theme}
              </Badge>
            </div>
            <div className="flex gap-4">
              <span>Is Light: {isLight ? "✅" : "❌"}</span>
              <span>Is Dark: {isDark ? "✅" : "❌"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Primary Color</CardTitle>
        </CardHeader>
        <CardContent>
          This card uses primary colors
        </CardContent>
      </Card>

      <Card className="bg-secondary text-secondary-foreground">
        <CardHeader>
          <CardTitle>Secondary Color</CardTitle>
        </CardHeader>
        <CardContent>
          This card uses secondary colors
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-background text-foreground border rounded">
          Background / Foreground
        </div>
        <div className="p-4 bg-muted text-muted-foreground rounded">
          Muted / Muted Foreground
        </div>
      </div>
    </div>
  )
}