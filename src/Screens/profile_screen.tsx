import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, SafeAreaView, Image, Animated, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/rootStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n'; // make sure path is correct

type PhoneNumberScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MainStack'
>;
function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}
export default function ProfileScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<PhoneNumberScreenNavigationProp>();
  const [language, setLanguage] = useState(t(i18n.language) || 'English');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const animation = useRef(new Animated.Value(0)).current; // height control
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: dropdownOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: false, // height & opacity → false
    }).start();
  }, [dropdownOpen]);

  const height = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80], // adjust based on expected dropdown size
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handlePrivacyPolicy = () => {
    navigation.navigate('WebViewScreen', {
      url: 'https://askdahlia.ai/privacy.html',
    });
  };
  const customerservice = () => {
    navigation.navigate('WebViewScreen', {
      url: 'https://askdahlia.ai/support.html',
    });
  };

  const handleTerms = () => {
    navigation.navigate('WebViewScreen', {
      url: 'https://www.foodie24x7.com/Home/merchantterms',
    });
  };

  const handleDeleteAccount = () => {
    navigation.navigate('WebViewScreen', {
      url: 'https://www.foodie24x7.com/home/deleteaccount',
    });
  };

  const handlelogout = async () => {
    await logout();
    navigation.replace('AuthStack'); 
  };

  const languages = [
    { label: 'English', code: 'en' },
    { label: 'ไทย (Thai)', code: 'th' },
  ];
  // const isFocused = useIsFocused();
  
  //   useEffect(() => {
  //     if (isFocused) {
      
  //       StatusBar.setBarStyle('light-content');
  //       StatusBar.setBackgroundColor('grey');
  //     }
  //   }, [isFocused]);

  return (
    <>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="grey" />
    <LinearGradient
      colors={['rgb(246,248,260,1)', 'rgb(242,219,218,0.2)']}
      locations={[0.4, 0.5]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, width: '100%' }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* <StatusBar barStyle="light-content" backgroundColor="grey" /> */}
        <View style={styles.container}>
          {/* Profile Header */}
          <Text style={styles.header}>{t('profile')}</Text>

          <TouchableOpacity style={styles.optionButton} onPress={customerservice}>
            <Image height={24} width={24} resizeMode='contain' source={require('../../assets/images/support.png')} style={{ height: 24, width: 24 }} />
            <Text style={styles.optionText}> {t('customer_service')}</Text>
          </TouchableOpacity>

          {/* Language Dropdown */}
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={() => setDropdownOpen(!dropdownOpen)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 6, gap: 8 }}>
                <Image height={24} width={24} resizeMode='contain' source={require('../../assets/images/internet.png')} style={{ height: 24, width: 24 }} />
                <Text style={styles.optionText}>{language}</Text>
              </View>
              <Text style={styles.dropdownArrow}>{dropdownOpen ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            <Animated.View style={[styles.dropdownList, { height, opacity, overflow: 'hidden' }]}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setLanguage(lang.label);
                    i18n.changeLanguage(lang.code); // change app language
                    setDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </View>

          {/* Privacy Policy Button */}
          <TouchableOpacity style={styles.optionButton} onPress={handlePrivacyPolicy}>
            <Image height={24} width={24} resizeMode='contain' source={require('../../assets/images/privacypoliccyyy.png')} style={{ height: 24, width: 24 }} />
            <Text style={styles.optionText}>{t('privacy_policy')}</Text>
          </TouchableOpacity>

          {/* Terms & Conditions Button */}
          <TouchableOpacity style={styles.optionButton} onPress={handleTerms}>
            <Image height={24} width={24} resizeMode='contain' source={require('../../assets/images/termcondition.png')} style={{ height: 24, width: 24 }} />
            <Text style={styles.optionText}>{t('terms_conditions')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handlelogout}>
            <Image height={24} width={24} resizeMode='contain' source={require('../../assets/images/exit.png')} style={{ height: 24, width: 24, tintColor: 'white' }} />
            <Text style={styles.deleteText}> {t('log_out')}</Text>
          </TouchableOpacity>

          {/* Delete Account Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Image height={24} width={24} resizeMode='contain' source={require('../../assets/images/deleteaccount.png')} style={{ height: 24, width: 24, tintColor: 'white' }} />
            <Text style={styles.deleteText}>{t('delete_account')}</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  dropdownWrapper: {
    marginBottom: 10,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderColor: '#ddd',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#888',
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginTop: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  optionButton: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgb(176,35,24,1)',
    paddingVertical: 15,
    paddingHorizontal: 45,
    borderRadius: 12,
    marginTop: 40,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgb(176,35,24,1)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 15,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#ff4d4d',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});
