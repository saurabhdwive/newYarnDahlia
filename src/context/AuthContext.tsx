import * as React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode } from 'react';
//   login: (token: string) => void;
//   logout: () => void;
// };

// export const AuthContext = createContext<AuthContextType>({
//   isLoggedIn: false,
//   login: () => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const checkToken = async () => {
//       const token = await AsyncStorage.getItem('userToken');
//       setIsLoggedIn(!!token);
//     };
//     checkToken();
//   }, []);

//   const login = async (token: string) => {
//     await AsyncStorage.setItem('userToken', token);
//     setIsLoggedIn(true);
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem('userToken');
//     setIsLoggedIn(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


type AuthContextType = {
  isLoggedIn: boolean;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('userToken');
      // console.log('qwerty ;=>>>>>>>>>>>>>>',token)
      setIsLoggedIn(!!token);
       console.log('qwerty ;=>>>>>>>>>>>>>>',isLoggedIn)
       console.log('Token found:', !!token);
      setLoading(false);
    };
    checkToken();
  }, []);

  const login = async (token: string) => {
    console.log('🔍 AuthContext: login function called with token:', token);
    try {
      await AsyncStorage.setItem('userToken', token);
      console.log('✅ AuthContext: Token saved to AsyncStorage');
      setIsLoggedIn(true);
      console.log('✅ AuthContext: isLoggedIn set to true');
    } catch (error) {
      console.error('❌ AuthContext: Error in login function:', error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
