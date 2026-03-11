"use client"

import { useState, memo } from "react"
import { ChevronDown, Building } from "lucide-react"
import { useBranch } from "@/contexts/branch-context"

function BranchSelector() {
  const { currentBranch, branches, switchBranch, loading } = useBranch()
  const [isOpen, setIsOpen] = useState(false)

  if (loading || !currentBranch) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md">
        <Building className="h-4 w-4 text-gray-400" />
        <div className="text-sm text-gray-500">Select Branch</div>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 min-w-[280px] justify-between bg-white border border-gray-200 rounded-md px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <div className="flex items-center gap-2">
          <Building className="h-4 w-4 text-red-600" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900 truncate max-w-[220px]">
              {currentBranch.name}
            </span>
            <span className="text-xs text-gray-500">{currentBranch.code}</span>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <div className="p-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">Select Branch Location</span>
          </div>
          
          <div className="max-h-64 overflow-y-auto">
            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => {
                  switchBranch(branch.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left p-3 hover:bg-gray-50 flex items-start gap-3 ${
                  currentBranch.id === branch.id ? 'bg-red-50' : ''
                }`}
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 flex-shrink-0">
                  <Building className="h-4 w-4 text-red-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 truncate">{branch.name}</span>
                    {branch.type === "main" && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Main
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>{branch.code}</div>
                    <div className="truncate">{branch.address}</div>
                    <div>{branch.phone}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default memo(BranchSelector)