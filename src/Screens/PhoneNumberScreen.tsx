import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  Animated,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentDateYYYYMMDD, sendOTP, verifyOTP } from '../api_functions/api_functions';
import { Alert } from 'react-native';
// @ts-ignore
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
// import i18n from '../i18n'
import { AuthContext } from '../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/rootStack';
import { useTranslation } from 'react-i18next';
import { LoginOTPRequest, LoginOTPResponse } from '../models/login_otp_model';
import { VerifyOTPRequest } from '../models/verify_otp_model';

type PhoneNumberScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AuthStack'
>;



const PhoneNumberScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<PhoneNumberScreenNavigationProp>();
  // const navigation = useNavigation(); // ✅ Moved inside component
  const [secondsLeft, setSecondsLeft] = useState(30);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [showNext, setShowNext] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+66');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRender, setModalRender] = useState(false); // Controls actual rendering
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');


  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);
  const [loginOtpData, setLoginOtpData] = useState<LoginOTPResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, logout } = useContext(AuthContext);


  const countryCodes = [
    { code: '+66', name: t('Thailand') },
    { code: '+91', name: t('India') },
    { code: '+1', name: t('USA') },
    { code: '+44', name: t('UK') },
    { code: '+971', name: t('UAE') },
    { code: '+880', name: t('Bangladesh') },
  ];


  const loginOTP_Api = async () => {
    setLoading(true);  // ✅ start loader
    const currentDate = getCurrentDateYYYYMMDD()

    const requestData: LoginOTPRequest = {
      Data: {
        CountryCode: countryCode,
        PhoneNumber: countryCode + phoneNumber,
        token: '',
        IsTest: true,
      },
      Header: {
        BranchId: 721,
        BrandId: 38,
        ChannelId: '1',
        ContactId: '74f206d5-7912-43b8-b082-4d4aa60b5410',
        TransactionId: 'YYR00000000',
        TransactionDate: `${currentDate}000000000`,
        // TransactionDate: `20250820000000000`,

      },
    };

    try {
      const response = await sendOTP(requestData);

      if (response && response.Data) {
        console.log('API response:', response);
        setLoginOtpData(response); // only save Data part
        slideOutLeft();
      } else {
        Alert.alert(response?.ResponseStatus?.ResponseDesc ?? '');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);  // ✅ stop loader
      // slideOutLeft();
    }
  };

  const verifyOTP_Api = async () => {
    setLoading(true);
    console.log('🔍 Starting OTP verification...');
    console.log('🔍 OTP data:', otp.join(''));
    console.log('🔍 Login OTP data:', loginOtpData);

    // const currentDate = getCurrentDateYYYYMMDD()

    const requestData: VerifyOTPRequest = {
      Data: {
        CustomerId: loginOtpData?.Data?.CustomerId,
        PhoneNumber: loginOtpData?.Data?.PhoneNumber,
        Token: loginOtpData?.Data?.Token,
        OTP: otp.join('')

      },
      Header: {
        BranchId: 721,
        BrandId: 38,
        ChannelId: "1",
        ContactId: "74f206d5-7912-43b8-b082-4d4aa60b5410"
      }
    }

    console.log('🔍 Verify OTP request data:', requestData);

    try {
      const response = await verifyOTP(requestData);
      console.log('🔍 Verify OTP API response:', response);

      if (response && response.Data && (response.Data?.Valid == true)) {
        console.log('✅ OTP verification successful!');
        console.log('🔍 About to call login function...');

        // Call login function
        // await login('123');
        // console.log('✅ Login function called successfully');

        // Navigate to main stack
        // console.log('🔍 Navigating to MainStack...');
        // navigation.replace('MainStack');
        // console.log('✅ Navigation completed');

        requestLocationPermission();
        // Alert.alert( 'Go to Home');
        // requestLocationPermission();
      } else {
        console.log('❌ OTP verification failed:', response?.Data?.Message);
        Alert.alert(response?.Data?.Message ?? "'Error', 'An unexpected error occurred. Please try again.'");
      }
    } catch (error) {
      console.error('❌ Verify OTP error:', error);
      Alert.alert('Error',

        'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };



  const maskPhoneNumber = (number) => {
    if (!number) return '';
    if (number.length <= 4) return number; // Don't mask if 4 or fewer digits

    const visiblePart = number.slice(-4);
    const maskedPart = 'X'.repeat(number.length - 4);
    return maskedPart + visiblePart;
  };


  // const requestLocationPermission = async () => {
  //   try {
  //     const result = await request(
  //       Platform.select({
  //         android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  //         ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  //       })
  //     );

  //     if (result === RESULTS.GRANTED) {
  //       console.log('✅ Location permission granted');
  //       handleVerifyOTP();
  //     } else {
  //       console.log('❌ Location permission denied');
  //       Alert.alert(
  //         'Permission needed',
  //         'We need location access to continue.'
  //       );
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };


  const requestLocationPermission = async () => {
    handleVerifyOTP();

    // try {
    //   const permission = Platform.select({
    //     android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    //     ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    //   });

    //   const before = await check(permission);
    //   console.log('📍 location status (before):', before);

    //   if (before === RESULTS.GRANTED) {
    //     console.log('✅ Location permission already granted');
    //     return;
    //   }

    //   if (before === RESULTS.UNAVAILABLE || before === RESULTS.BLOCKED) {
    //     console.log('⚠️ Location unavailable/blocked, opening settings');
    //     Alert.alert(
    //       'Location Permission',
    //       'Location access is disabled. Please enable it in Settings.',
    //       [
    //         { text: 'Cancel', style: 'cancel' },
    //         { text: 'Open Settings', onPress: () => openSettings() },
    //       ],
    //     );
    //     return;
    //   }

    //   // Request if not granted and requestable
    //   const after = await request(permission);
    //   console.log('📍 location status (after request):', after);

    //   if (after === RESULTS.GRANTED) {
    //     console.log('✅ Location permission granted');
    //     handleVerifyOTP();
    //     return;
    //   }

    //   if (after === RESULTS.BLOCKED) {
    //     console.log('⛔️ Location permission blocked after request, opening settings');
    //     Alert.alert(
    //       'Permission needed',
    //       'Location access is blocked. Please enable it in Settings.',
    //       [
    //         { text: 'Cancel', style: 'cancel' },
    //         { text: 'Open Settings', onPress: () => openSettings() },
    //       ],
    //     );
    //     return;
    //   }

    //   console.log('❌ Location permission denied');
    //   Alert.alert('Permission needed', 'We need location access to continue.');
    // } catch (err) {
    //   console.warn('requestLocationPermission error:', err);
    // }
  };


  const handleVerifyOTP = async () => {
    // verifyOTP_Api();
    // navigation.navigate('HomeScreen'); // ✅ Removed .tsx
    await login('123');
    navigation.replace('MainStack');
  };

  const GradientButton = ({ title, onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
      <LinearGradient
        colors={['rgb(71,113,186,1)', 'rgb(177,115,188,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 0.6]} // Blue until halfway, then purple
        style={styles.gradient}>

        <Text style={styles.gradientText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const openModal = () => {
    setModalRender(true);
    requestAnimationFrame(() => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        tension: 100,
      }).start();
    });
  };

  const closeModal = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalRender(false); // Remove after animation
    });
  };


  useEffect(() => {
    if (!showNext) return; // Only run timer on OTP screen

    let timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup
  }, [showNext, secondsLeft]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(1, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const slideOutLeft = () => {
    Animated.timing(slideAnim, {
      toValue: -500,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowNext(true);
      slideAnim.setValue(500);
      slideInFromRight();
    });
  };

  const slideInFromRight = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Slide OTP out to the right
  const slideOutRight = () => {
    Animated.timing(slideAnim, {
      toValue: 500,   // move to the right
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowNext(false);   // go back to phone number screen
      slideAnim.setValue(-500); // reset start position (off-screen left)
      slideInFromLeft();
    });
  };

  // Slide phone screen back in from left
  const slideInFromLeft = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };


  const handleGetOTP = () => {
    const fullNumber = `${countryCode}${phoneNumber}`;
    console.log('Phone Number:', fullNumber);
    loginOTP_Api();
    // slideOutLeft();
  };

  const handleCodeSelect = (code) => {
    setCountryCode(code);
    setModalVisible(false);
  };

  const handleOTPChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < otp.length - 1) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (index) => {
    if (otp[index] === '' && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <LinearGradient
          colors={['rgb(246,248,260,1)', 'rgb(242,219,218,0.7)']}
          locations={[0.4, 0.5]} // 0 → start, 0.3 → 30% mark, 0.9 → 90% mark
          start={{ x: 0, y: 0 }}   // top-left
          end={{ x: 1, y: 1 }}     // bottom-right
          style={{ flex: 1, width: '100%' }}
        >
          <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 20 }}>
            {showNext && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => {
                  slideOutRight()
                  setShowNext(false)
                }
                }
              >
                {/* <Ionicons name="chevron-back-outline" size={24} color="#333" /> */}
                {/* <TouchableOpacity> */}
                <Image source={require('../../assets/images/backarroww.png')} style={{ height: 24, width: 20, }}></Image>
                {/* </TouchableOpacity> */}
              </TouchableOpacity>
            )}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              {/* <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowNext(false)}
              >
                <Ionicons name="chevron-back-outline" size={24} color="#333" />
              </TouchableOpacity> */}
              <Image
                // height={400}
                // source={require('../../assets/images/Otp.png')}
                source={require('../../assets/images/dahlia.png')}
                style={styles.illustration}
                resizeMode='cover'
              />

              <Animated.View style={{ transform: [{ translateX: slideAnim }], paddingHorizontal: 20, width: '100%' }}>
                {!showNext ? (
                  <>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                      {/* <Text style={styles.title}>{t('enterPhoneNumber')}</Text> */}
                      <Text style={styles.title}>{t('enterPhoneNumber')}</Text>
                      <Text style={styles.subtitle}>
                        {t('otpDescription')}
                      </Text>
                    </View>

                    {/* <Text style={{ marginBottom: 8, fontSize: 12, fontWeight: '700' }}>Phone Number</Text> */}
                    <View style={[
                      styles.inputContainer,
                      { paddingLeft: 16, borderColor: error ? 'red' : 'transparent' }
                    ]}>
                      <TouchableOpacity
                        onPress={openModal}
                        style={styles.codeSelector}
                      >
                        <Text style={styles.countryCode}>{countryCode}</Text>
                      </TouchableOpacity>

                      <TextInput
                        style={styles.input}
                        keyboardType="phone-pad"
                        placeholder="81 123 234 7899"
                        placeholderTextColor="#999"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />

                    </View>
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginLeft: 0 }}>
                      <Image tintColor={'rgb(130, 170, 134)'} height={28} width={28} resizeMode='contain' source={require('../../assets/images/greentick.png')} style={{ height: 18, width: 18, marginTop: 3 }}></Image>
                      <Text style={[styles.termsText, { lineHeight: 18, fontSize: 13 }]}>
                        {/* <Image height={24} width={24} resizeMode='contain' source={require('../../assets/images/greentick.png')} style={{ height: 12, width: 12, marginTop: 5, }}></Image> */}
                        {t('agreement_text')}{'\n'}{' '}
                        <Text
                          style={styles.linkText}
                          onPress={() => navigation.navigate('WebViewScreen', {
                            url: 'https://www.foodie24x7.com/Home/merchantterms',
                          })}
                        >
                          {t('terms_link_text')}
                        </Text>{' '}
                        and{' '}
                        <Text
                          style={styles.linkText}
                          // onPress={() =>
                          onPress={() => navigation.navigate('WebViewScreen', {
                            url: 'https://www.foodie24x7.com/Home/merchantterms',
                          })}
                        >
                          {t('privacy_link_text')}
                        </Text>
                      </Text>
                    </View>
                    <View style={{ height: 30 }}></View>
                    <GradientButton title={t('getOTP')} onPress={() => {
                      if (phoneNumber.trim() === '') {
                        setError(t('pleaseenterPhoneNumber'));
                        // show error
                      } else {
                        setError(''); // clear error
                        handleGetOTP();
                      }
                    }} />

                  </>
                ) : (
                  <>
                    {/* <TouchableOpacity
                      style={styles.backButton}
                      onPress={() => setShowNext(false)} // go back to phone number screen
                    >
                      <Ionicons name="chevron-back-outline" size={24} color="#333" />
                    </TouchableOpacity> */}
                    <Text style={styles.heading}>{t('otp_verification')}</Text>
                    <Text style={styles.subtext}>
                      {t('otp_sent_sms')} {''}
                      <Text style={styles.boldText}>
                        {countryCode} {maskPhoneNumber(phoneNumber)}
                      </Text>
                    </Text>

                    {otpError ? <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 10 }]}>{otpError}</Text> : null}
                    <View style={styles.otpContainer}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          ref={(ref) => (otpRefs.current[index] = ref)}
                          style={[
                            styles.otpInput,

                            { borderWidth: 0.5, borderColor: otpError ? 'red' : 'transparent' } // 🔴 error border
                          ]}
                          keyboardType="number-pad"
                          maxLength={1}
                          value={digit}
                          onChangeText={(text) => handleOTPChange(text, index)}
                          onKeyPress={({ nativeEvent }) =>
                            nativeEvent.key === 'Backspace' ? handleBackspace(index) : null
                          }
                        />
                      ))}
                    </View>


                    {/* {secondsLeft > 0 ? (
                    <Text style={styles.timerText}>
                      Don’t receive OTP? <Text style={styles.boldTimer}>{formatTime(secondsLeft)}</Text>
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={() => {
                      setSecondsLeft(30); // restart 5-min timer
                      handleGetOTP(); // send OTP again
                    }}>
                      <Text style={[styles.timerText, { color: '#E32223', fontWeight: '600' }]}>Resend OTP</Text>
                    </TouchableOpacity>
                  )} */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32, }}>
                      <Image tintColor={'rgb(130, 170, 134)'} height={28} width={28} resizeMode='contain' source={require('../../assets/images/greentick.png')} style={{ height: 18, width: 18, marginTop: 4 }}></Image>
                      <Text style={[styles.termsText, { lineHeight: 18, fontSize: 13 }]}>
                        {/* <Image height={24} width={24} resizeMode='contain' source={require('../../assets/images/greentick.png')} style={{ height: 12, width: 12, marginTop: 5, }}></Image> */}
                        {t('agreement_text')}{'\n'}{' '}
                        <Text
                          style={styles.linkText}
                          onPress={() => navigation.navigate('WebViewScreen', {
                            url: 'https://www.foodie24x7.com/Home/merchantterms',
                          })}
                        >
                          {t('terms_link_text')}
                        </Text>{' '}
                        and{' '}
                        <Text
                          style={styles.linkText}
                          // onPress={() =>
                          onPress={() => navigation.navigate('WebViewScreen', {
                            url: 'https://www.foodie24x7.com/Home/merchantterms',
                          })}
                        >
                          {t('privacy_link_text')}
                        </Text>
                      </Text>
                    </View>


                    {/* <TouchableOpacity
              style={styles.verifyButton}
              onPress={() => {
                if (otp.some(digit => digit.trim() === '')) { // check if any OTP box is empty
                  setOtpError('Please enter all 4 digits');
                } else {
                  setOtpError('');
                  handleVerifyOTP();
                }
              }}
            >
              <Text style={styles.verifyText}>Verify</Text>
            </TouchableOpacity> */}
                    <GradientButton title={t('verify')} onPress={() => {
                      if (otp.some(digit => digit.trim() === '')) { // check if any OTP box is empty
                        setOtpError(t('otp_error_digits'));
                      } else {
                        setOtpError('');
                        verifyOTP_Api()
                        // handleVerifyOTP();
                        //  // ask for location before navigating
                      }
                    }} />

                  </>
                )}
              </Animated.View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {modalRender && (
          <Modal transparent animationType="none">
            <View style={styles.modalBackground}>
              <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
                <FlatList
                  data={countryCodes}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.modalItem}
                      onPress={() => {
                        setCountryCode(item.code);
                        closeModal();
                      }}
                    >
                      <Text style={styles.modalText}>{item.name} ({item.code})</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity style={styles.closeModal} onPress={closeModal}>
                  <Text style={styles.closeModalText}>{t('cancel')}</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>
          </Modal>
        )}
        {loading && (
          <View style={styles.loaderOverlay}>
            <View style={styles.loaderBox}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={{ color: '#fff', marginTop: 8 }}>{t('please_wait')}</Text>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default PhoneNumberScreen;

// Styles remain unchanged
const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4
  }
  ,
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 50,
    marginBottom: 16,
  },
  illustration: {
    // width: '90%',
    // height: '40%',
    // width: '100%',
    width: 350,
    height: 400,  // match screen width
    // aspectRatio: 0.2,       // replace with your image's width/height ratio
    marginBottom: 24,
    marginTop: -100,
    resizeMode: 'center'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    // marginLeft: 65,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    shadowColor: 'rgb(65,152,217,1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderWidth: 1,
    // borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
    height: 50,
  },
  codeSelector: {
    paddingRight: 12,
    borderRightWidth: 0,
    borderColor: '#ccc',
    marginRight: 0,
  },
  countryCode: {
    fontSize: 16,
    color: '#8F9098',
  },
  input: {
    // flex: 1,
    fontSize: 16,
    color: '#000',
    width: '100%',
    height: '100%'
  },
  button: {
    backgroundColor: '#E32223',
    paddingVertical: 14,
    borderRadius: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    margin: 30,
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
  closeModal: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeModalText: {
    fontSize: 16,
    color: '#E32223',
    fontWeight: '500',
  },
  newview: {
    flexDirection: 'row',
    // marginLeft: 17,
    marginTop: 40,
    // paddingHorizontal: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
    height: 50,
  },
  subtext: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    // fontSize: 14,
    // color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  boldText: {
    fontWeight: '600',
    color: '#222',
  },
  otpContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    justifyContent: 'center',

    // marginHorizontal: 20,
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    marginLeft: 6,
    borderRadius: 12,
    // borderWidth: 1,
    // borderColor: 'rgba(128, 128, 128, 0.3)',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    shadowColor: 'rgb(65,152,217,1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,

  },
  timerText: {
    fontSize: 13,
    alignSelf: 'center',
    color: '#555',
    // marginBottom: 32,
  },
  boldTimer: {
    fontWeight: '600',
    color: '#444',
  },
  verifyButton: {
    backgroundColor: '#E32223',
    paddingVertical: 14,
    borderRadius: 8,
    width: '100%',           // ✅ Full width
    alignItems: 'center',    // ✅ Center horizontally
    justifyContent: 'center',// ✅ Center vertically
    marginTop: 20,
  },
  verifyText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    alignSelf: 'center',
    // fontWeight: '700',
    marginBottom: 8,
    // color: '#333',
  },

  buttonContainer: {
    backgroundColor: 'red',
    borderRadius: 25,
    height: 60,
    // overflow: 'hidden',

  },
  gradient: {
    flex: 1,
    borderRadius: 12,
    justifyContent: 'center'
  },
  gradientText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  termsText: {
    marginTop: 20,
    fontSize: 12,
    // color: '#000',
    color: 'black',
    textAlign: 'center',
  },
  linkText: {

    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#000',
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderBox: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,   // adjust for SafeArea
    left: 20,
    padding: 8,
    zIndex: 10,
  },


});












