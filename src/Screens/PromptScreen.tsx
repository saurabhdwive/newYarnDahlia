// import { useNavigation } from '@react-navigation/native';
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import Voice2Text from 'react-native-voice2text';

// interface SpeechToTextProps {
//   onTextChange?: (text: string) => void;
//   style?: any;
// }

// const PromptScreen: React.FC<SpeechToTextProps> = ({ onTextChange, style }) => {
//   const navigation = useNavigation();
//   const [isListening, setIsListening] = useState(false);
//   const [recognizedText, setRecognizedText] = useState('');
//   const [lastPartial, setLastPartial] = useState('');
//   const [status, setStatus] = useState('Ready to listen');
//   const [hasPermission, setHasPermission] = useState(false);
//   const [finalReceived, setFinalReceived] = useState(false);

//   // 🔹 Setup permissions & listeners once
//   // const [finalReceived, setFinalReceived] = useState(false);
//     // const [finalReceived, setFinalReceived] = useState(false);
// const [manuallyStopped, setManuallyStopped] = useState(false);

// useEffect(() => {
//   console.log("🔎 Checking permissions...");
//   checkPermissions();

//   console.log("👂 Setting up event listeners. Available methods:", Object.keys(Voice2Text));

//   const unsubscribeResults = Voice2Text.onResults((results: any) => {
//     console.log("📥 onResults fired:", results);
//     if (results?.text || (results?.length && results[0])) {
//       const text = results.text || results[0];
//       setRecognizedText(text);
//       if (onTextChange) onTextChange(text);
//       setStatus("✅ Final result received!");
//       setFinalReceived(true);
//     }
//   });

//   const unsubscribePartial = Voice2Text.onPartialResults((partial: any) => {
//     console.log("📝 onPartialResults fired:", partial);
//     if (partial?.partialText) {
//       setRecognizedText(partial.partialText);
//       setStatus("Listening (partial result)...");
//       if (onTextChange) onTextChange(partial.partialText);
//     }
//   });

//   const unsubscribeError = Voice2Text.onError((err: any) => {
//     console.error("🚨 onError fired:", err);

//     if (err.code === 5) {
//       if (manuallyStopped) {
//         console.log("ℹ️ Ignored error 5 (manual stop)");
//         return; // ✅ ignore error when user stopped
//       }
//       if (finalReceived) {
//         console.log("⚠️ Ignored error 5 (already got final result)");
//         return;
//       }
//       setStatus("Stopped with last partial result.");
//     } else {
//       setStatus("Error: " + JSON.stringify(err));
//     }
//   });

//   const unsubscribeStart = Voice2Text.onSpeechStart(() => {
//     console.log("🎙️ onSpeechStart fired");
//     setStatus("Speech started...");
//     setFinalReceived(false);
//     setManuallyStopped(false);
//   });

//   const timer = setTimeout(() => {
//     if (hasPermission) {
//       console.log("⏳ Auto-starting listening after 2 seconds...");
//       startListening();
//     }
//   }, 2000);

//   return () => {
//    console.log("🧹 Cleaning up listeners & shutting down recognizer");
//   unsubscribeResults?.();
//   unsubscribePartial?.();
//   unsubscribeError?.();
//   unsubscribeStart?.();

//   // ✅ Proper shutdown order
//    clearTimeout(timer); // 👈 Clear timeout if user leaves before 2s
//    stopListening()
//   Voice2Text.stopListening().catch(() => {});
//   Voice2Text.cancelListening().catch(() => {}); // <– force release mic
//   Voice2Text.destroy().catch(() => {});
//   };
// }, [hasPermission]); // 👈 re-run if permission state changes


//   const checkPermissions = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
//           {
//             title: 'Microphone Permission',
//             message: 'This app needs access to your microphone to record speech.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           }
//         );
//         console.log("🎤 Permission result:", granted);
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           setHasPermission(true);
//           setStatus('Permission granted. Ready to listen.');
//         } else {
//           setHasPermission(false);
//           setStatus('Microphone permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//         setHasPermission(false);
//         setStatus('Error checking permissions');
//       }
//     } else {
//       setHasPermission(true);
//     }
//   };



