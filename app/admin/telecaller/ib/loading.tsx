import { RefreshCw } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
        <p>Loading IB patients...</p>
      </div>
    </div>
  )
}