export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="h-20 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      
      <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  )
}