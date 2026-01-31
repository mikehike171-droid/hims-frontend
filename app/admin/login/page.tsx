"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Building2, Stethoscope } from "lucide-react"
import authService from "@/lib/authService"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await authService.login(formData.username, formData.password)
      
      // Get user's menu permissions and redirect to first accessible page
      const sideMenuData = localStorage.getItem('sidemenu')
      if (sideMenuData) {
        const parsedMenu = JSON.parse(sideMenuData)
        
        // Find first accessible menu item
        for (const item of parsedMenu) {
          if (item.menu.sub_menu.length === 0 && item.menu.path) {
            // Direct menu item
            window.location.href = `/${item.menu.path}`
            return
          } else if (item.menu.sub_menu.length > 0) {
            // Has submenu, redirect to first submenu item
            window.location.href = `/${item.menu.sub_menu[0].path}`
            return
          }
        }
      }
      
      // Fallback to dashboard if no menu found
      window.location.href = '/admin/dashboard'
    } catch (error: any) {
      console.error('Login error:', error)
      alert(error.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{backgroundColor: '#F5F5F7'}}>
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/images/vithyou.png" 
              alt="Pranaam Logo" 
              className="h-16 w-auto"
            />
          </div>
          {/* <h1 className="text-3xl font-bold text-gray-900 mb-2">Pranam HMS</h1>
          <p className="text-gray-600">Hospital Management System</p> */}
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <Label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </Label>
                </div>
                <a href="#" className="text-sm text-red-600 hover:text-red-700">
                  Forgot password?
                </a>
              </div> */}

              <Button
                type="submit"
                className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact{" "}
                <a href="#" className="text-red-600 hover:text-red-700">
                  IT Support
                </a>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        {/* <div className="mt-8 text-center text-sm text-gray-500">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-4 w-4" />
            <span>Pranam Hospitals</span>
          </div>
          <p>© 2025 All rights reserved</p>
        </div> */}
      </div>
    </div>
  )
}
