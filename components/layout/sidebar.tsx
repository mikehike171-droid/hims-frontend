"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, memo, useMemo } from "react"
import { useBranch } from "@/contexts/branch-context"
//import { useSettings } from "@/contexts/SettingsContext"
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  User,
  Bed,
  LayoutDashboard,
  BarChart3,
  Pill,
  TestTube,
  Shield,
  CreditCard,
  Building,
  UserCog,
  Phone,
  Target,
  Clock,
  UserCheck,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  Zap,
  UserPlus,
  Receipt,
  IndianRupee,
  AlertTriangle,
  Menu,
  X,
  MessageSquare,
  MapPinned,
  ScrollText,
  Cog,
  ShieldCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import authService from "@/lib/authService"
import { apiCache } from "@/lib/api-cache"

interface NavigationItem {
  title: string
  icon: any
  href?: string
  items?: NavigationItem[]
}

interface MenuItem {
  id: number
  path: string
  name: string
  icon: string
  sub_menu: SubMenuItem[]
}

interface SubMenuItem {
  id: number
  path: string
  name: string
  icon?: string
  add: number
  edit: number
  delete: number
  view: number
}

interface SideMenuData {
  menu: MenuItem
}

// Icon mapping for dynamic menu
const iconMap: { [key: string]: any } = {
  'Home': Home,
  'home': Home,
  'Users': Users,
  'users': Users,
  'Calendar': Calendar,
  'calendar': Calendar,
  'FileText': FileText,
  'filetext': FileText,
  'file-text': FileText,
  'Settings': Settings,
  'settings': Settings,
  'Stethoscope': Stethoscope,
  'stethoscope': Stethoscope,
  'User': User,
  'user': User,
  'Bed': Bed,
  'bed': Bed,
  'LayoutDashboard': LayoutDashboard,
  'layoutdashboard': LayoutDashboard,
  'layout-dashboard': LayoutDashboard,
  'dashboard': LayoutDashboard,
  'Dashboard': LayoutDashboard,
  'BarChart3': BarChart3,
  'barchart3': BarChart3,
  'bar-chart-3': BarChart3,
  'Pill': Pill,
  'pill': Pill,
  'TestTube': TestTube,
  'testtube': TestTube,
  'test-tube': TestTube,
  'Shield': Shield,
  'shield': Shield,
  'CreditCard': CreditCard,
  'creditcard': CreditCard,
  'credit-card': CreditCard,
  'Building': Building,
  'building': Building,
  'UserCog': UserCog,
  'usercog': UserCog,
  'user-cog': UserCog,
  'Phone': Phone,
  'phone': Phone,
  'Target': Target,
  'target': Target,
  'Clock': Clock,
  'clock': Clock,
  'UserCheck': UserCheck,
  'usercheck': UserCheck,
  'user-check': UserCheck,
  'Package': Package,
  'package': Package,
  'ShoppingCart': ShoppingCart,
  'shoppingcart': ShoppingCart,
  'shopping-cart': ShoppingCart,
  'Truck': Truck,
  'truck': Truck,
  'DollarSign': DollarSign,
  'dollarsign': DollarSign,
  'dollar-sign': DollarSign,
  'Zap': Zap,
  'zap': Zap,
  'UserPlus': UserPlus,
  'userplus': UserPlus,
  'user-plus': UserPlus,
  'Receipt': Receipt,
  'receipt': Receipt,
  'IndianRupee': IndianRupee,
  'indianrupee': IndianRupee,
  'indian-rupee': IndianRupee,
  'AlertTriangle': AlertTriangle,
  'alerttriangle': AlertTriangle,
  'alert-triangle': AlertTriangle,
  'MessageSquare': MessageSquare,
  'messagesquare': MessageSquare,
  'message-square': MessageSquare,
  'ShieldCheck': Shield,
  'shieldcheck': Shield,
  'shield-check': Shield,
  'MapPinned': Building,
  'mappinned': Building,
  'map-pinned': Building,
  'ScrollText': FileText,
  'scrolltext': FileText,
  'scroll-text': FileText,
  'Cog': Settings,
  'cog': Settings,
  // Settings submodule specific icons
  'users': UserCog,
  'departments': Building,
  'locations': Building,
  'roles': Shield,
  'system': Settings,
  'audit-logs': FileText,
  'audit_logs': FileText
}

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Home
}