// const startListening = async () => {
//   setStatus("Starting...");
//   setRecognizedText("");
//   setFinalReceived(false);
//   setManuallyStopped(false); // reset stop flag
//   try {
//     const started = await Voice2Text.startListening("en-US");
//     console.log("▶️ startListening returned:", started);
//     if (started) setStatus("Listening...");
//   } catch (e) {
//     console.error("❌ startListening error:", e);
//     setStatus("Error starting listening");
//   }
// };

// const stopListening = async () => {
//   console.log("⏹ stopListening pressed");
//   setManuallyStopped(true); // mark as manual stop
//   try {
//     await Voice2Text.stopListening();
//     console.log("✅ stopListening success");
//     setStatus("Stopped by user");
//   } catch (e) {
//     console.error("❌ stopListening error:", e);
//     setStatus("Error stopping listening");
//   }
// };

//   const clearText = () => {
//     setRecognizedText('');
//     setLastPartial('');
//     setFinalReceived(false);
//     if (onTextChange) onTextChange('');
//     setStatus('Text cleared. Ready to listen.');
//   };

//   return (
//     <View style={[styles.container, style]}>
//       <Text style={styles.title}>🎤 Speech to Text</Text>

//       <Text style={styles.status}>{status}</Text>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           style={[styles.button, styles.startButton, isListening && styles.disabledButton]}
//           onPress={startListening}
//           disabled={isListening || !hasPermission}
//         >
//           <Text style={styles.buttonText}>
//             {isListening ? 'Listening...' : 'Start Listening'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={[styles.button, styles.clearButton]}
//         onPress={clearText}
//         disabled={!recognizedText}
//       >
//         <Text style={styles.buttonText}>Clear Text</Text>
//       </TouchableOpacity>

