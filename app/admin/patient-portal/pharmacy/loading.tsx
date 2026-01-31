import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function PharmacyLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <Skeleton className="flex-1 h-10" />
                    <Skeleton className="w-full md:w-48 h-10" />
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <Skeleton className="w-16 h-16 rounded-lg" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <Skeleton className="h-5 w-48 mb-2" />
                                  <Skeleton className="h-4 w-32 mb-2" />
                                  <div className="flex items-center gap-4">
                                    <Skeleton className="h-3 w-16" />
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-12" />
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Skeleton className="h-6 w-16 mb-1" />
                                  <Skeleton className="h-4 w-12" />
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-4">
                                  <Skeleton className="h-5 w-20" />
                                  <Skeleton className="h-5 w-24" />
                                  <Skeleton className="h-3 w-16" />
                                </div>
                                <div className="flex items-center gap-2">
                                  <Skeleton className="h-8 w-16" />
                                  <Skeleton className="h-8 w-24" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Skeleton className="h-12 w-12 mx-auto mb-2" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
