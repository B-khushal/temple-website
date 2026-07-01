import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, useAuth } from './api';
import { useLocation } from 'react-router-dom';

export interface WebsiteSetting {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  visibilityMode: 'hide_completely' | 'disable_route_accessible';
  showOnlyLoggedIn: boolean;
  showOnlyHomepage: boolean;
  scheduleEnabled: boolean;
  scheduleStartDate?: string | null;
  scheduleEndDate?: string | null;
  festivalOnly: boolean;
  navaratriOnly: boolean;
  category: string;
  previewIcon: string;
  updatedAt: string;
}

interface VisibilityContextType {
  settings: Record<string, WebsiteSetting>;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  isSectionVisible: (key: string) => boolean;
}

const VisibilityContext = createContext<VisibilityContextType | undefined>(undefined);

export function VisibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, WebsiteSetting>>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const location = useLocation();

  const fetchVisibilitySettings = async () => {
    try {
      const res = await api.get('/api/settings/visibility');
      if (res.success && res.data) {
        const mapped: Record<string, WebsiteSetting> = {};
        res.data.forEach((s: WebsiteSetting) => {
          mapped[s.key] = s;
        });
        setSettings(mapped);
      }
    } catch (err) {
      console.error('Failed to load visibility settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisibilitySettings();
  }, [user]);

  const isSectionVisible = (key: string): boolean => {
    const setting = settings[key];
    if (!setting) return true;

    if (!setting.enabled) return false;

    if (setting.showOnlyLoggedIn && !user) {
      return false;
    }

    if (setting.showOnlyHomepage && location.pathname !== '/') {
      return false;
    }

    if (setting.scheduleEnabled && setting.scheduleStartDate && setting.scheduleEndDate) {
      const now = new Date();
      const start = new Date(setting.scheduleStartDate);
      const end = new Date(setting.scheduleEndDate);
      if (now < start || now > end) {
        return false;
      }
    }

    if (setting.festivalOnly) {
      const festivalSetting = settings['festival_enabled'];
      if (!festivalSetting || !festivalSetting.enabled) {
        return false;
      }
    }

    if (setting.navaratriOnly) {
      const festivalSetting = settings['festival_enabled'];
      if (!festivalSetting || !festivalSetting.enabled) {
        return false;
      }
    }

    return true;
  };

  return (
    <VisibilityContext.Provider value={{ settings, loading, refreshSettings: fetchVisibilitySettings, isSectionVisible }}>
      {children}
    </VisibilityContext.Provider>
  );
}

export function useVisibility() {
  const context = useContext(VisibilityContext);
  if (!context) {
    throw new Error('useVisibility must be used within a VisibilityProvider');
  }
  return context;
}