// import React, { useRef, useState, useEffect } from 'react';
// import {
//   View,
//   Animated,
//   Text,
//   StyleSheet,
//   Image,
//   TextInput,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Modal,
//   FlatList,
//   ActivityIndicator,
//   Keyboard,
//   TouchableWithoutFeedback,
//   Alert
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import LinearGradient from 'react-native-linear-gradient';
// import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import i18n from '../i18n'; // ✅ import i18n

// import { getCurrentDateYYYYMMDD, sendOTP, verifyOTP } from '../api_functions/api_functions';

// const PhoneNumberScreen = () => {
//   const navigation = useNavigation();
//   const [secondsLeft, setSecondsLeft] = useState(30);
//   const slideAnim = useRef(new Animated.Value(0)).current;
//   const [showNext, setShowNext] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [countryCode, setCountryCode] = useState('+66');
//   const [modalRender, setModalRender] = useState(false);
//   const scaleAnim = useRef(new Animated.Value(0)).current;
//   const [error, setError] = useState('');
//   const [otpError, setOtpError] = useState('');
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const otpRefs = useRef([]);
//   const [loginOtpData, setLoginOtpData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const countryCodes = [
//     { code: '+66', name: i18n.t('Thailand') },
//     { code: '+91', name: i18n.t('India') },
//     { code: '+1', name: i18n.t('USA') },
//     { code: '+44', name: i18n.t('UK') },
//     { code: '+971', name: i18n.t('UAE') },
//     { code: '+880', name: i18n.t('Bangladesh') },
//   ];

