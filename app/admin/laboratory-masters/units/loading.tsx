import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <Skeleton className="h-8 w-32" />
      </div>
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    </div>
  )
}
