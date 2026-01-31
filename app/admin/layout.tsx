import type React from "react"
import AuthGuard from "@/components/auth/AuthGuard"
import { PermissionsProvider } from "@/contexts/permissions-context"
import ConditionalLayout from "@/components/layout/conditional-layout"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <PermissionsProvider>
        <ConditionalLayout>{children}</ConditionalLayout>
      </PermissionsProvider>
    </AuthGuard>
  )
}
