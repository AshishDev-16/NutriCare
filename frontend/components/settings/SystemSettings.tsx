"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function SystemSettings() {
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    theme: theme || "light",
    language: "en",
    autoLogout: true,
    dataSync: true,
  })

  const handleThemeChange = (value: string) => {
    setSettings({ ...settings, theme: value })
    setTheme(value)
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement save system settings
      toast({
        title: "Success",
        description: "System settings updated",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update system settings",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select
              value={settings.theme}
              onValueChange={handleThemeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Language</Label>
            <Select
              value={settings.language}
              onValueChange={(value) => setSettings({ ...settings, language: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="autoLogout">Auto Logout (after 30 minutes)</Label>
            <Switch
              id="autoLogout"
              checked={settings.autoLogout}
              onCheckedChange={(checked) => setSettings({ ...settings, autoLogout: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="dataSync">Background Data Sync</Label>
            <Switch
              id="dataSync"
              checked={settings.dataSync}
              onCheckedChange={(checked) => setSettings({ ...settings, dataSync: checked })}
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </CardContent>
    </Card>
  )
} 