//       <View style={styles.textContainer}>
//         <Text style={styles.label}>Recognized Text:</Text>
//         <Text style={styles.recognizedText}>
//           {recognizedText || 'No speech detected yet...'}
//         </Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     margin: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   status: {
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 20,
//     padding: 10,
//     backgroundColor: '#e8f4fd',
//     borderRadius: 8,
//     color: '#0066cc',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginBottom: 20,
//   },
//   button: {
//     paddingVertical: 12,
//     paddingHorizontal: 24,
//     borderRadius: 8,
//     minWidth: 120,
//     alignItems: 'center',
//   },
//   startButton: {
//     backgroundColor: '#4CAF50',
//   },
//   stopButton: {
//     backgroundColor: '#f44336',
//   },
//   clearButton: {
//     backgroundColor: '#FF9800',
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   disabledButton: {
//     backgroundColor: '#cccccc',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   textContainer: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 10,
//     color: '#333',
//   },
//   recognizedText: {
//     fontSize: 16,
//     lineHeight: 24,
//     color: '#666',
//     minHeight: 60,
//   },
// });

// export default PromptScreen;



import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Image,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
// Optional voice module: provide a safe fallback if not installed on this platform
// Avoid static import which would throw during bundle evaluation
const Voice2Text: any = (() => {
  try {
    const m = require("react-native-voice2text");
    return m?.default ?? m;
  } catch (_e) {
    return {
      startListening: async (_lang?: string) => false,
      stopListening: async () => { },
      cancelListening: async () => { },
      destroy: async () => { },
      onResults: (_cb: any) => () => { },
      onPartialResults: (_cb: any) => () => { },
      onError: (_cb: any) => () => { },
      onSpeechStart: (_cb: any) => () => { },
    };
  }
})();

interface SpeechToTextProps {
  onTextChange?: (text: string) => void;
  style?: any;
}

const PromptScreen: React.FC<SpeechToTextProps> = ({ onTextChange, style }) => {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Get the callback from navigation params
  const params = route.params as { onTextChange?: (text: string) => void };
  const textChangeCallback = params?.onTextChange || onTextChange;
  const [recognizedText, setRecognizedText] = useState("");
  const [status, setStatus] = useState("Ready to listen");
  const [finalReceived, setFinalReceived] = useState(false);
  const [manuallyStopped, setManuallyStopped] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasStartedListening, setHasStartedListening] = useState(false);
  const handleClose = () => {
    // Send the recognized text back to HomeScreen before navigating
    if (recognizedText && onTextChange && textChangeCallback) {
      console.log("📤 Sending recognized text back to HomeScreen before closing:", recognizedText);
      textChangeCallback(recognizedText);
    }
    
    // Navigate back to HomeScreen
    navigation.goBack();
  };
  const bg1 = require('../../assets/images/bg1.png');
  const bg2 = require('../../assets/images/bg2.png');
  const flowerImage = require('../../assets/images/dahlia.png');
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  useEffect(() => {
    console.log("🔎 Setting up event listeners...");
    
    // Reset state when component mounts
    setRecognizedText("");
    setStatus("Ready to listen");
    setFinalReceived(false);
    setManuallyStopped(false);
    setIsListening(false);
    setHasStartedListening(false);

    console.log("👂 Setting up event listeners. Available methods:", Object.keys(Voice2Text));

    const unsubscribeResults = Voice2Text.onResults((results: any) => {
      console.log("📥 onResults fired:", results);
      if (results?.text || (results?.length && results[0])) {
        const text = results.text || results[0];
        setRecognizedText(text);
        // Don't send text back immediately - only when screen closes
        setStatus("✅ Final result received!");
        setFinalReceived(true);
        setIsListening(false);
      }
    });

    const unsubscribePartial = Voice2Text.onPartialResults((partial: any) => {
      console.log("📝 onPartialResults fired:", partial);
      if (partial?.partialText) {
        setRecognizedText(partial.partialText);
        setStatus("Listening (partial result)...");
        // Don't send partial results back - only final result when closing
      }
    });

    const unsubscribeError = Voice2Text.onError((err: any) => {
      console.error("🚨 onError fired:", err);

      if (err.code === 5) {
        if (manuallyStopped) {
          console.log("ℹ️ Ignored error 5 (manual stop)");
          return; // ✅ ignore error when user stopped
        }
        if (finalReceived) {
          console.log("⚠️ Ignored error 5 (already got final result)");
          return;
        }
        setStatus("Stopped with last partial result.");
      } else {
        setStatus("Error: " + JSON.stringify(err));
      }
      setIsListening(false);
    });

    const unsubscribeStart = Voice2Text.onSpeechStart(() => {
      console.log("🎙️ onSpeechStart fired");
      setStatus("Speech started...");
      setFinalReceived(false);
      setManuallyStopped(false);
      setIsListening(true);
    });

    return () => {
      console.log("🧹 Cleaning up listeners & shutting down recognizer");
      unsubscribeResults?.();
      unsubscribePartial?.();
      unsubscribeError?.();
      unsubscribeStart?.();
      
      // Ensure proper cleanup of Voice2Text
      try {
        Voice2Text.stopListening().catch(() => {});
        // Voice2Text.cancelListening().catch(() => {});
        // Voice2Text.destroy().catch(() => {});
      } catch (error) {
        console.log("Error during Voice2Text cleanup:", error);
      }
    };
  }, []);

  // Add useFocusEffect to reinitialize speech recognition when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("🔄 Screen focused - reinitializing speech recognition...");
      
      // Reset state when screen comes into focus
      setRecognizedText("");
      setStatus("Ready to listen");
      setFinalReceived(false);
      setManuallyStopped(false);
      setIsListening(false);
      setHasStartedListening(false);
      
      // Check permissions and start listening when screen is focused
      setTimeout(() => {
        checkPermissions();
      }, 500); // Small delay to ensure proper initialization
      
      return () => {
        console.log("🔄 Screen unfocused - cleaning up speech recognition...");
        // Clean up when screen loses focus
        try {
          Voice2Text.stopListening().catch(() => {});
          Voice2Text.cancelListening().catch(() => {});
          setIsListening(false);
          setHasStartedListening(false);
        } catch (error) {
          console.log("Error during focus cleanup:", error);
        }
      };
    }, [])
  );

  const checkPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "This app needs access to your microphone to record speech.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        console.log("🎤 Permission result:", granted);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setStatus("Permission granted. Ready to listen.");

          // 👇 Auto-start after 2 seconds (only when permission granted and not already started)
          if (!hasStartedListening) {
            setTimeout(() => {
              console.log("⏳ Auto-starting listening after 2 seconds...");
              startListening();
            }, 2000);
          }
        } else {
          setStatus("Microphone permission denied");
        }
      } catch (err) {
        console.warn(err);
        setStatus("Error checking permissions");
      }
    } else {
      setStatus("iOS: Permission granted by default");

      // 👇 Auto-start on iOS too (only when not already started)
      if (!hasStartedListening) {
        setTimeout(() => {
          console.log("⏳ Auto-starting listening after 2 seconds...");
          startListening();
        }, 2000);
      }
    }
  };

  const startListening = async () => {
    // Prevent duplicate calls
    if (hasStartedListening || isListening) {
      console.log("🎤 Already listening or has started, skipping...");
      return;
    }

    console.log("🎤 Attempting to start listening...");
    setStatus("Starting...");
    setRecognizedText("");
    setFinalReceived(false);
    setManuallyStopped(false); // reset stop flag
    setHasStartedListening(true);
    
    try {
      // Ensure any previous session is properly stopped
      await Voice2Text.stopListening().catch(() => {});
      await Voice2Text.cancelListening().catch(() => {});
      
      const started = await Voice2Text.startListening("en-US");
      console.log("▶️ startListening returned:", started);
      if (started) {
        setStatus("Listening...");
        setIsListening(true);
        console.log("✅ Successfully started listening");
      } else {
        setStatus("Failed to start listening");
        setHasStartedListening(false);
        console.log("❌ startListening returned false");
      }
    } catch (e) {
      console.error("❌ startListening error:", e);
      setStatus("Error starting listening");
      setHasStartedListening(false);
      
      // Try to recover by attempting to restart after a short delay
      setTimeout(() => {
        console.log("🔄 Attempting to restart listening after error...");
        startListening();
      }, 1000);
    }
  };

  const stopListening = async () => {
    console.log("⏹ stopListening pressed");
    setManuallyStopped(true); // mark as manual stop
    try {
      await Voice2Text.stopListening();
      console.log("✅ stopListening success");
      setStatus("Stopped by user");
    } catch (e) {
      console.error("❌ stopListening error:", e);
      setStatus("Error stopping listening");
    }
  };

  const clearText = () => {
    setRecognizedText("");
    setFinalReceived(false);
    // Don't send cleared text back - only final result when closing
    setStatus("Text cleared. Ready to listen.");
  };

  // return (
  // <View style={[styles.container, style]}>
  {/* <Text style={styles.title}>🎤 Speech to Text</Text> */ }

  {/* <Text style={styles.status}>{status}</Text> */ }

  {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.startButton]}
          onPress={startListening}
        >
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.stopButton]}
          onPress={stopListening}
        >
          <Text style={styles.buttonText}>Stop</Text>
        </TouchableOpacity>
      </View> */}

  {/* <TouchableOpacity
        style={[styles.button, styles.clearButton]}
        onPress={clearText}
        disabled={!recognizedText}
      >
        <Text style={styles.buttonText}>Clear Text</Text>
      </TouchableOpacity> */}

  {/* <View style={styles.textContainer}>
        <Text style={styles.label}>Recognized Text:</Text>
        <Text style={styles.recognizedText}>
          {recognizedText || "No speech detected yet..."}
        </Text>
      </View> */}
  // </View>
  // );


  return (
    <LinearGradient
      colors={['rgb(246,248,260,1)', 'rgb(242,219,218,0.3)']}
      locations={[0.4, 0.5]} // 0 → start, 0.3 → 30% mark, 0.9 → 90% mark
      start={{ x: 0, y: 0 }}   // top-left
      end={{ x: 1, y: 1 }}     // bottom-right
      style={{ flex: 1, width: '100%' }}
    >
      <SafeAreaView style={styles.container}>
        {/* Close Button */}
        {/* <View style={{flexDirection:'row',justifyContent:'flex-start',alignContent:'flex-start'}}> */}


        <TouchableOpacity onPress={handleClose} style={[styles.closeButton, {

          position: 'absolute',
          top: insets.top + 10, // adds padding for notch
          left: 20
        }]}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        {/* </View> */}
        {/* Prompt Text - Shows welcome text initially, then recognized text */}
        <Text style={styles.promptText}>
          {recognizedText ? recognizedText : `${t('hey_tell_me')}\n${t('like_eating_today')}`}
        </Text>
        
        {/* Remove the separate recognized text container since we're showing it in the main prompt text */}

        {/* Background Blur Circles */}
        <View style={[styles.blurContainer, { marginLeft: 80, justifyContent: 'center', alignContent: 'center', alignSelf: 'center', alignItems: 'center', marginTop: 50 }]}>
          {/* <View style={styles.blueBlur} />
        <View style={styles.redBlur} /> */}

          <Image height={200} width={160} source={bg2} style={{
            position: 'absolute',
            height: 400, width: 300, resizeMode: 'contain', transform: [
              { translateX: -100 },
              { translateY: -100 }
            ]
          }} />
          <Image height={200} width={160} source={bg1} style={{
            // position:'relative',
            // position: 'absolute',
            // right: 50,
            height: 400, width: 300, resizeMode: 'contain',
            transform: [{ translateX: 0 }, { rotate: '0deg' }]
          }} />


          {/* <Images
    source={flowerImage}
    style={{
      height: 400,
      width: 400,
      resizeMode: 'contain',
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
    }}
  /> */}

          {/* <View style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', zIndex: 10 }]}> */}
          {/* <Image
    source={flowerImage}
    style={{
      height: 400,
      width: 400,
      resizeMode: 'contain',
    }}
  /> */}
        </View>
        {/* </View> */}

        {/* Listening Text */}
        <Text style={styles.listeningText}>{t('dahlia_listening')}</Text>

        {/* Red Circle Button */}
        <TouchableOpacity style={styles.stopButton} onPress={handleClose}>
          <Text style={styles.stopButtonText}>✕</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );

};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#F9F6F5',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  closeButton: {
    // justifyContent:'flex-start',
    // alignItems:'flex-start',
    // alignContent:'flex-start',
    // position: 'absolute',
    // top: 20,
    // left: 20,
    // zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#333',
  },
  promptText: {
    marginTop: 40,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111',
  },
  blurContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
    // marginTop: -40,
  },
  blueBlur: {
    position: 'absolute',
    width: 200,
    height: 200,
    // backgroundColor: 'rgba(86, 171, 255, 0.4)',
    borderRadius: 100,
    top: -30,
    left: -40,

  },
  redBlur: {
    position: 'absolute',
    width: 220,
    height: 220,
    // backgroundColor: 'rgba(255, 0, 0, 0.4)',
    borderRadius: 110,
    top: 30,
    right: -40,

  },
  listeningText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30,
  },
  stopButton: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // marginBottom: 30,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
    textContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
    recognizedText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    minHeight: 60,
  },
    label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
});

export default PromptScreen;


