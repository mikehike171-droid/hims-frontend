import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function AppointmentsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-48" />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters Skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <Skeleton className="flex-1 h-10" />
              <Skeleton className="w-full md:w-48 h-10" />
            </div>
          </CardContent>
        </Card>

        {/* Appointments List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-16" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-4 w-40" />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-28" />
                        </div>
                        <Skeleton className="h-4 w-56" />
                      </div>
                    </div>

                    {/* Preparation Instructions Skeleton */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <Skeleton className="h-5 w-48 mb-2" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                    </div>
                  </div>

                  {/* Actions Skeleton */}
                  <div className="flex flex-col gap-2 ml-4">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
