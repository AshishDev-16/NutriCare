"use client"

import { useRouter } from "next/navigation"
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { User } from "lucide-react"

export function UserNav() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Clear token from localStorage
      localStorage.removeItem("token")
      
      // Call logout endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`, {
        method: 'GET',
        credentials: 'include'
      })

      // Show success message
      toast({
        title: "Success",
        description: "Logged out successfully",
      })

      // Redirect to login
      router.push('/login')
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout",
      })
    }
  }

  return (
    <div className="ml-auto p-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9 bg-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Hospital Manager</p>
              <p className="text-xs leading-none text-muted-foreground">
                manager@hospital.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Profile Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            Help Center
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-red-600 cursor-pointer"
            onClick={handleLogout}
          >
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 