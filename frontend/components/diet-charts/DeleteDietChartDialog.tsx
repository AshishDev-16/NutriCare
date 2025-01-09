"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DietChart } from "@/lib/api/diet-charts"
import { toast } from "@/hooks/use-toast"
import { useDietCharts } from "@/hooks/useDietCharts"
import { Loader2 } from "lucide-react"
import { getBaseUrl } from "@/lib/api/config"

interface DeleteDietChartDialogProps {
  dietChart: DietChart | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteDietChartDialog({
  dietChart,
  open,
  onOpenChange,
}: DeleteDietChartDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const { mutate } = useDietCharts()

  if (!dietChart) return null

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`${getBaseUrl()}/api/v1/diet-charts/${dietChart._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to delete diet chart')
      }

      toast({
        title: "Success",
        description: "Diet chart deleted successfully",
      })

      mutate() // Refresh the diet charts list
      onOpenChange(false)
    } catch (error) {
      console.error('Delete error:', error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete diet chart",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Diet Chart</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the diet chart for {dietChart.patient?.name || 'Unknown Patient'}? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 