//   const loginOTP_Api = async () => {
//     setLoading(true);
//     const currentDate = getCurrentDateYYYYMMDD();
//     const requestData = {
//       Data: {
//         CountryCode: countryCode,
//         PhoneNumber: countryCode + phoneNumber,
//         token: '',
//         IsTest: true,
//       },
//       Header: {
//         BranchId: 721,
//         BrandId: 38,
//         ChannelId: '1',
//         ContactId: '74f206d5-7912-43b8-b082-4d4aa60b5410',
//         TransactionId: 'YYR00000000',
//         TransactionDate: `${currentDate}000000000`,
//       },
//     };

//     try {
//       const response = await sendOTP(requestData);
//       if (response && response.Data) {
//         setLoginOtpData(response);
//         slideOutLeft();
//       } else {
//         Alert.alert(response?.ResponseStatus?.ResponseDesc ?? '');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert(i18n.t('error'), i18n.t('unexpectedError'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const verifyOTP_Api = async () => {
//     setLoading(true);
//     const requestData = {
//       Data: {
//         CustomerId: loginOtpData?.Data?.CustomerId,
//         PhoneNumber: loginOtpData?.Data?.PhoneNumber,
//         Token: loginOtpData?.Data?.Token,
//         OTP: otp.join('')
//       },
//       Header: {
//         BranchId: 721,
//         BrandId: 38,
//         ChannelId: "1",
//         ContactId: "74f206d5-7912-43b8-b082-4d4aa60b5410"
//       }
//     }

