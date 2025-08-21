import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import Voice, {
  SpeechResultsEvent,
  SpeechErrorEvent,
} from '@react-native-voice/voice';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

interface SpeechRecognitionProps {
  onTextReceived?: (text: string) => void;
}

const SpeechRecognition: React.FC<SpeechRecognitionProps> = ({
  onTextReceived,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize voice recognition
    Voice.onSpeechStart = () => setIsListening(true);
    Voice.onSpeechEnd = () => setIsListening(false);
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        const text = e.value[0];
        setRecognizedText(text);
        onTextReceived?.(text);
      }
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setError(e.error?.message || 'Speech recognition error');
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [onTextReceived]);

  const checkPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.MICROPHONE,
        android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      });

      if (!permission) {
        Alert.alert('Error', 'Platform not supported');
        return false;
      }

      const result = await check(permission);
      
      if (result === RESULTS.UNAVAILABLE) {
        Alert.alert('Error', 'Microphone permission not available');
        return false;
      }
      
      if (result === RESULTS.DENIED) {
        const permissionResult = await request(permission);
        if (permissionResult !== RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'Microphone permission is required for speech recognition');
          return false;
        }
      }
      
      if (result === RESULTS.BLOCKED) {
        Alert.alert('Permission Blocked', 'Please enable microphone permission in settings');
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Permission check failed:', err);
      return false;
    }
  };

  const startListening = async () => {
    try {
      setError('');
      setRecognizedText('');
      
      const hasPermission = await checkPermission();
      if (!hasPermission) return;

      await Voice.start('en-US');
    } catch (err) {
      console.error('Error starting voice recognition:', err);
      setError('Failed to start voice recognition');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (err) {
      console.error('Error stopping voice recognition:', err);
    }
  };

  const clearText = () => {
    setRecognizedText('');
    setError('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Speech Recognition</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isListening && styles.buttonListening]}
          onPress={isListening ? stopListening : startListening}
        >
          <Text style={styles.buttonText}>
            {isListening ? 'Stop Listening' : 'Start Listening'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.clearButton]}
          onPress={clearText}
        >
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : null}

      {recognizedText ? (
        <View style={styles.textContainer}>
          <Text style={styles.label}>Recognized Text:</Text>
          <Text style={styles.recognizedText}>{recognizedText}</Text>
        </View>
      ) : null}

      {isListening && (
        <View style={styles.listeningContainer}>
          <Text style={styles.listeningText}>Listening...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    margin: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonListening: {
    backgroundColor: '#FF3B30',
  },
  clearButton: {
    backgroundColor: '#8E8E93',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#D70015',
    textAlign: 'center',
  },
  textContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  recognizedText: {
    fontSize: 18,
    color: '#007AFF',
    lineHeight: 24,
  },
  listeningContainer: {
    alignItems: 'center',
    padding: 10,
  },
  listeningText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
});

export default SpeechRecognition;

