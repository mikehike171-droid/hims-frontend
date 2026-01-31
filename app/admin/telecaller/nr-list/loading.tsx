import { Card, CardContent } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"

export default function Loading() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">NR List</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p>Loading NR list...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}