//     try {
//       const response = await verifyOTP(requestData);
//       if (response?.Data?.Valid) {
//         navigation.navigate('HomeScreen');
//       } else {
//         Alert.alert(response?.Data?.Message ?? '');
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert(i18n.t('error'), i18n.t('unexpectedError'));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const maskPhoneNumber = (number) => {
//     if (!number) return '';
//     if (number.length <= 4) return number;
//     return 'X'.repeat(number.length - 4) + number.slice(-4);
//   };

//   const GradientButton = ({ title, onPress }) => (
//     <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
//       <LinearGradient
//         colors={['rgb(71,113,186,1)', 'rgb(177,115,188,1)']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={styles.gradient}>
//         <Text style={styles.gradientText}>{title}</Text>
//       </LinearGradient>
//     </TouchableOpacity>
//   );

//   const handleGetOTP = () => {
//     if (!phoneNumber.trim()) {
//       setError(i18n.t('enterPhoneNumber'));
//     } else {
//       setError('');
//       loginOTP_Api();
//     }
//   };

//   const handleOTPChange = (text, index) => {
//     const newOtp = [...otp];
//     newOtp[index] = text;
//     setOtp(newOtp);
//     if (text && index < otp.length - 1) otpRefs.current[index + 1].focus();
//   };

//   const handleBackspace = (index) => {
//     if (otp[index] === '' && index > 0) otpRefs.current[index - 1].focus();
//   };

//   return (
//     <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
//         <LinearGradient
//           colors={['rgb(246,248,260,1)', 'rgb(242,219,218,0.7)']}
//           locations={[0.4, 0.5]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={{ flex: 1, width: '100%' }}>
//           <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
//             <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//               <Image
//                 source={require('../../assets/images/dahlia.png')}
//                 style={styles.illustration}
//                 resizeMode='cover'
//               />

//               <Animated.View style={{ transform: [{ translateX: slideAnim }], paddingHorizontal: 20, width: '100%' }}>
//                 {!showNext ? (
//                   <>
//                     <View style={{ justifyContent: 'center', alignItems: 'center' }}>
//                       <Text style={styles.title}>{i18n.t('enterPhoneNumber')}</Text>
//                       <Text style={styles.subtitle}>{i18n.t('otpDescription')}</Text>
//                     </View>

//                     <View style={[styles.inputContainer, { paddingLeft: 16, borderColor: error ? 'red' : 'transparent' }]}>
//                       <TouchableOpacity style={styles.codeSelector}>
//                         <Text style={styles.countryCode}>{countryCode}</Text>
//                       </TouchableOpacity>

//                       <TextInput
//                         style={styles.input}
//                         keyboardType="phone-pad"
//                         placeholder={i18n.t('phonePlaceholder')}
//                         placeholderTextColor="#999"
//                         value={phoneNumber}
//                         onChangeText={setPhoneNumber}
//                       />
//                     </View>

//                     {error ? <Text style={styles.errorText}>{error}</Text> : null}

//                     <GradientButton title={i18n.t('getOTP')} onPress={handleGetOTP} />
//                   </>
//                 ) : (
//                   <>
//                     <Text style={styles.heading}>{i18n.t('otpVerification')}</Text>
//                     <Text style={styles.subtext}>
//                       {i18n.t('otpSent')} {countryCode} {maskPhoneNumber(phoneNumber)}
//                     </Text>

//                     {otpError ? <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 10 }]}>{otpError}</Text> : null}

//                     <View style={styles.otpContainer}>
//                       {otp.map((digit, index) => (
//                         <TextInput
//                           key={index}
//                           ref={(ref) => (otpRefs.current[index] = ref)}
//                           style={[styles.otpInput, { borderWidth: 0.5, borderColor: otpError ? 'red' : 'transparent' }]}
//                           keyboardType="number-pad"
//                           maxLength={1}
//                           value={digit}
//                           onChangeText={(text) => handleOTPChange(text, index)}
//                           onKeyPress={({ nativeEvent }) => nativeEvent.key === 'Backspace' ? handleBackspace(index) : null}
//                         />
//                       ))}
//                     </View>

//                     <GradientButton title={i18n.t('verify')} onPress={verifyOTP_Api} />
//                   </>
//                 )}
//               </Animated.View>
//             </View>
//           </SafeAreaView>
//         </LinearGradient>

//         {loading && (
//           <View style={styles.loaderOverlay}>
//             <View style={styles.loaderBox}>
//               <ActivityIndicator size="large" color="#fff" />
//               <Text style={{ color: '#fff', marginTop: 8 }}>{i18n.t('pleaseWait')}</Text>
//             </View>
//           </View>
//         )}
//       </KeyboardAvoidingView>
//     </TouchableWithoutFeedback>
//   );
// };

// export default PhoneNumberScreen;

// // Styles remain unchanged
// const styles = StyleSheet.create({
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginTop: 4,
//     marginLeft: 4
//   }
//   ,
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     // paddingHorizontal: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logo: {
//     width: 150,
//     height: 50,
//     marginBottom: 16,
//   },
//   illustration: {
//     // width: '90%',
//     // height: '40%',
//     // width: '100%',
//     width: 350,
//     height: 400,  // match screen width
//     // aspectRatio: 0.2,       // replace with your image's width/height ratio
//     marginBottom: 24,
//     marginTop: -100,
//     resizeMode: 'center'
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#000',
//     // marginLeft: 65,
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     fontWeight: '400',
//     color: '#000',
//     marginBottom: 24,
//     textAlign: 'center',
//   },
//   inputContainer: {
//     shadowColor: 'rgb(65,152,217,1)',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//     backgroundColor: 'white',
//     flexDirection: 'row',
//     borderWidth: 1,
//     // borderColor: '#ccc',
//     borderRadius: 10,
//     alignItems: 'center',
//     height: 50,
//   },
//   codeSelector: {
//     paddingRight: 12,
//     borderRightWidth: 0,
//     borderColor: '#ccc',
//     marginRight: 0,
//   },
//   countryCode: {
//     fontSize: 16,
//     color: '#8F9098',
//   },
//   input: {
//     // flex: 1,
//     fontSize: 16,
//     color: '#000',
//     width: '100%',
//     height: '100%'
//   },
//   button: {
//     backgroundColor: '#E32223',
//     paddingVertical: 14,
//     borderRadius: 10,
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },
//   modalContainer: {
//     backgroundColor: '#fff',
//     margin: 30,
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
//   modalText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   closeModal: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   closeModalText: {
//     fontSize: 16,
//     color: '#E32223',
//     fontWeight: '500',
//   },
//   newview: {
//     flexDirection: 'row',
//     // marginLeft: 17,
//     marginTop: 40,
//     // paddingHorizontal: 12,
//     alignItems: 'center',
//     width: '100%',
//     marginBottom: 24,
//     height: 50,
//   },
//   subtext: {
//     fontSize: 16,
//     fontWeight: '400',
//     color: '#000',
//     // fontSize: 14,
//     // color: '#555',
//     textAlign: 'center',
//     marginBottom: 24,
//   },
//   boldText: {
//     fontWeight: '600',
//     color: '#222',
//   },
//   otpContainer: {
//     flexDirection: 'row',
//     // justifyContent: 'space-around',
//     justifyContent: 'center',

