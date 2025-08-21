// src/navigation/RootStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../Screens/SplashScreen';
import AuthStack from './AuthStack';
import MainStack from './MainStack';

export type RootStackParamList = {
  Splash: undefined;
  AuthStack: undefined;
  MainStack: undefined;
};

const Stack = createNativeStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="MainStack" component={MainStack} />
    </Stack.Navigator>
  );
}
