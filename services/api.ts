// services/api.ts

const BASE_URL = 'http://192.168.1.100:5000'; // Temporary default - will come from settings later

interface ApiResponse {
  status: string;
  mode: string;
}

interface StatusResponse {
  status: string;
  mode: string;
  lastMotion?: string;
}

interface VoiceCommandResponse {
  status: string;
  mode: string;
  command: string;
}

// 1. Turn Light On
export const turnLightOn = async (baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/light/on`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: data.status, mode: data.mode };
  } catch (error) {
    console.error('Failed to turn light on:', error);
    throw error;
  }
};

// 2. Turn Light Off
export const turnLightOff = async (baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/light/off`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: data.status, mode: data.mode };
  } catch (error) {
    console.error('Failed to turn light off:', error);
    throw error;
  }
};

// 3. Set Auto Mode
export const setAutoMode = async (baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/mode/auto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: data.status, mode: data.mode };
  } catch (error) {
    console.error('Failed to set auto mode:', error);
    throw error;
  }
};

// 4. Get Light Status
export const getLightStatus = async (baseUrl?: string): Promise<StatusResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { 
      status: data.status, 
      mode: data.mode,
      lastMotion: data.lastMotion 
    };
  } catch (error) {
    console.error('Failed to get light status:', error);
    throw error;
  }
};

// 5. Send Voice Command
export const sendVoiceCommand = async (command: string, baseUrl?: string): Promise<VoiceCommandResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/voice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command: command.toLowerCase() }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { 
      status: data.status, 
      mode: data.mode,
      command: command 
    };
  } catch (error) {
    console.error('Failed to send voice command:', error);
    throw error;
  }
};

// 6. Send Motion Data from Simulation Bridge
export const sendMotionData = async (motionDetected: boolean, baseUrl?: string): Promise<ApiResponse> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const response = await fetch(`${url}/motion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ motion: motionDetected }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { status: data.status, mode: data.mode };
  } catch (error) {
    console.error('Failed to send motion data:', error);
    throw error;
  }
};

// 7. Test Connection to Backend
export const testConnection = async (baseUrl?: string): Promise<boolean> => {
  const url = baseUrl || BASE_URL;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch(`${url}/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};