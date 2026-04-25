# SmartSimLight - Mobile App

A React Native mobile application for controlling a simulation-based smart lighting system. This app integrates with a Flask backend and Tinkercad simulation to demonstrate motion-based automation and voice control.

## 📱 Features

| Feature | Description |
|---------|-------------|
| **Motion-Based Control** | Light turns on automatically when motion is detected (simulated) |
| **Manual Override** | Turn light on/off manually using buttons |
| **Auto Mode** | Switch to motion-controlled automatic mode |
| **Voice Commands** | Support for "light on", "light off", and "auto mode" (text input + voice recording) |
| **Mock Mode** | Test the app without a backend using simulated data |
| **Settings** | Configure backend server IP address |
| **Advanced Controls** | Brightness, motion sensitivity, auto-off timer, and activity history |
| **Connection Status** | Real-time indicator showing backend connection state |

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React Native (Expo) | Mobile app framework |
| TypeScript | Type safety |
| Expo Router | File-based navigation |
| AsyncStorage | Local persistence for settings |
| expo-audio | Voice recording for commands |
| Flask (Backend) | API server (separate repository) |

## 📋 Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo Go app on your phone (iOS/Android) or Android Studio/Xcode emulator
- Flask backend running (optional, mock mode available)

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/smart-light-mobile-app.git
cd smart-light-mobile-app
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start the App

```bash
npx expo start
```

### Step 4: Run on Device

- Scan the QR code with Expo Go (Android) or Camera app (iOS)
- Or press `a` for Android emulator / `i` for iOS simulator

## 📁 Project Structure

```
my-smartlight-app/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab navigation configuration
│   │   ├── index.tsx        # Home screen (main controls)
│   │   ├── control.tsx      # Advanced controls screen
│   │   └── settings.tsx     # Backend configuration screen
│   └── _layout.tsx          # Root layout
├── components/
│   ├── index/               # Home screen components
│   │   ├── Header.tsx
│   │   ├── LightStatus.tsx
│   │   ├── ControlButtons.tsx
│   │   ├── ErrorBanner.tsx
│   │   ├── ConnectionStatusBar.tsx
│   │   ├── EmptyState.tsx
│   │   └── MockToggle.tsx
│   ├── ControlHeader.tsx
│   ├── ConnectionStatusCard.tsx
│   ├── BrightnessControl.tsx
│   ├── MotionSensitivityControl.tsx
│   ├── AutoOffTimerControl.tsx
│   ├── CurrentStatusCard.tsx
│   ├── HistoryLog.tsx
│   ├── MockModeIndicator.tsx
│   └── SimpleVoiceRecorder.tsx  # Voice + text command input
├── services/
│   └── api.ts               # API calls to Flask backend
├── hooks/
│   └── useApi.ts            # Loading and error state management
├── constants/
│   └── config.ts            # App configuration values
├── types/
│   └── index.ts             # TypeScript interfaces
└── assets/                  # Images and fonts
```

## 🎮 Usage

### Connecting to Backend

1. Open the **Settings** tab
2. Enter your Flask backend IP address (e.g., `http://192.168.1.100:5000`)
3. Tap **Save**, then **Test Connection**

### Controlling the Light

| Method | Action |
|--------|--------|
| **On Button** | Turns light on immediately |
| **Off Button** | Turns light off immediately |
| **Auto Button** | Switches to motion-controlled mode |
| **Voice Command** | Tap voice button → type or speak command |

### Mock Mode

When no backend is available, enable **Mock Mode** to test the app with simulated data. The mock toggle button is at the bottom of the home screen.

### Voice Commands

| Command | Effect |
|---------|--------|
| `light on` or `turn on` | Turns light on |
| `light off` or `turn off` | Turns light off |
| `auto mode` or `auto` | Switches to auto mode |

## 🔧 Configuration

### Default Backend URL

Edit `constants/config.ts`:

```typescript
export const CONFIG = {
  DEFAULT_BACKEND_URL: 'http://192.168.1.100:5000',
  API_TIMEOUT: 3000,
  POLLING_INTERVAL_MS: 2000,
  MOCK_DELAY_MS: 300,
};
```

### Enable/Disable Mock Mode by Default

Edit `app/(tabs)/index.tsx`:

```typescript
const USE_MOCK_DATA = true;  // Change to false for real backend
```

## 📡 API Endpoints

The app expects the following endpoints from the Flask backend:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/status` | GET | Returns current light status and mode |
| `/light/on` | POST | Turns light on |
| `/light/off` | POST | Turns light off |
| `/mode/auto` | POST | Switches to auto mode |
| `/voice` | POST | Sends voice command text |
| `/motion` | POST | Receives motion detection data |

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to backend | Check that Flask server is running and phone/emulator is on the same WiFi network |
| Voice recording not working | Grant microphone permission in device settings |
| App crashes on start | Clear Metro cache: `npx expo start -c` |
| TypeScript errors | Run `npx tsc --noEmit` to see errors |


## 📄 License

This project is for academic purposes as part of the Integrated Engineering Team Project (IETP4202) at Adama Science and Technology University.

---

**Note:** This app is designed to work with a simulation-based backend. For full functionality, ensure the Flask backend and Tinkercad simulation are running.
