export default function QueueDisplayLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="bg-blue-700 rounded-2xl shadow-xl p-6 mb-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-12 w-96 bg-blue-600 rounded mb-2"></div>
            <div className="h-6 w-64 bg-blue-600 rounded"></div>
          </div>
          <div className="text-right">
            <div className="h-10 w-48 bg-blue-600 rounded mb-2"></div>
            <div className="h-5 w-32 bg-blue-600 rounded"></div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
          <div className="h-8 w-64 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-4 border-2 border-gray-200">
                <div className="h-10 w-10 bg-gray-300 rounded-lg mb-2"></div>
                <div className="h-5 w-32 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 w-20 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white rounded-2xl shadow-xl p-6 animate-pulse">
          <div className="h-8 w-96 bg-gray-300 rounded mb-4"></div>
          <div className="bg-blue-700 rounded-xl p-4 mb-3">
            <div className="h-6 w-full bg-blue-600 rounded"></div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-gray-100 rounded-xl p-4 border-2 border-gray-200">
                <div className="h-16 w-full bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
