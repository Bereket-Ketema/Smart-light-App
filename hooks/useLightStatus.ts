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

  // Fetch status only on connection change, not automatically polling
  useEffect(() => {
    if (!isConnected || useMock) return;
    
    // Only fetch once when connection is established
    fetchStatus();
  }, [isConnected, useMock]);

  return { lightStatus, setLightStatus, mode, setMode, lastUpdated, fetchStatus };
}