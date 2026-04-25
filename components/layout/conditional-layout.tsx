"use client"

import { usePathname } from 'next/navigation'
import { BranchProvider } from "@/contexts/branch-context"
import { UserDepartmentProvider } from "@/contexts/user-department-context"

import BranchSelector from "@/components/layout/branch-selector"
import Sidebar, { MobileSidebarContent } from "@/components/layout/sidebar"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileDropdown } from "@/components/ui/profile-dropdown"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Suspense, useState, useEffect } from "react"
import authService from "@/lib/authService"



export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/admin/login'

  const [isFullScreenQueue, setIsFullScreenQueue] = useState(false)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Default to half screen 
    setIsFullScreenQueue(false)
  }, [pathname])

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>
      setIsFullScreenQueue(customEvent.detail)
    }
    window.addEventListener('toggle-fullscreen-queue', handleToggle)
    return () => window.removeEventListener('toggle-fullscreen-queue', handleToggle)
  }, [])

  if (!mounted) {
    return <div className="h-screen w-full bg-gray-50 flex items-center justify-center">Loading Dashboard...</div>
  }

  if (isAuthPage) {
    return <>{children}</>
  }

  if (pathname === '/admin/queue/display' && isFullScreenQueue) {
    return (
      <BranchProvider>
        <UserDepartmentProvider>
          <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
        </UserDepartmentProvider>
      </BranchProvider>
    )
  }

  return (
    <BranchProvider>
      <UserDepartmentProvider>
        <div className="flex h-screen w-full overflow-hidden bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-hidden flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-2 h-16 flex items-center justify-between">
              {/* Mobile Layout */}
              <div className="lg:hidden flex items-center justify-between w-full">
                {/* Left side - Toggle and Branch Selector */}
                <div className="flex items-center gap-1 flex-1 min-w-0">
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1 flex-shrink-0">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <MobileSidebarContent onItemClick={() => setMobileMenuOpen(false)} />
                    </SheetContent>
                  </Sheet>
                  <div className="flex-1 min-w-0 max-w-[150px]">
                    <BranchSelector />
                  </div>
                </div>

                {/* Right side - Profile */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="lg:hidden">
                    <ProfileDropdown />
                  </div>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden lg:flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <BranchSelector />
                </div>

                  {/* User Menu */}
                  <ProfileDropdown />
              </div>
            </header>



            {/* Main Content */}
            <div className="flex-1 overflow-auto">{children}</div>
          </main>
        </div>
      </UserDepartmentProvider>
    </BranchProvider>
  )
}