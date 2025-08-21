
// src/navigation/OrderStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AskMartynaScreen from '../Screens/HomeScreen';

export type OrderStackParamList = {
  AskMartynaScreen: { restaurantName?: string };
};

const Stack = createNativeStackNavigator<OrderStackParamList>();

export default function OrderStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AskMartynaScreen" component={AskMartynaScreen}/>
    </Stack.Navigator>
  );
}
