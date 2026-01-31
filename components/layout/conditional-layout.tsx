"use client"

import { usePathname } from 'next/navigation'
import { BranchProvider } from "@/contexts/branch-context"
import { UserDepartmentProvider } from "@/contexts/user-department-context"

import BranchSelector from "@/components/layout/branch-selector"
import Sidebar, { MobileSidebarContent } from "@/components/layout/sidebar"
import { Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProfileDropdown } from "@/components/ui/profile-dropdown"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Suspense, useState } from "react"
import authService from "@/lib/authService"



export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/admin/login'

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <BranchProvider>
      <UserDepartmentProvider>
        <div className="flex h-screen bg-gray-50">
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
              
              {/* Right side - Notifications and Profile */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <Button variant="ghost" size="sm" className="relative p-1">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 text-white text-xs rounded-full flex items-center justify-center text-[10px]">
                    3
                  </span>
                </Button>
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

              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="hidden md:flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search patients, appointments..."
                      className="pl-10 w-64 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    3
                  </span>
                </Button>

                {/* User Menu */}
                <ProfileDropdown />
              </div>
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