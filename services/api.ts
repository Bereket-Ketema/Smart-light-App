// services/api.ts

const BASE_URL = 'http://192.168.1.100:5000';

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

// ========== Turn Light On ==========
export const turnLightOn = async (baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: turnLightOn - URL:', `${url}/light/on`);
  
  try {
    const response = await fetch(`${url}/light/on`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('📥 API Response: turnLightOn - Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: turnLightOn - Data:', data);
    return { status: data.data.power, mode: data.data.mode };
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
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('📥 API Response: turnLightOff - Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: turnLightOff - Data:', data);
    return { status: data.data.power, mode: data.data.mode };
  } catch (error) {
    console.log('❌ API Error: turnLightOff -', error);
    throw error;
  }
};

// ========== Auto Mode (via voice command endpoint) ==========
export const setAutoMode = async (baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: setAutoMode - URL:', `${url}/voice/command`);
  
  try {
    const response = await fetch(`${url}/voice/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: 'auto mode' }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: setAutoMode - Full Data:', JSON.stringify(data, null, 2));
    
    // Handle different response structures
    let power = '';
    let mode = '';
    
    if (data.data?.state) {
      power = data.data.state.power;
      mode = data.data.state.mode;
    } else if (data.data?.power !== undefined) {
      power = data.data.power;
      mode = data.data.mode;
    } else {
      power = data.data?.status || 'off';
      mode = data.data?.mode || 'auto';
    }
    
    console.log('📤 Parsed - power:', power, 'mode:', mode);
    
    return { status: power, mode: mode };
  } catch (error) {
    console.log('❌ API Error: setAutoMode -', error);
    throw error;
  }
};

// ========== Get Light Status ==========
export const getLightStatus = async (baseUrl?: string): Promise<StatusResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: getLightStatus - URL:', `${url}/light/status`);
  
  try {
    const response = await fetch(`${url}/light/status`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    console.log('📥 API Response: getLightStatus - Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: getLightStatus - Data:', data);
    return {
      status: data.data.power,
      mode: data.data.mode,
      brightness: data.data.brightness,
      sensitivity: data.data.sensitivity,
      timer: data.data.timer,
    };
  } catch (error) {
    console.log('❌ API Error: getLightStatus -', error);
    throw error;
  }
};

// ========== Send Voice Command ==========
export const sendVoiceCommand = async (command: string, baseUrl?: string): Promise<VoiceCommandResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: sendVoiceCommand - URL:', `${url}/voice/command`);
  console.log('📤 API Call: sendVoiceCommand - Command:', command);
  
  try {
    const response = await fetch(`${url}/voice/command`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command: command.toLowerCase() }),
    });

    console.log('📥 API Response: sendVoiceCommand - Status:', response.status);
    
    if (!response.ok) {
      // Get error details from response
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Backend error details:', errorData);
      throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('✅ API Success: sendVoiceCommand - Full Data:', JSON.stringify(data, null, 2));
    
    let power = '';
    let mode = '';
    
    if (data.data?.state) {
      power = data.data.state.power;
      mode = data.data.state.mode;
    } else if (data.data?.power !== undefined) {
      power = data.data.power;
      mode = data.data.mode;
    } else {
      power = data.data?.status || 'off';
      mode = data.data?.mode || 'auto';
    }
    
    console.log('📤 Parsed - power:', power, 'mode:', mode);
    
    return {
      status: power,
      mode: mode,
      command: command,
    };
  } catch (error) {
    console.log('❌ API Error: sendVoiceCommand -', error);
    throw error;
  }
};

// ========== Send Motion Data ==========
export const sendMotionData = async (motionDetected: boolean, baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: sendMotionData - URL:', `${url}/bridge/motion-event`);
  
  try {
    const response = await fetch(`${url}/bridge/motion-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ detected: motionDetected }),
    });

    console.log('📥 API Response: sendMotionData - Status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: sendMotionData - Data:', data);
    return { status: data.data.power, mode: data.data.mode };
  } catch (error) {
    console.log('❌ API Error: sendMotionData -', error);
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
      headers: { 'Content-Type': 'application/json' },
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

// ========== Advanced Controls (for control.tsx) ==========
export const setBrightness = async (brightness: number, baseUrl?: string): Promise<{ brightness: number }> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: setBrightness - URL:', `${url}/brightness`);
  console.log('📤 API Call: setBrightness - Value:', brightness);
  
  try {
    const response = await fetch(`${url}/brightness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ brightness }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: setBrightness - Data:', data);
    return { brightness: data.data.brightness };
  } catch (error) {
    console.log('❌ API Error: setBrightness -', error);
    throw error;
  }
};


export const setSensitivity = async (sensitivity: string, baseUrl?: string): Promise<{ sensitivity: string }> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: setSensitivity - URL:', `${url}/sensitivity`);
  console.log('📤 API Call: setSensitivity - Value:', sensitivity);
  
  try {
    const response = await fetch(`${url}/sensitivity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sensitivity }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: setSensitivity - Data:', data);
    return { sensitivity: data.data.sensitivity };
  } catch (error) {
    console.log('❌ API Error: setSensitivity -', error);
    throw error;
  }
};

export const setTimer = async (timer: number, baseUrl?: string): Promise<{ timer: number }> => {
  const url = baseUrl || BASE_URL;
  console.log('📤 API Call: setTimer - URL:', `${url}/timer`);
  console.log('📤 API Call: setTimer - Value:', timer);
  
  try {
    const response = await fetch(`${url}/timer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timer }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ API Success: setTimer - Data:', data);
    return { timer: data.data.timer };
  } catch (error) {
    console.log('❌ API Error: setTimer -', error);
    throw error;
  }
};