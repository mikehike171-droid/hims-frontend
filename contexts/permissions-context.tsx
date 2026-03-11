"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/lib/authService';

interface ModuleAccess {
  module_path: string;
  module_name: string;
  add: number;
  edit: number;
  delete: number;
  view: number;
}

const PermissionsContext = createContext<ModuleAccess[] | null>(null);

export const usePermissions = () => {
  return useContext(PermissionsContext);
};

export const PermissionsProvider = ({ children }: { children: React.ReactNode }) => {
  const [permissions, setPermissions] = useState<ModuleAccess[] | null>(null);

  useEffect(() => {
    const moduleAccess = authService.getModuleAccess();
    setPermissions(moduleAccess || []);
  }, []);

  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Cache for parsed sidemenu to avoid repeated parsing
let cachedSideMenu: any = null;
let lastSideMenuData: string | null = null;

export const hasPermission = (permissions: ModuleAccess[] | null, modulePath: string, action: keyof Pick<ModuleAccess, 'add' | 'edit' | 'delete' | 'view'>) => {
  if (!permissions || permissions.length === 0) {
    // Check sidemenu as fallback with caching
    if (typeof window !== 'undefined') {
      const sideMenuData = localStorage.getItem('sidemenu');
      if (sideMenuData && sideMenuData !== lastSideMenuData) {
        try {
          cachedSideMenu = JSON.parse(sideMenuData);
          lastSideMenuData = sideMenuData;
        } catch (error) {
          console.error('Error parsing sidemenu:', error);
          return false;
        }
      }
      
      if (cachedSideMenu) {
        for (const menuItem of cachedSideMenu) {
          const menu = menuItem.menu;
          if (menu.path === modulePath) return true;
          if (menu.sub_menu) {
            const subMenu = menu.sub_menu.find((sub: any) => sub.path === modulePath);
            if (subMenu) return subMenu[action] === 1;
          }
        }
      }
    }
    return false;
  }

  const module = permissions.find(mod => mod.module_path === modulePath);
  return module ? module[action] === 1 : false;
};