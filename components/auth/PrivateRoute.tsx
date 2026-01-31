"use client"

import { usePermissions, hasPermission } from '@/contexts/permissions-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import authService from '@/lib/authService';
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PrivateRouteProps {
  children: React.ReactNode;
  modulePath: string;
  action: 'add' | 'edit' | 'delete' | 'view';
}

export default function PrivateRoute({ children, modulePath, action }: PrivateRouteProps) {
  const permissions = usePermissions();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = authService.getCurrentToken();
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  if (!isClient) {
    return null; // Avoid hydration mismatch
  }

  const token = authService.getCurrentToken();
  if (!token) {
    return null;
  }

  // Check if user is admin - admins have full access
  const user = authService.getCurrentUser();
  console.log('Current user:', user); // Debug log
  
  const isAdmin = user && (
    user.role === 'Super Admin' || 
    user.role === 'Admin' ||
    user.role_name === 'Super Admin' ||
    user.role_name === 'Admin' ||
    (user.firstName === 'Admin' && user.lastName === 'Admin') ||
    user.username === 'admin'
  );
  
  console.log('Is Admin:', isAdmin); // Debug log

  // Enhanced admin detection - check multiple possible admin indicators
  const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  let isAdminUser = false;
  
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      isAdminUser = (
        userData.role === 'Super Admin' ||
        userData.role === 'Admin' ||
        userData.role_name === 'Super Admin' ||
        userData.role_name === 'Admin' ||
        userData.username === 'admin' ||
        (userData.firstName === 'Admin' && userData.lastName === 'Admin') ||
        String(userData.role).toLowerCase().includes('admin') ||
        String(userData.role_name || '').toLowerCase().includes('admin')
      );
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }

  // Bypass permission check for my-numbers page - allow all authenticated users
  const isBypassRoute = modulePath === '/admin/telecaller/my-numbers';
  
  if (!isAdminUser && !isBypassRoute && permissions && !hasPermission(permissions, modulePath, action)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 p-4 rounded-full">
                <AlertTriangle className="h-12 w-12 text-red-600" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            
            <p className="text-gray-600 mb-8">
              You don't have permission to access this page. Please contact your administrator.
            </p>
            
            <div className="space-y-4">
              <Link href="/admin/dashboard">
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}