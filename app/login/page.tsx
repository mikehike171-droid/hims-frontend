export default function StaticLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Pranam HMS</h1>
        <p className="text-gray-600 mb-8">Hospital Management System</p>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Welcome</h2>
          <p className="text-gray-600">Please contact your administrator for login access.</p>
        </div>
      </div>
    </div>
  )
}