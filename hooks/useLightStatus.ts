// hooks/useLightStatus.ts

import { useState, useEffect, useCallback } from 'react';
import { getLightStatus } from '@/services/api';
import { CONFIG } from '@/constants/config';

export function useLightStatus(backendUrl: string, isConnected: boolean, useMock: boolean) {
  const [lightStatus, setLightStatus] = useState<'on' | 'off'>('off');
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStatus = useCallback(async () => {
    if (useMock) {
      setLastUpdated(new Date());
      return;
    }
    
    if (!isConnected) return;
    
    try {
      const response = await getLightStatus(backendUrl);
      setLightStatus(response.status as 'on' | 'off');
      setMode(response.mode as 'auto' | 'manual');
      setLastUpdated(new Date());
    } catch (error) {
      // Silent fail
    }
  }, [backendUrl, isConnected, useMock]);

  useEffect(() => {
    if (!isConnected || useMock) return;
    
    fetchStatus();
    
    const interval = setInterval(fetchStatus, CONFIG.POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isConnected, useMock, fetchStatus]);

  return { lightStatus, setLightStatus, mode, setMode, lastUpdated, fetchStatus };
}