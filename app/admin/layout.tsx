import type React from "react"
import AuthGuard from "@/components/auth/AuthGuard"
import { PermissionsProvider } from "@/contexts/permissions-context"
import ConditionalLayout from "@/components/layout/conditional-layout"
import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

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
