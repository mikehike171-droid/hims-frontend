export default function Loading() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
      
      <div className="bg-white rounded-lg border p-6 animate-pulse">
        <div className="flex space-x-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border animate-pulse">
        <div className="p-6 border-b">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded flex-1"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}