// import React, {useState} from 'react';
// import {View, Text, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
// import SpeechRecognition from './components/SpeechRecognition';

// console.log('App.tsx: Starting speech recognition app');

// const App = () => {
//   console.log('App.tsx: Component rendering');
//   const [transcribedText, setTranscribedText] = useState<string>('');
  
//   const handleTextReceived = (text: string) => {
//     setTranscribedText(text);
//   };
  
//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <View style={styles.header}>
//           <Text style={styles.title}>Dahlia</Text>
//           <Text style={styles.subtitle}>Speech to Text App</Text>
//         </View>
        
//         <SpeechRecognition onTextReceived={handleTextReceived} />
        
//         {transcribedText ? (
//           <View style={styles.transcriptionContainer}>
//             <Text style={styles.transcriptionLabel}>Latest Transcription:</Text>
//             <Text style={styles.transcriptionText}>{transcribedText}</Text>
//           </View>
//         ) : (
//           <View style={styles.placeholderContainer}>
//             <Text style={styles.placeholderText}>
//               Tap "Start Listening" to begin speech recognition
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 20,
//   },
//   header: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 30,
//     paddingHorizontal: 20,
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     color: '#FFFFFF',
//     fontSize: 36,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     color: '#FFFFFF',
//     fontSize: 18,
//     opacity: 0.9,
//   },
//   transcriptionContainer: {
//     backgroundColor: '#FFFFFF',
//     margin: 20,
//     padding: 20,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   transcriptionLabel: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#333',
//   },
//   transcriptionText: {
//     fontSize: 20,
//     color: '#007AFF',
//     lineHeight: 28,
//     textAlign: 'center',
//   },
//   placeholderContainer: {
//     backgroundColor: '#FFFFFF',
//     margin: 20,
//     padding: 40,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: '#8E8E93',
//     textAlign: 'center',
//     lineHeight: 24,
//   },
// });

// export default App;


// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import SplashScreen from './src/Screens/SplashScreen';
// import PhoneNumberScreen from './src/Screens/PhoneNumberScreen'; // default import!
// import HomeScreen from './src/Screens/HomeScreen';
// import PromptScreen from './src/Screens/PromptScreen';
// import PromotionScreen from './src/Screens/promotion/promotion';
// import BottomTabs from './src/Screens/bottomtabs/bottom_tabs';
// import WebViewScreen from './src/Screens/webview_screen';
// import './src/i18n'; // <-- important: this initializes i18next

// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { StatusBar } from 'react-native';
// import { AuthProvider } from './src/context/AuthContext';

export type RootStackParamList = {
  Splash: undefined;
  PhoneNumber: undefined;
  HomeScreen: undefined;
  PromptScreen: undefined;
  WebViewScreen: { url: string; title?: string };
};

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const App = () => {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <StatusBar barStyle="dark-content" backgroundColor="#fff" />
//       <AuthProvider>
//       <NavigationContainer>

//         <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
//           <Stack.Screen name="Splash" component={SplashScreen} />
//           <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
//           <Stack.Screen name="HomeScreen" component={BottomTabs} />
//           <Stack.Screen name="PromptScreen" component={PromptScreen} />
//           <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{
//             headerShown: true,
//             title: '',
//             headerBackTitleVisible: false,
//           }} />
//         </Stack.Navigator>
//       </NavigationContainer>
//       </AuthProvider>
//     </GestureHandlerRootView>
//   );
// };

// export default App;


import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';
import RootStack from './src/navigation/rootStack';
import './src/i18n'; // <-- important: this initializes i18next

// const AppContent = () => {
//   const { isLoggedIn } = useContext(AuthContext);

//   return (
//     // <NavigationContainer>
//     //   {isLoggedIn ? <MainStack /> : <AuthStack />}
//     // </NavigationContainer>
//   );
// };

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="grey" />
      <AuthProvider>
        {/* <AppContent /> */}
          
        <NavigationContainer>
          <RootStack/>
        </NavigationContainer>
         
      </AuthProvider>
    </GestureHandlerRootView>
  );
};

export default App;