// Shared user data hook to prevent duplicate API calls
const useUserData = () => {
  const { currentBranch } = useBranch()
  const [userDepartment, setUserDepartment] = useState<string>('General')
  const [userName, setUserName] = useState<string>('User')
  const [userInitials, setUserInitials] = useState<string>('U')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isLoaded) return // Prevent multiple calls
    
    const fetchUserData = async () => {
      try {
        const user = authService.getCurrentUser()
        const token = authService.getCurrentToken()
        const apiUrl = authService.getSettingsApiUrl()
        const locationId = currentBranch?.id || '1'
        
        // Fetch user details and department in parallel
        const [userResponse, deptData] = await Promise.all([
          fetch(`${apiUrl}/settings/users/${user?.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          apiCache.fetch(`${apiUrl}/settings/users/${user?.id}/department?locationId=${locationId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        ])
        
        // Process user data
        if (userResponse.ok) {
          const userData = await userResponse.json()
          const firstName = userData.firstName || ''
          const lastName = userData.lastName || ''
          const fullName = `${firstName} ${lastName}`.trim() || user?.user_name || 'User'
          setUserName(fullName)
          setUserInitials(`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.user_name?.charAt(0)?.toUpperCase() || 'U')
        } else {
          const firstName = user?.firstName || user?.first_name || ''
          const lastName = user?.lastName || user?.last_name || ''
          const fullName = `${firstName} ${lastName}`.trim() || user?.user_name || 'User'
          setUserName(fullName)
          setUserInitials(`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.user_name?.charAt(0)?.toUpperCase() || 'U')
        }
        
        // Process department data
        setUserDepartment(deptData.departmentName || 'General')
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        const user = authService.getCurrentUser()
        const firstName = user?.firstName || user?.first_name || ''
        const lastName = user?.lastName || user?.last_name || ''
        const fullName = `${firstName} ${lastName}`.trim() || user?.user_name || 'User'
        setUserName(fullName)
        setUserInitials(`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user?.user_name?.charAt(0)?.toUpperCase() || 'U')
      } finally {
        setIsLoaded(true)
      }
    }
    
    fetchUserData()
  }, [currentBranch, isLoaded])
  
  return { userDepartment, userName, userInitials }
}

const SidebarItem = ({
  item,
  level = 0,
  onItemClick,
}: { item: NavigationItem; level?: number; onItemClick?: () => void }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const hasChildren = item.items && item.items.length > 0
  const isActive = item.href ? pathname === item.href : false
  
  // Auto-expand if current path matches any child
  useEffect(() => {
    if (hasChildren && item.items) {
      const hasActiveChild = item.items.some(child => 
        child.href && pathname === child.href
      )
      if (hasActiveChild) {
        setIsOpen(true)
      }
    }
  }, [pathname, hasChildren, item.items])
  
  const handleNavigation = (href: string) => {
    if (onItemClick) onItemClick()
    router.push(href)
  }

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
            level > 0 && "ml-4",
          )}
        >
          <div className="flex items-center gap-3">
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{item.title}</span>
          </div>
          {isOpen ? (
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
          )}
        </button>
        {isOpen && (
          <div className="mt-1 space-y-1">
            {item.items.map((subItem, index) => (
              <SidebarItem key={index} item={subItem} level={level + 1} onItemClick={onItemClick} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => item.href && handleNavigation(item.href)}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-left cursor-pointer",
        level > 0 && "ml-4",
        isActive && "bg-primary text-primary-foreground",
      )}
    >
      <item.icon className="h-4 w-4 flex-shrink-0" />
      <span className="truncate">{item.title}</span>
    </button>
  )
}

// Desktop Sidebar Component
const DesktopSidebar = memo(() => {
  const { currentBranch } = useBranch()
  //const { settings } = useSettings()
  const { userDepartment, userName, userInitials } = useUserData()
  
  // Update browser title
  // useEffect(() => {
  //   if (settings?.general?.hospital_name) {
  //     document.title = settings.general.hospital_name
  //   }
  // }, [settings?.general?.hospital_name])
  
  const navigationItems = useMemo(() => {
    try {
      const sideMenuData = localStorage.getItem('sidemenu')
      if (sideMenuData) {
        const parsedMenu: SideMenuData[] = JSON.parse(sideMenuData)
        return parsedMenu.map(item => ({
          title: item.menu.name,
          icon: getIcon(item.menu.icon),
          href: item.menu.sub_menu.length === 0 ? `/${item.menu.path}` : undefined,
          items: item.menu.sub_menu.length > 0 ? item.menu.sub_menu.map(sub => ({
            title: sub.name,
            href: `/${sub.path}`,
            icon: getIcon(sub.icon || item.menu.icon)
          })) : undefined
        }))
      }
      return []
    } catch (error) {
      console.error('Error loading menu from storage:', error)
      return []
    }
  }, [])

  return (
    <div className="hidden lg:flex h-full w-64 flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 border-b border-border px-6 h-16">
        <img 
          src="/images/vithyou.png"
          alt="VithYou Logo"
          className="w-33 m-0 object-contain" 
          onError={(e) => {
            e.currentTarget.src = "/images/vithyou.png"
          }}
        />
        {/* {currentBranch && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground truncate">{currentBranch.code}</span>
          </div>
        )} */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {navigationItems.map((item, index) => (
          <SidebarItem key={index} item={item} />
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userDepartment}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              localStorage.removeItem('authToken')
              localStorage.removeItem('user')
              localStorage.removeItem('sidemenu')
              localStorage.removeItem('moduleAccess')
              localStorage.removeItem('selectedBranchId')
              localStorage.removeItem('location_id')
              localStorage.removeItem('selected_location_id')
              window.location.href = '/admin/login'
            }}
            className="text-xs"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
})

// Mobile Sidebar Content Component  
const MobileSidebarContent = memo(({ onItemClick }: { onItemClick?: () => void }) => {
  const { currentBranch } = useBranch()
  //const { settings } = useSettings()
  const { userDepartment, userName, userInitials } = useUserData()
  
  // Update browser title for mobile too
  // useEffect(() => {
  //   if (settings?.general?.hospital_name) {
  //     document.title = settings.general.hospital_name
  //   }
  // }, [settings?.general?.hospital_name])
  
  const navigationItems = useMemo(() => {
    try {
      const sideMenuData = localStorage.getItem('sidemenu')
      if (sideMenuData) {
        const parsedMenu: SideMenuData[] = JSON.parse(sideMenuData)
        return parsedMenu.map(item => ({
          title: item.menu.name,
          icon: getIcon(item.menu.icon),
          href: item.menu.sub_menu.length === 0 ? `/${item.menu.path}` : undefined,
          items: item.menu.sub_menu.length > 0 ? item.menu.sub_menu.map(sub => ({
            title: sub.name,
            href: `/${sub.path}`,
            icon: getIcon(sub.icon || item.menu.icon)
          })) : undefined
        }))
      }
      return []
    } catch (error) {
      console.error('Error loading menu from storage:', error)
      return []
    }
  }, [])

  return (
    <div className="flex h-full flex-col bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b border-border px-6 h-16">
        <img 
          src="/images/vithyou.png"
          alt="VithYou Logo"
          className="h-[60px] w-48 object-contain" 
          onError={(e) => {
            e.currentTarget.src = "/images/vithyou.png"
          }}
        />
        {currentBranch && (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground truncate">{currentBranch.code}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto overflow-x-hidden scrollbar-thin">
        {navigationItems.map((item, index) => (
          <SidebarItem key={index} item={item} onItemClick={onItemClick} />
        ))}
      </nav>

      {/* User Info */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-sm font-medium text-primary-foreground">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground truncate">{userDepartment}</p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              localStorage.removeItem('authToken')
              localStorage.removeItem('user')
              localStorage.removeItem('sidemenu')
              localStorage.removeItem('moduleAccess')
              localStorage.removeItem('selectedBranchId')
              localStorage.removeItem('location_id')
              localStorage.removeItem('selected_location_id')
              window.location.href = '/admin/login'
            }}
            className="text-xs"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
})

DesktopSidebar.displayName = 'DesktopSidebar'
MobileSidebarContent.displayName = 'MobileSidebarContent'

export default function Sidebar() {
  return <DesktopSidebar />
}

export { MobileSidebarContent }