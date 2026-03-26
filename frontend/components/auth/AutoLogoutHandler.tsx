"use client"

import { useEffect, useCallback, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from '@/hooks/use-toast'

const AUTO_LOGOUT_TIME = 30 * 60 * 1000 // 30 minutes in milliseconds

export function AutoLogoutHandler() {
  const { logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    const isEnabled = localStorage.getItem('autoLogoutEnabled') !== 'false'
    
    if (isAuthenticated && isEnabled) {
      timeoutRef.current = setTimeout(() => {
        logout()
        router.push('/')
        toast({
          title: "Session Expired",
          description: "You have been logged out due to 30 minutes of inactivity.",
          variant: "destructive"
        })
      }, AUTO_LOGOUT_TIME)
    }
  }, [isAuthenticated, logout, router])

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    if (isAuthenticated) {
      resetTimer()
      events.forEach(event => {
        window.addEventListener(event, resetTimer)
      })
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer)
      })
    }
  }, [isAuthenticated, resetTimer])

  return null
}
