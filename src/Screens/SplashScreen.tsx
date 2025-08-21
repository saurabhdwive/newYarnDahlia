import React, { useEffect,useContext } from 'react';
import { View, StyleSheet, Image, ImageBackground, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; // Make sure path is correct
import { RouteProp } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

type SplashScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Splash'>;
  route: RouteProp<RootStackParamList, 'Splash'>;
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  // const { isLoggedIn } = useContext(AuthContext);
  const { isLoggedIn, loading } = useContext(AuthContext);
  useEffect(() => {
    if (loading) return; // wait until AsyncStorage check finishes
    const timer = setTimeout(() => {
       if (!isLoggedIn) {
        navigation.replace('AuthStack');
      } else {
        navigation.replace('MainStack');
      }
      // navigation.replace('PhoneNumber');
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, isLoggedIn, navigation]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/dahlia.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: windowWidth,
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    position: 'absolute',
    // top: '50%',
    // left: '50%',
    // transform: [
    //   { translateX: -75 },
    //   { translateY: -75 },
    // ],
    zIndex: 10,
  },
  logo: {
    width: 300,
    height: 300,
  },
});
