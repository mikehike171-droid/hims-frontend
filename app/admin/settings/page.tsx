"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import PrivateRoute from "@/components/auth/PrivateRoute"
import { Button } from "@/components/ui/button"
import updateSettingsIcons from "@/lib/updateSettingsIcons"

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-update icons on first load
    const hasUpdatedIcons = localStorage.getItem('settingsIconsUpdated');
    if (!hasUpdatedIcons) {
      updateSettingsIcons();
      localStorage.setItem('settingsIconsUpdated', 'true');
    } else {
      // Redirect to users submenu by default
      router.replace("/admin/settings/users");
    }
  }, [router])

  return (
    <PrivateRoute modulePath="admin/settings" action="view">
      <div className="p-6">
        <div className="text-center space-y-4">
          <p>Redirecting to Settings...</p>
          <Button 
            onClick={() => {
              localStorage.removeItem('settingsIconsUpdated');
              updateSettingsIcons();
            }}
            variant="outline"
            size="sm"
          >
            Update Settings Icons
          </Button>
        </div>
      </div>
    </PrivateRoute>
  )
}