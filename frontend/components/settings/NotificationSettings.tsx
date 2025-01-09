"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState({
    taskUpdates: true,
    deliveryAlerts: true,
    systemNotifications: false,
    emailNotifications: true,
  })

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      // TODO: Implement save notification settings
      toast({
        title: "Success",
        description: "Notification settings updated",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update notification settings",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="taskUpdates">Task Updates</Label>
            <Switch
              id="taskUpdates"
              checked={notifications.taskUpdates}
              onCheckedChange={() => handleToggle('taskUpdates')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="deliveryAlerts">Delivery Alerts</Label>
            <Switch
              id="deliveryAlerts"
              checked={notifications.deliveryAlerts}
              onCheckedChange={() => handleToggle('deliveryAlerts')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="systemNotifications">System Notifications</Label>
            <Switch
              id="systemNotifications"
              checked={notifications.systemNotifications}
              onCheckedChange={() => handleToggle('systemNotifications')}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <Switch
              id="emailNotifications"
              checked={notifications.emailNotifications}
              onCheckedChange={() => handleToggle('emailNotifications')}
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
            'Save Preferences'
          )}
        </Button>
      </CardContent>
    </Card>
  )
} 