//     // marginHorizontal: 20,
//     marginBottom: 20,
//   },
//   otpInput: {
//     backgroundColor: 'white',
//     width: 50,
//     height: 50,
//     marginLeft: 6,
//     borderRadius: 12,
//     // borderWidth: 1,
//     // borderColor: 'rgba(128, 128, 128, 0.3)',
//     textAlign: 'center',
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#000',
//     shadowColor: 'rgb(65,152,217,1)',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,

//   },
//   timerText: {
//     fontSize: 13,
//     alignSelf: 'center',
//     color: '#555',
//     // marginBottom: 32,
//   },
//   boldTimer: {
//     fontWeight: '600',
//     color: '#444',
//   },
//   verifyButton: {
//     backgroundColor: '#E32223',
//     paddingVertical: 14,
//     borderRadius: 8,
//     width: '100%',           // ✅ Full width
//     alignItems: 'center',    // ✅ Center horizontally
//     justifyContent: 'center',// ✅ Center vertically
//     marginTop: 20,
//   },
//   verifyText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },

//   heading: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#000',
//     alignSelf: 'center',
//     // fontWeight: '700',
//     marginBottom: 8,
//     // color: '#333',
//   },

//   buttonContainer: {
//     backgroundColor: 'red',
//     borderRadius: 25,
//     height: 60,
//     // overflow: 'hidden',

//   },
//   gradient: {
//     flex: 1,
//     borderRadius: 12,
//     justifyContent: 'center'
//   },
//   gradientText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   termsText: {
//     marginTop: 20,
//     fontSize: 12,
//     // color: '#000',
//     color: 'black',
//     textAlign: 'center',
//   },
//   linkText: {

//     fontWeight: 'bold',
//     textDecorationLine: 'underline',
//     color: '#000',
//   },
//   loaderOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   loaderBox: {
//     padding: 20,
//     borderRadius: 12,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     alignItems: 'center',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 50,   // adjust for SafeArea
//     left: 20,
//     padding: 8,
//     zIndex: 10,
//   },
// })