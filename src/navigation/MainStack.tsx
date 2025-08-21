// src/navigation/MainStack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from '../Screens/bottomtabs/bottom_tabs';
import PromptScreen from '../Screens/PromptScreen';
import WebViewScreen from '../Screens/webview_screen';

const Stack = createNativeStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={BottomTabs}/>
      <Stack.Screen name="PromptScreen" component={PromptScreen} />
      <Stack.Screen
        name="WebViewScreen"
        component={WebViewScreen}
        options={{
          // headerShown: true,
          // title: '',
        //   headerBackTitleVisible: false,
        }}
      />
    </Stack.Navigator>
  );
}

