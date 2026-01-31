"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Immediate check without loading state
    const token = localStorage.getItem("authToken")
    const user = localStorage.getItem("user")
    
    if (token && user) {
      setIsAuthenticated(true)
      setIsLoading(false)
    } else {
      setIsAuthenticated(false)
      setIsLoading(false)
      // Redirect only if not on admin login page
      if (pathname !== "/admin/login") {
        router.push("/admin/login")
      }
    }
  }, [pathname, router])

  // Skip loading spinner for faster rendering
  if (isLoading) {
    return null
  }

  // If on admin login page, always show content
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // If authenticated, show protected content
  if (isAuthenticated) {
    return <>{children}</>
  }

  // If not authenticated, show nothing (will redirect)
  return null
}