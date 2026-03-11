"use client"

import * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SearchableSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: Array<{ id: string | number; title: string }>
  placeholder?: string
  className?: string
  valueField?: 'id' | 'title'
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className,
  valueField = 'title'
}: SearchableSelectProps) {
  const [search, setSearch] = React.useState("")
  const [open, setOpen] = React.useState(false)

  const filteredOptions = options.filter((option) =>
    option.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Select value={value} onValueChange={onValueChange} open={open} onOpenChange={setOpen}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="p-0">
        <div className="p-2 border-b">
          <Input
            placeholder={`Search ...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <div className="max-h-64 overflow-auto p-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <SelectItem key={option.id} value={String(valueField === 'id' ? option.id : option.title)} className="cursor-pointer">
                {option.title}
              </SelectItem>
            ))
          ) : (
            <div className="py-6 text-center text-sm text-gray-500">No results found</div>
          )}
        </div>
      </SelectContent>
    </Select>
  )
}
