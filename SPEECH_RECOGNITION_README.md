# Speech Recognition Implementation

This project now includes speech-to-text functionality using `@react-native-voice/voice` library.

## Features

- **Real-time Speech Recognition**: Convert spoken words to text in real-time
- **Permission Management**: Automatic microphone permission handling for both iOS and Android
- **Modern UI**: Clean, intuitive interface with visual feedback
- **Error Handling**: Comprehensive error handling and user feedback
- **Cross-platform**: Works on both iOS and Android

## Components

### SpeechRecognition Component
Located at `components/SpeechRecognition.tsx`

**Props:**
- `onTextReceived?: (text: string) => void` - Callback function when text is recognized

**Features:**
- Start/Stop listening buttons
- Real-time transcription display
- Error handling and display
- Permission management
- Clear text functionality

### Main App
Updated `App.tsx` to include:
- Speech recognition component
- Transcription history display
- Modern, responsive UI

## Setup Instructions

### 1. Dependencies Installed
```bash
npm install @react-native-voice/voice react-native-permissions --legacy-peer-deps
```

### 2. iOS Setup
```bash
cd ios
pod install
cd ..
```

### 3. Permissions
The app automatically handles microphone permissions:
- **iOS**: Added `NSMicrophoneUsageDescription` and `NSSpeechRecognitionUsageDescription` to `Info.plist`
- **Android**: `RECORD_AUDIO` permission already present in `AndroidManifest.xml`

### 4. Configuration
- `react-native.config.js` created for proper library linking
- TypeScript interfaces included for type safety

## Usage

1. **Launch the app** - The speech recognition interface will be displayed
2. **Grant permissions** - Allow microphone access when prompted
3. **Start listening** - Tap "Start Listening" button
4. **Speak clearly** - Speak into the device microphone
5. **View results** - Recognized text appears in real-time
6. **Stop listening** - Tap "Stop Listening" to end recognition
7. **Clear text** - Use "Clear" button to reset the display

## Technical Details

### Speech Recognition Flow
1. User taps "Start Listening"
2. Permission check/request
3. Voice recognition starts
4. Audio processing and transcription
5. Results displayed in real-time
6. User can stop or continue

### Error Handling
- Permission denied scenarios
- Speech recognition errors
- Network connectivity issues
- Platform-specific limitations

### Supported Languages
Currently configured for English (en-US). Can be modified in the `Voice.start()` call.

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Go to device Settings > Privacy > Microphone
   - Enable permission for the app

2. **No Audio Input**
   - Check device microphone settings
   - Ensure no other apps are using the microphone

3. **Poor Recognition Quality**
   - Speak clearly and at normal volume
   - Reduce background noise
   - Ensure good internet connection (for cloud-based recognition)

4. **Build Errors**
   - Clean build: `cd android && ./gradlew clean` or `cd ios && xcodebuild clean`
   - Reinstall pods: `cd ios && pod install`

### Platform-Specific Notes

**iOS:**
- Requires iOS 10.0+
- Uses native Speech framework
- Works offline for basic recognition

**Android:**
- Requires Android 6.0+ (API 23+)
- Uses Google's speech recognition service
- Requires internet connection for best results

## Future Enhancements

- Multiple language support
- Custom vocabulary training
- Audio recording and playback
- Export transcriptions
- Voice commands integration
- Offline recognition models

## Dependencies

- `@react-native-voice/voice`: Core speech recognition functionality
- `react-native-permissions`: Permission management
- `react-native`: Core framework

## License

This implementation follows the same license as the main project.

