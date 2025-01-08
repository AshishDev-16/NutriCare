"use client"

import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { useState } from "react"

interface RefreshButtonProps {
  onRefresh: () => Promise<void>
}

export function RefreshButton({ onRefresh }: RefreshButtonProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleRefresh}
      disabled={isRefreshing}
    >
      <RefreshCw
        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
      />
    </Button>
  )
} 