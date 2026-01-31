"use client"

import { BranchProvider } from "@/contexts/branch-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <BranchProvider>
      {children}
    </BranchProvider>
  )
}