// services/api.ts

const BASE_URL = 'http://192.168.1.100:5000'; // Temporary default

interface ApiResponse {
  status: string;
  mode: string;
}

interface StatusResponse {
  status: string;
  mode: string;
  brightness?: number;
  sensitivity?: string;
  timer?: number;
}

interface VoiceCommandResponse {
  status: string;
  mode: string;
  command: string;
}

interface BrightnessResponse {
  brightness: number;
  status: string;
}

interface SensitivityResponse {
  sensitivity: string;
  status: string;
}

interface TimerResponse {
  timer: number;
  status: string;
}

// ========== Health Check ==========
export const healthCheck = async (baseUrl?: string): Promise<boolean> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

// ========== Light Status ==========
export const getLightStatus = async (baseUrl?: string): Promise<StatusResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: getLightStatus - URL:', `${url}/light/status`);
  
  try {
    const response = await fetch(`${url}/light/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 API Response: getLightStatus - Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: getLightStatus - Data:', data);
    return {
      status: data.status,
      mode: data.mode || 'manual',
      brightness: data.brightness,
      sensitivity: data.sensitivity,
      timer: data.timer,
    };
  } catch (error) {
    console.log('❌ API Error: getLightStatus -', error);
    throw error;
  }
};

// ========== Turn Light On ==========
export const turnLightOn = async (baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: turnLightOn - URL:', `${url}/light/on`);
  
  try {
    const response = await fetch(`${url}/light/on`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 API Response: turnLightOn - Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: turnLightOn - Data:', data);
    return { status: data.status, mode: data.mode || 'manual' };
  } catch (error) {
    console.log('❌ API Error: turnLightOn -', error);
    throw error;
  }
};

// ========== Turn Light Off ==========
export const turnLightOff = async (baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: turnLightOff - URL:', `${url}/light/off`);
  
  try {
    const response = await fetch(`${url}/light/off`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 API Response: turnLightOff - Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: turnLightOff - Data:', data);
    return { status: data.status, mode: data.mode || 'manual' };
  } catch (error) {
    console.log('❌ API Error: turnLightOff -', error);
    throw error;
  }
};

// ========== Auto Mode (You need to add this to backend) ==========
export const setAutoMode = async (baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: setAutoMode - URL:', `${url}/mode/auto`);
  
  try {
    const response = await fetch(`${url}/mode/auto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('📥 API Response: setAutoMode - Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: setAutoMode - Data:', data);
    return { status: data.status, mode: data.mode };
  } catch (error) {
    console.log('❌ API Error: setAutoMode -', error);
    throw error;
  }
};

// ========== Voice Command ==========
export const sendVoiceCommand = async (command: string, baseUrl?: string): Promise<VoiceCommandResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: sendVoiceCommand - URL:', `${url}/voice/command`);
  console.log('📤 API Call: sendVoiceCommand - Command:', command);
  
  try {
    const response = await fetch(`${url}/voice/command`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command: command.toLowerCase() }),
    });

    console.log('📥 API Response: sendVoiceCommand - Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: sendVoiceCommand - Data:', data);
    return {
      status: data.state?.power || data.status,
      mode: data.state?.mode || data.mode || 'manual',
      command: command,
    };
  } catch (error) {
    console.log('❌ API Error: sendVoiceCommand -', error);
    throw error;
  }
};

// ========== Motion Data (for simulation bridge) ==========
export const sendMotionData = async (motionDetected: boolean, baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/bridge/motion-event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ detected: motionDetected }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: data.status, mode: data.mode || 'manual' };
  } catch (error) {
    throw error;
  }
};

// ========== Motion Simulation (for testing) ==========
export const simulateMotion = async (motionDetected: boolean, baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/motion/simulate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ detected: motionDetected }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: data.status, mode: data.mode || 'manual' };
  } catch (error) {
    throw error;
  }
};

// ========== Set Brightness (Advanced Control) ==========
export const setBrightness = async (brightness: number, baseUrl?: string): Promise<BrightnessResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/brightness`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ brightness }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { brightness: data.brightness, status: data.status };
  } catch (error) {
    throw error;
  }
};

// ========== Set Motion Sensitivity (Advanced Control) ==========
export const setSensitivity = async (sensitivity: string, baseUrl?: string): Promise<SensitivityResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/sensitivity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sensitivity }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { sensitivity: data.sensitivity, status: data.status };
  } catch (error) {
    throw error;
  }
};

// ========== Set Auto-Off Timer (Advanced Control) ==========
export const setTimer = async (timer: number, baseUrl?: string): Promise<TimerResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/timer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ timer }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { timer: data.timer, status: data.status };
  } catch (error) {
    throw error;
  }
};

// ========== Test Connection ==========
export const testConnection = async (baseUrl?: string): Promise<boolean> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: testConnection - URL:', `${url}/light/status`);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${url}/light/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    console.log('✅ API Success: testConnection - Connected');
    return response.ok;
  } catch (error) {
    console.log('❌ API Error: testConnection -', error);
    return false;
  }
};