// frontend/components/ui/branch-dropdown.tsx
"use client"

import { useBranch } from "@/contexts/branch-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BranchDropdown() {
  const { currentBranch, branches, switchBranch, loading } = useBranch()

  if (loading) {
    return <div className="w-48 h-10 bg-gray-200 animate-pulse rounded" />
  }

  return (
    <Select value={currentBranch?.id || ""} onValueChange={switchBranch}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select branch" />
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch) => (
          <SelectItem key={branch.id} value={branch.id}>
            {branch.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
