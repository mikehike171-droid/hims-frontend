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

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const user = localStorage.getItem("user")

    if (token && user) {
      setIsAuthenticated(true)
    } else if (pathname !== "/admin/login") {
      router.push("/admin/login")
    }
  }, [pathname, router])

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return <>{children}</>
}