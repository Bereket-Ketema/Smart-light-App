// types/index.ts

export interface LightStatusResponse {
  status: 'on' | 'off';
  mode: 'auto' | 'manual';
  lastMotion?: string;
}

export interface ApiError {
  message: string;
  code?: number;
}

export interface VoiceCommandResponse {
  status: 'on' | 'off';
  mode: 'auto' | 'manual';
  command: string;
}

export interface MotionData {
  motion: boolean;
  timestamp?: string;
}