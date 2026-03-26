"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
import { Loader2, Moon, Sun, Monitor, Bell, Shield, RefreshCw } from "lucide-react"

export function SystemSettings() {
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    theme: theme || "light",
    language: "en",
    autoLogout: true,
    dataSync: true,
  })

  useEffect(() => {
    // Load persisted settings
    const autoLogout = localStorage.getItem('autoLogoutEnabled') !== 'false'
    setSettings(prev => ({ ...prev, autoLogout }))
  }, [])

  const handleThemeChange = (value: string) => {
    setSettings({ ...settings, theme: value })
    setTheme(value)
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      localStorage.setItem('autoLogoutEnabled', settings.autoLogout.toString())
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      toast({
        title: "Configuration Saved",
        description: "Your system preferences have been updated successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "There was an error saving your clinical settings.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">System Configuration</h2>
        <p className="text-slate-500 mt-2 font-medium">Manage clinical environment and terminal behavior</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <Sun className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Appearance</CardTitle>
                <CardDescription>Visual interface preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Display Theme</Label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'system', icon: Monitor, label: 'Auto' }
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleThemeChange(t.id)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      settings.theme === t.id 
                        ? 'border-[#065f46] bg-[#065f46]/5 text-[#065f46]' 
                        : 'border-slate-100 hover:border-slate-200 text-slate-500'
                    }`}
                  >
                    <t.icon className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">Interface Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) => setSettings({ ...settings, language: value })}
              >
                <SelectTrigger className="bg-slate-50 border-none h-11">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (Medical Standard)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">Security & Operations</CardTitle>
                <CardDescription>Data integrity and session rules</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Auto-Termination</p>
                <p className="text-xs text-slate-500">Log out after 30m inactivity</p>
              </div>
              <Switch
                checked={settings.autoLogout}
                onCheckedChange={(checked) => setSettings({ ...settings, autoLogout: checked })}
                className="data-[state=checked]:bg-[#065f46]"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700">Live Synchronization</p>
                <p className="text-xs text-slate-500">Real-time database mirroring</p>
              </div>
              <Switch
                checked={settings.dataSync}
                onCheckedChange={(checked) => setSettings({ ...settings, dataSync: checked })}
                className="data-[state=checked]:bg-[#065f46]"
              />
            </div>

            <Button 
              className="w-full h-11 bg-[#065f46] hover:bg-[#064e3b] text-white font-bold rounded-xl shadow-md transition-all active:scale-95"
              onClick={handleSave} 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Apply System Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
 