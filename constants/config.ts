// constants/config.ts

export const CONFIG = {
  DEFAULT_BACKEND_URL: 'http://192.168.1.100:5000',
  API_TIMEOUT: 3000,
  POLLING_INTERVAL_MS: 2000,
  MOCK_DELAY_MS: 300,
  VOICE_COMMANDS: {
    ON: ['light on', 'turn on', 'on'],
    OFF: ['light off', 'turn off', 'off'],
    AUTO: ['auto mode', 'auto', 'automatic'],
  },
} as const;

export const STATUS_COLORS = {
  ON: '#22c55e',
  OFF: '#ef4444',
  AUTO: '#3b82f6',
} as const;