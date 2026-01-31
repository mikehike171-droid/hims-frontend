"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SystemSettings, settingsApi } from '@/lib/api/settings';

interface SettingsContextType {
  settings: SystemSettings | null;
  loading: boolean;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsApi.getSettings();
      console.log('Settings fetched:', data);
      setSettings(data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      // Set default settings if API fails
      setSettings({
        general: {
          hospital_name: 'Pranam Hospital Management System',
          hospital_heading: 'HIMS - Hospital Information Management System',
          hospital_logo: '',
          timezone: 'Asia/Kolkata',
          currency: 'INR',
          dateFormat: 'DD/MM/YYYY',
        },
        security: {
          passwordMinLength: 8,
          requireUppercase: true,
          requireNumbers: true,
          requireSymbols: false,
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          enable2FA: false,
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
          pushEnabled: true,
          emailFrom: 'noreply@pranamhms.com',
        },
        system: {
          maintenanceMode: false,
          backupFrequency: 'daily',
          maxFileUploadSize: 10,
          enableAuditLogs: true,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<SystemSettings>) => {
    try {
      await settingsApi.updateSettings(newSettings);
      await fetchSettings(); // Refresh settings after update
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  const refreshSettings = async () => {
    await fetchSettings();
  };

  useEffect(() => {
    // Skip fetching settings on login page
    if (typeof window !== 'undefined' && window.location.pathname === '/admin/login') {
      setLoading(false);
      return;
    }
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};