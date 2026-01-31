export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto mb-8"></div>
        <p className="text-3xl font-semibold text-gray-700">Loading Queue Display...</p>
      </div>
    </div>
  )
}
