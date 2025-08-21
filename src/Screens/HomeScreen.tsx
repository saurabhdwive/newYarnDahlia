import React, { useEffect, useState } from 'react';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  ImageSourcePropType,
  Platform,
  Button,
  Modal,
  Alert,
  ImageBackground,
  PermissionsAndroid,
  StatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import 'react-native-get-random-values';
import { IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import TypingIndicator from './typing_indicator';
import { ChatFoodie24x7Response, ChatRequest } from '../models/ai_reply_model';
import { ai_Chat_Reply_api } from '../api_functions/api_functions';
import WebViewScreen from './webview_screen';

// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { useTranslation } from 'react-i18next';
// import { SafeAreaView } from 'react-native-safe-area-context';


const martynaImage = require('../../assets/images/dahlia.png');
const askMartynaIcon = require('../../assets/images/askmartyna.png');


type TextMessage = {
  id: string; type: 'text'; text: string; sender: 'user' | 'bot';
};

type RestaurentListMessage = {
  id: string;
  type: 'restaurent-list';
  items: { id: string; name: string, image: ImageSourcePropType, storeUrl: string }[];
  sender: 'bot';
  // storeUrl:string
};
type MenuListMessage = {
  id: string;
  type: 'menu-list';
  items: { id: string; name: string, image: ImageSourcePropType, price: String }[];
  sender: 'bot';
};

type SelectDateMessage = {
  id: string;
  type: 'select-date';
  text: string; // message prompt
  sender: 'bot';
  selectedDate?: string;
};

type SelectTimeMessage = {
  id: string;
  type: 'select-time';
  text: string; // message prompt
  sender: 'bot';
  selectedTime?: string;
};
type restaurentNameMessage = {
  id: string;
  type: 'restaurant-name';
  items: { id: string; name: string, image: ImageSourcePropType }[];
  sender: 'bot';
};
type foodTypeMessage = {
  id: string;
  type: 'food-type';
  items: { id: string; name: string, image: ImageSourcePropType }[];
  sender: 'bot';
};

type bookingConfirmationMessage = {
  id: string;
  text: string;
  type: 'booking-confirmation';
  sender: 'bot';
};
type isTypingMessage = {
  id: string;
  // text: string;
  type: 'isTyping';
  sender: 'bot';
};

type Message = TextMessage | RestaurentListMessage | MenuListMessage | SelectDateMessage | SelectTimeMessage | restaurentNameMessage | foodTypeMessage | bookingConfirmationMessage | isTypingMessage;
function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}
export default function AskMartynaScreen() {

  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const navigation = useNavigation();
  const flatListRef = React.useRef<FlatList>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [currentSelectDateId, setCurrentSelectDateId] = useState<string | null>(null);
  const [currentSelectTimeId, setCurrentSelectTimeId] = useState<string | null>(null);
  const dateRegex = /\b(\d{1,2}\/\d{1,2}\/\d{4})\b/;
  const timeRegex = /\b(1[0-2]|0?[1-9]):([0-5][0-9])\s?(AM|PM)\b/i;
  const [personName, setpersonName] = useState(false);
  const [bookingConfirmation, setbookingConfirmation] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const route = useRoute();
  const params = route.params as { restaurantName?: string };
  const restaurantName = params?.restaurantName || '';
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [recognizedText, setRecognizedText] = useState<string>('');

  // Callback function to receive recognized text from PromptScreen
  const handleRecognizedText = (text: string) => {
    console.log('📱 Received recognized text in HomeScreen:', text);
    // setRecognizedText(text);
    // Set it as input text so user can see and edit before sending
    // setInput(text);
    sendMessage(text);
  };

  // const isFocused = useIsFocused();

  // useEffect(() => {
  //   if (isFocused) {
  //       console.log('homesdfghjkjhgf=>>>>>>>>>>>>********&^%$#@')
  //     StatusBar.setBarStyle('dark-content');
  //     StatusBar.setBackgroundColor('white');
  //   }
  // }, [isFocused]);

  // Debug logging for navigation parameters
  useEffect(() => {
    console.log('🔍 HomeScreen Navigation Debug:');
    console.log('📍 Route params:', route.params);
    console.log('🍽️ Restaurant name:', restaurantName);
    console.log('📱 Current route name:', route.name);
  }, [route.params, restaurantName, route.name]);



  // async function requestLocationPermission(): Promise<boolean> {
  //   try {
  //     if (Platform.OS === 'android') {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //       );
  //       return granted === PermissionsAndroid.RESULTS.GRANTED;
  //     } else {
  //       const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
  //       return result === RESULTS.GRANTED;
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //     return false;
  //   }
  // }



  useEffect(() => {
    const fetchLocation = async () => {
      // const hasPermission = await requestLocationPermission();
      // if (!hasPermission) return;

      Geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Latitude:', latitude, 'Longitude:', longitude);

          // Save location to state
          setLocation({ latitude, longitude });

        },
        (error) => {
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    fetchLocation();
  }, []);


  useEffect(() => {
    if (restaurantName) {
      console.log('🎯 Restaurant name received, sending message:', restaurantName);
      sendMessage('Reserve a table at ' + restaurantName);
    } else {
      console.log('⚠️ No restaurant name received yet');
    }
  }, [restaurantName]);

  // Handle recognized text from PromptScreen
  useEffect(() => {
    if (recognizedText) {
      console.log('🎤 Recognized text received in HomeScreen:', recognizedText);
      // You can choose to either:
      // 1. Set it as input text (user can edit before sending)
      // 2. Send it directly as a message
      // 3. Both
      setInput(recognizedText);
      
      // Optionally, you can auto-send the message
      // sendMessage(recognizedText);
      
      // Clear the recognized text after handling it
      setRecognizedText('');
    }
  }, [recognizedText]);

  const chatReply_Api = async (textInput: string) => {
    chatIsTyping();
    const requestData: ChatRequest = {
      device_token: '0001-1234-abcd-x8902',
      user_input: textInput,
      // customerLocation: '13.736536923605986, 100.56064487462558'
      customerLocation: `${location?.latitude}, ${location?.longitude}`
    }
    console.log(requestData);
    try {
      const response = await ai_Chat_Reply_api(requestData)
      setIsBotTyping(false);
      if (response && Array.isArray(response) && response[0]) {
        const data: ChatFoodie24x7Response = response[0]; // type-cast safely
        console.error('API response:', data);
        chatResponseReply(data);
      } else {
        chatResponseReply(null);
        // Alert.alert('No Data Found');
      }
    } catch (error) {
      console.error('Promotion API error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  }


  // const chatResponseReply = (chatresponse: ChatFoodie24x7Response | null) => {
  //   const botChat: TextMessage = {
  //     id: uuidv4(),
  //     text: chatresponse?.response ?? 'I am not able to answer this question at this point of time',
  //     type: 'text',
  //     sender: 'bot',
  //   };
  //   setMessages(prevMessages => {

  //     // return [...prevMessages, ...replies];
  //     return prevMessages
  //       .filter(m => m.type !== 'isTyping')
  //       .concat(botChat);
  //   });
  //   let extraMessages: Message[] = [botChat];
  //   if (
  //     chatresponse?.foodie24x7?.current?.intent !== "None" &&
  //     chatresponse?.foodie24x7?.current?.entitiesByIntent?.PlaceOrder?.selectedDialogObj?.storeImageUrl
  //   ) {
  //     const allStores = chatresponse?.foodie24x7?.current?.entitiesByIntent?.PlaceOrder?.selectedDialogObj
  //     const storeUrl = chatresponse?.foodie24x7?.current?.entitiesByIntent?.PlaceOrder?.selectedStoreUrl;
  //     const botRestaurentResponse: RestaurentListMessage = {
  //       id: uuidv4(),
  //       type: 'restaurent-list',
  //       // items: allStores.map(store => ({
  //       //   id: uuidv4(),
  //       //   name: store.storeName ?? '',
  //       //   image: { uri: store.storeImageUrl ?? '' },
  //       // })),
  //       items:
  //         [
  //           { id: uuidv4(), name: allStores.storeName ?? '', image: { uri: allStores.storeImageUrl ?? '' }, storeUrl: storeUrl ?? '' },
  //         ],
  //       sender: 'bot',
  //       // storeUrl:
  //     }
  //     //   
  //     extraMessages.push(botRestaurentResponse);

  //     setMessages(prevMessages => {
  //       return [...prevMessages, ...extraMessages];
  //     }
  //     );
  //   }
  // }

  const chatResponseReply = (chatresponse: ChatFoodie24x7Response | null) => {
    const botChat: TextMessage = {
      id: uuidv4(),
      text: chatresponse?.response ?? 'I am not able to answer this question at this point of time',
      type: 'text',
      sender: 'bot',
    };

    const newMessages: Message[] = [botChat];

    if (
      chatresponse?.foodie24x7?.current?.intent !== "None" &&
      chatresponse?.foodie24x7?.current?.entitiesByIntent?.PlaceOrder?.selectedDialogObj?.storeImageUrl
    ) {
      const allStores = chatresponse?.foodie24x7?.current?.entitiesByIntent?.PlaceOrder?.selectedDialogObj;
      const storeUrl = chatresponse?.foodie24x7?.current?.entitiesByIntent?.PlaceOrder?.selectedStoreUrl;

      const botRestaurentResponse: RestaurentListMessage = {
        id: uuidv4(),
        type: 'restaurent-list',
        items: [
          {
            id: uuidv4(),
            name: allStores.storeName ?? '',
            image: { uri: allStores.storeImageUrl ?? '' },
            storeUrl: storeUrl ?? ''
          },
        ],
        sender: 'bot',
      };

      newMessages.push(botRestaurentResponse);
    }

    setMessages(prevMessages => {
      return [
        ...prevMessages.filter(m => m.type !== 'isTyping'),
        ...newMessages
      ];
    });
  }
  const chatIsTyping = () => {
    let replies: Message[] = [];
    const botIsTyping: isTypingMessage = {
      id: uuidv4(),
      type: 'isTyping',
      sender: 'bot',
    };
    replies.push(botIsTyping)

    setMessages(prevMessages => {

      return [...prevMessages, ...replies];
    });
  }

  const sendMessage = (inputText: string) => {
    if (!inputText.trim()) return;
    if (isBotTyping) return;

    const userMessage: TextMessage = {
      id: uuidv4(),
      type: 'text',
      text: inputText.trim(),
      sender: 'user',
    };

    setMessages(prev => {
      const updatedMessages = [...prev, userMessage];
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      });
      return updatedMessages;
    });
    setIsBotTyping(true);
    chatReply_Api(inputText.trim());
    setInput('');
  };


  const renderItem = ({ item }: { item: Message }) => {
    switch (item.type) {
      case 'text':
        return (
          <View style={{ flexDirection: 'row', justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start', width: '100%' }}>
            <View
              style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble, item.sender === 'bot' ? styles.botConditional : styles.userConditional]}
              accessibilityLabel={`${item.sender === 'user' ? 'You' : 'Bot'}: ${item.text}`}
            >
              <Text style={styles.bubbleText}>{item.text}</Text>
            </View>

          </View>
        );
      case 'restaurent-list':
        return (
          <View style={[styles.botBubble, styles.thaiListContainer, { marginTop: 24, marginBottom: 20 }]}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={item.items}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('WebViewScreen', {
                      url: item.storeUrl,
                    })

                  }}
                >
                  <View style={[styles.thaiItem, {}]}>
                    <Image source={item.image} style={{ backgroundColor: 'clear', height: 130, width: 148, resizeMode: 'cover', marginTop: 0, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
                    <View style={{ padding: 12 }}>
                      <Text style={[styles.thaiText, { marginBottom: 12 }]}>{item.name}</Text>
                      <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                        <TouchableOpacity
                          style={{ width: 70, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF3333', paddingVertical: 5 }}
                        // onPress={() => navigation.navigate('PromptScreen')}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate('WebViewScreen', {
                                url: item.storeUrl,
                              })
                              // navigation.navigate('WebViewScreen', {
                              //   url: item.storeUrl,
                              // })
                              // console.log(item.name.trim)
                              // const userMessage: TextMessage = {
                              //   id: uuidv4(),
                              //   type: 'text',
                              //   text: item.name,
                              //   sender: 'user',
                              // };

                              // const botMessages = generateBotReplies(userMessage.text);

                              // setMessages(prevMessages => {
                              //   return [...prevMessages, userMessage, ...botMessages];
                              // });
                            }}
                          >
                            <Text style={{ color: 'white' }}>Select</Text>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thaiList}
              // bounces = {false}
              alwaysBounceHorizontal={true}
              alwaysBounceVertical={false}
            />
          </View>
        );
      case 'menu-list':
        return (
          <View style={[styles.botBubble, styles.thaiListContainer, { justifyContent: 'flex-start', marginTop: 24, marginBottom: 24 }]}>
            <FlatList
              data={item.items}
              renderItem={({ item }) => (
                <View style={[styles.thaiItem, {}]}>
                  <Image source={item.image} style={{ backgroundColor: 'clear', height: 138, width: 158, resizeMode: 'cover', borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
                  <View style={{ padding: 12 }}>
                    <Text style={[styles.thaiText, { marginBottom: 12 }]}>{item.name}</Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={[styles.thaiText, { marginBottom: 12 }]}>{item.price}</Text>
                      <TouchableOpacity
                        style={{ width: 24, height: 24, borderRadius: 12, alignItems: 'center', backgroundColor: '#FF3333', paddingVertical: 0 }}
                        // onPress={() => navigation.navigate('PromptScreen')}
                        onPress={() => {
                          const userMessage: TextMessage = {
                            id: uuidv4(),
                            type: 'text',
                            text: t('book_table'),
                            sender: 'user',
                          };

                          const botMessages = generateBotReplies(userMessage.text);

                          setMessages(prevMessages => {
                            // If no special update is needed (like your date example),
                            // just append the new messages
                            return [...prevMessages, userMessage, ...botMessages];
                          });
                        }}
                      >
                        <Text style={{ color: 'white', fontSize: 18, fontWeight: '400' }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thaiList}
            />
          </View>
        );
      case 'select-date':
        return (
          <View style={[styles.botBubble, , { marginTop: 40 }]}>
            {/* <Text style={{marginBottom:40}}>Could you please tell me which date you'd like to book?</Text> */}
            {item.selectedDate ? (
              // Show the selected date (picker disabled)
              <View style={{ borderWidth: 0.5, borderColor: '#ddd', borderRadius: 15, height: 30, paddingHorizontal: 12, paddingVertical: 7, justifyContent: 'center' }}>
                <Text>Selected Date: {item.selectedDate}</Text>
              </View>
            ) : (
              // Show the date picker trigger if no date selected yet
              <TouchableOpacity onPress={() => {
                setShowPicker(true);
                setCurrentSelectDateId(item.id);  // store current message id to know which one user is answering
              }}>
                <View style={{ borderWidth: 0.5, borderColor: '#ddd', flexDirection: 'row', borderRadius: 15, height: 35, paddingHorizontal: 12, paddingVertical: 7, alignItems: 'center', gap: 4 }}>
                  <Image height={16} width={16} resizeMode='contain' source={require('../../assets/images/booktabbble.png')} style={{ height: 14, width: 14, tintColor: 'grey' }}></Image>
                  <Text>Select Date</Text>
                </View>
              </TouchableOpacity>
            )}

            {showPicker && currentSelectDateId === item.id && Platform.OS === 'ios' && (
              <Modal transparent animationType="slide" visible={showPicker}>
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setShowPicker(false)}
                >
                  <View style={styles.modalContent}>
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="spinner"
                      onChange={onChange}
                      style={{ backgroundColor: '#d3d3d3' }}
                    />
                    <TouchableOpacity onPress={() => onDoneDateSelect(item.id)} style={styles.button}>
                      <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}

            {showPicker && currentSelectDateId === item.id && Platform.OS === 'android' && (
              <DateTimePicker
                value={date}
                mode="date"
                display="calendar"
                onChange={onChange}
              />
            )}
          </View>
        );
      case 'select-time':
        return (
          <View style={[styles.botBubble, { marginTop: 40 }]}>
            {item.selectedTime ? (
              // Show the selected date (picker disabled)
              <View style={{ borderWidth: 0.5, borderColor: '#ddd', borderRadius: 15, height: 35, paddingHorizontal: 12, paddingVertical: 7, justifyContent: 'center' }}>

                <Text>Selected Time: {item.selectedTime}</Text>
              </View>
            ) : (
              // Show the date picker trigger if no date selected yet
              <TouchableOpacity onPress={() => {
                setShowTimePicker(true);
                setCurrentSelectTimeId(item.id);  // store current message id to know which one user is answering
              }}>
                <View style={{ borderWidth: 0.5, borderColor: '#ddd', flexDirection: 'row', borderRadius: 15, height: 35, paddingHorizontal: 12, paddingVertical: 7, alignItems: 'center', gap: 4 }}>
                  <Image height={16} width={16} resizeMode='contain' source={require('../../assets/images/selecttimee.png')} style={{ height: 14, width: 14, tintColor: 'grey' }}></Image>
                  <Text>Select Time</Text>
                </View>
              </TouchableOpacity>
            )}

            {showTimePicker && currentSelectTimeId === item.id && Platform.OS === 'ios' && (
              <Modal transparent animationType="slide" visible={showTimePicker}>
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setShowTimePicker(false)}
                >
                  <View style={styles.modalContent}>
                    <DateTimePicker
                      value={date}
                      mode="time"
                      display="spinner"
                      onChange={onTimeChange}
                      style={{ backgroundColor: '#d3d3d3' }}
                    />
                    <TouchableOpacity onPress={() => {
                      // true
                      onDoneTimeSelect(item.id)
                    }
                    } style={styles.button}>
                      <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Modal>
            )}

            {showTimePicker && currentSelectTimeId === item.id && Platform.OS === 'android' && (
              <DateTimePicker
                value={time}
                mode="time"
                display="spinner"
                onChange={onTimeChange}
              />
            )}
          </View>
        );
      case 'restaurant-name':
        return (

          <View style={[styles.botBubble, , { marginTop: 40 }]}>
            <View style={styles.optionScrollContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.optionsRow}
              >
                {item.items.map((option, index) => (
                  <TouchableOpacity style={styles.optionButton}
                    onPress={() => {
                      const userMessage: TextMessage = {
                        id: uuidv4(),
                        type: 'text',
                        text: option.name,
                        sender: 'user',
                      };

                      const botMessages = generateBotReplies(userMessage.text);

                      setMessages(prevMessages => {
                        // If no special update is needed (like your date example),
                        // just append the new messages
                        return [...prevMessages, userMessage, ...botMessages];
                      });
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Image height={16} width={16} resizeMode='contain' source={item.items[index].image} style={{ height: 14, width: 14, tintColor: 'grey' }}></Image>

                      <Text style={styles.optionText}>{option.name}</Text>

                    </View>
                  </TouchableOpacity >
                ))}

                {/* Add more options here in future */}
              </ScrollView>
            </View>
          </View>
        );
      case 'food-type':
        return (
          <View style={[styles.botBubble, , { marginTop: 20 }]}>
            <View style={styles.optionScrollContainer}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.foodtypeoptionsRow}
              >
                {item.items.map((option, index) => (

                  <View style={[styles.optionButton, { flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                    <Image height={16} width={16} resizeMode='contain' source={item.items[index].image} style={{ height: 14, width: 14, tintColor: 'grey' }}></Image>
                    <TouchableOpacity onPress={() => {
                      const userMessage: TextMessage = {
                        id: uuidv4(),
                        type: 'text',
                        text: option.name,
                        sender: 'user',
                      };

                      const botMessages = generateBotReplies(userMessage.text);

                      setMessages(prevMessages => {
                        // If no special update is needed (like your date example),
                        // just append the new messages
                        return [...prevMessages, userMessage, ...botMessages];
                      });
                    }}
                    >
                      <Text style={styles.optionText}>{option.name}</Text>
                    </TouchableOpacity >
                  </View>
                ))}

                {/* Add more options here in future */}
              </ScrollView>
            </View>
          </View>
        );
      case 'booking-confirmation':
        return (
          <View style={[styles.botBubble, , { marginTop: 40 }]}>

            // Show the date picker trigger if no date selected yet
            <TouchableOpacity onPress={() => {
              setShowPicker(true);
              setCurrentSelectDateId(item.id);  // store current message id to know which one user is answering
            }}>
              <View style={{ borderWidth: 0.5, borderColor: '#ddd', flexDirection: 'row', borderRadius: 15, height: 35, paddingHorizontal: 12, paddingVertical: 7, alignItems: 'center', gap: 4 }}>
                <Image height={16} width={16} resizeMode='contain' source={require('../../assets/images/bookingconfirmation.png')} style={{ height: 14, width: 14, tintColor: 'grey' }}></Image>
                <Text>View Booking Confirmation</Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      case 'isTyping':
        return (
          // <View style={{ width: 1000 }}>
          <View style={[styles.bubble, styles.botBubble, { flexDirection: 'row', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', maxWidth: '100%', flexGrow: 1 }]}>
            {/* <Text>Bot is typing</Text> */}
            <TypingIndicator />
          </View>
          // </View>
        );
    }

    return null;
  };

  return (
    <>
      <FocusAwareStatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView style={styles.container}>
        {/* <StatusBar barStyle="dark-content" backgroundColor="white" /> */}
        <Text style={styles.header}>{t('ask_dahlia')}</Text>
        {messages.length === 0 ? (
          <View
            style={{
              flex: 1
            }}
          >
            <Image
              source={martynaImage}
              style={styles.fairyImage}
              resizeMode="cover"
            />
            {/* <Text style={styles.subtitle}>{t('hungry_for_anything')}{"\n"} {t('special_question')}</Text> */}
          </View>
        ) : (
          <>

            <ImageBackground
              source={martynaImage}
              style={{
                position: 'absolute',       // position freely
                top: -100,                     // top
                right: -150,                   // right
                width: '100%',                 // adjust width as needed
                height: '80%',                // adjust height as needed
                // overflow: 'hidden',
              }}
              imageStyle={{
                borderRadius: 0,           // optional rounded corners
                opacity: 0.4,               // make it semi-transparent
              }}
              blurRadius={5}                // apply blur
              resizeMode="cover"
            >
            </ImageBackground>

            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[styles.chatContainer, { flexGrow: 1 }]}
              initialNumToRender={10}
              // onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onContentSizeChange={() => {
                // Delay scroll so layout is finished
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }, 50);
              }}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          </>
        )
        }


        {/* </ScrollView> */}
        {/* New Scrollable Option Container */}
        <View style={[styles.optionScrollContainer, { marginTop: 12 }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.optionsRow}
          >
            <TouchableOpacity style={styles.optionButton}
              onPress={() => {

                sendMessage(t('order_pizza'))
                // const userMessage: TextMessage = {
                //   id: uuidv4(),
                //   type: 'text',
                //   text: 'Order food',
                //   sender: 'user',
                // };

                // setMessages(prev => {
                //   const updatedMessages = [...prev, userMessage];
                //   requestAnimationFrame(() => {
                //     flatListRef.current?.scrollToEnd({ animated: true });
                //   });
                //   return updatedMessages;
                // });
                // setInput('');
                // setIsBotTyping(true);
                // chatReply_Api('Order food');


                // const userMessage: TextMessage = {
                //   id: uuidv4(),
                //   type: 'text',
                //   text: 'Order food',
                //   sender: 'user',
                // };

                // // const botMessages = generateBotReplies(userMessage.text);
                // setMessages(prevMessages => {
                //   return [...prevMessages, userMessage, ...botMessages];
                // });
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Image height={16} width={16} resizeMode='contain' source={require('../../assets/images/orderfood.png')} style={{ height: 14, width: 14, tintColor: 'grey' }}></Image>
                <Text style={styles.optionText}>{t('order_pizza')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}
              onPress={() => {
                // tap on book a table
              }}

            > <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Image height={16} width={16} resizeMode='contain' source={require('../../assets/images/booktable.png')} style={{ height: 14, width: 14, tintColor: 'grey' }}></Image>
                <Text style={styles.optionText}>{t('book_table')}</Text>
              </View>

            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                // const handleDeleteAccount = () => {
                navigation.navigate('WebViewScreen', {
                  url: 'https://www.flowerfairy.net/',
                })
              }}
            ><View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Image height={16} width={16} resizeMode='contain' source={require('../../assets/images/nearme.png')} style={{ height: 14, width: 14, tintColor: 'grey' }}></Image>
                <Text>{t('order_flowers')}</Text>
              </View>
            </TouchableOpacity>
            {/* Add more options here in future */}
          </ScrollView>
        </View>

        {/* Search bar */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : 'height'}>
          {/* keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100} */}
          <View style={{ backgroundColor: '#F6F7F8', marginHorizontal: 20, marginTop: 12, borderRadius: 20, marginBottom: 16 }}>
            <View style={{ padding: 16 }}>
              {/* Speech recognition indicator */}
              {recognizedText && (
                <View style={styles.speechIndicator}>
                  <Text style={styles.speechIndicatorText}>🎤 Speech recognized</Text>
                </View>
              )}
              <TextInput
                autoCapitalize='none'
                autoCorrect={false}
                style={[
                  styles.searchInput,
                  recognizedText && input === recognizedText && styles.speechInput
                ]}
                onChangeText={setInput}
                value={input}
                // returnKeyType="send"
                placeholder={t('type_or_speak_ask_dahlia')}
                placeholderTextColor="#aaa"
                onSubmitEditing={() => {
                  if (input.trim() !== '') {
                    sendMessage(input);
                    // setInput(''); // Optional: clear input after sending
                  }
                }}
              // onSubmitEditing={sendMessage}
              // onSubmitEditing={(e) => sendMessage(e.nativeEvent.text)}
              />
              <View style={{ height: 20, backgroundColor: 'clear' }}>
              </View>

              <View style={[styles.searchContainer, { justifyContent: 'space-between' }]}>
                <TouchableOpacity
                  style={styles.askMartynaButton}
                  onPress={() => {
                    console.log('🎤 Opening PromptScreen for speech recognition...');
                    navigation.navigate('PromptScreen', { onTextChange: handleRecognizedText });
                  }}
                >
                  <Image source={askMartynaIcon} style={styles.askMartynaIcon} />
                  <Text style={styles.askMartynaText}>{t('ask_dahlia')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.sendButton} onPress={() =>
                  sendMessage(input)
                }>
                  <Image
                    source={require('../../assets/images/uparrow.png')}
                    style={{ width: '60%', height: '40%' }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>


              </View>

            </View>

          </View>
        </KeyboardAvoidingView>
        {/* </ImageBackground> */}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,  // optional
    color: 'blue', // or any color you want
  },
  button: {
    // optional styling for button container
    padding: 10,
    // backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    // backgroundColor: 'rgba(128, 128, 128, 0.5)',
    backgroundColor: '#d3d3d3',
    // backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 20,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  chatContainer: { padding: 10, paddingBottom: 10 },
  bubble: {
    padding: 12,
    marginVertical: 10,
    marginBottom: 24,
    borderRadius: 15,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: { backgroundColor: '#EEEFF1', alignSelf: 'flex-end', justifyContent: 'flex-end' },

  botBubble: { backgroundColor: 'white', alignSelf: 'flex-start' },
  bubbleText: { fontSize: 16, color: '#000' },
  userConditional: { marginLeft: 50 },
  botConditional: { marginRight: 50 },
  thaiListContainer: {
    backgroundColor: 'clear',
    height: 226,
    justifyContent: 'center',
    // width:224
  },
  thaiList: {
    paddingVertical: 5,
    paddingLeft: 5,
    height: 228,
    // width:148
  },
  thaiItem: {
    // backgroundColor: '#FFECB3',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.2)',
    // padding: 10,
    marginRight: 10,
    borderRadius: 10,
    elevation: 2,
    // height: 220, // fits within 120 bubble height
    // width: 148,
  },
  thaiText: {
    fontSize: 16,
    color: '#333',
  },
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    backgroundColor: 'white',
    paddingTop: 10,
    alignItems: 'center',
    // justifyContent: 'space-between',
  },
  header: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 10,
  },
  fairyImage: {
    // width: '300%',
    marginTop: 20,
    width: 350,
    height: 350,
    resizeMode: 'cover'
    // backgroundColor: 'blue',

  },
  subtitle: {
    // marginTop: -30,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    // marginVertical: 20,
    color: '#111',
  },
  speechIndicator: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  speechIndicatorText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  speechInput: {
    borderColor: '#4CAF50',
    borderWidth: 1,
    backgroundColor: '#F1F8E9',
  },
  optionScrollContainer: {
    width: '100%',
    paddingLeft: 20,

    // marginBottom: 20,
    // height:50

  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 30,

  },
  foodtypeoptionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    // padding:100
    // paddingRight: 30,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginRight: 10,
  },
  optionText: {
    fontSize: 14,
    color: '#111',
  },
  searchContainer: {
    // marginTop: 12,
    width: '100%',
    // backgroundColor: '#f3f3f3',
    backgroundColor: 'clear',
    borderRadius: 20,
    // padding: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'

  },
  searchInput: {
    // marginLeft: -130,
    // marginTop: -50,
    // flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  sendButton: {
    // marginRight: -20,
    // marginTop: -10,
    backgroundColor: 'rgb(212,44,32,1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    // marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  askMartynaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgb(212,44,32,0.8)',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    // marginBottom: -50,
    // marginLeft: -21,
  },
  askMartynaIcon: {
    width: 18,
    height: 18,
    borderRadius: 10,
    // marginRight: 6,
  },
  askMartynaText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#111',
    marginLeft: 5
  },

  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
  },
  tabIcon: {
    width: 22,
    height: 22,
    tintColor: '#666',
  },
  tabIconActive: {
    width: 22,
    height: 22,
    tintColor: 'red',
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: '#777',
  },
});




function requestLocationPermission() {
  throw new Error('Function not implemented.');
}
// const generateBotReplies = (userText: string): Message[] => {
//   let replies: Message[] = [];

//   if (userText.toLowerCase().includes('order food')) {
//     replies.push({
//       id: uuidv4(),
//       type: 'text',
//       text: 'Which type of food would you like to order?',
//       sender: 'bot',
//     });

//     replies.push({
//       id: uuidv4(),
//       type: 'food-type', // corrected spelling
//       items: [
//         { id: uuidv4(), name: 'Pizza', image: require('../../assets/images/pizzza.png') },
//         { id: uuidv4(), name: 'Japanese', image: require('../../assets/images/japanessee.png') },
//         { id: uuidv4(), name: 'Healthy Food', image: require('../../assets/images/healthyffood.png') }, // unique id
//         { id: uuidv4(), name: 'Thai', image: require('../../assets/images/thaifood.png') }, // unique id
//       ],
//       sender: 'bot',
//     });
//   } else if (userText.toLowerCase() == ('pizza') ||
//     userText.toLowerCase().includes('japanese') ||
//     userText.toLowerCase().includes('healthy food') ||
//     userText.toLowerCase().includes('thai')) {
//     replies.push({
//       id: uuidv4(),
//       type: 'text',
//       text: 'Which restaurant would you like to order from?',
//       sender: 'bot',
//     });
//     // replies.push({
//     //   id: uuidv4(),
//     //   type: 'restaurent-list',
//     //   items: [
//     //     { id: uuidv4(), name: 'Pizza Mania', image: require('../../assets/images/z1.png') },
//     //     { id: uuidv4(), name: 'Lucky Panda', image: require('../../assets/images/z2.png') },
//     //     { id: uuidv4(), name: 'Pizza Mania', image: require('../../assets/images/z1.png') },
//     //     { id: uuidv4(), name: 'Lucky Panda', image: require('../../assets/images/z2.png') },
//     //   ],
//     //   sender: 'bot',
//     // });
//   } else if (
//     userText.replace(/\s+/g, '').toLowerCase() == ('pizzamania') ||
//     userText.replace(/\s+/g, '').toLowerCase() == ('luckypanda')
//   ) {
//     replies.push({
//       id: uuidv4(),
//       type: 'text', // corrected spelling
//       text: 'What can we help you with today?',
//       sender: 'bot',
//     });
//     replies.push({
//       id: uuidv4(),
//       type: 'restaurant-name', // corrected spelling
//       items: [
//         { id: uuidv4(), name: 'Delivery', image: require('../../assets/images/deliverry.png') },
//         { id: uuidv4(), name: 'Takeaway', image: require('../../assets/images/takeawayy.png') },
//         { id: uuidv4(), name: 'Book a Table', image: require('../../assets/images/booktabbble.png') }, // unique id
//       ],
//       sender: 'bot',
//     });
//   } else if (userText.toLowerCase().includes('delivery') || userText.toLowerCase().includes('takeaway')) {
//     replies.push({
//       id: uuidv4(),
//       type: 'text',
//       text: "Great choice! 🍕 Here are some of the top menu items from Pizza House:",
//       sender: 'bot',
//     });

//     replies.push({
//       id: uuidv4(),
//       type: 'menu-list',
//       items: [
//         { id: uuidv4(), name: 'Meat Lover’s Pizza', image: require('../../assets/images/z3.png'), price: '$180' },
//         { id: uuidv4(), name: 'Four Cheese Pizza', image: require('../../assets/images/z4.png'), price: '$180' },
//         { id: uuidv4(), name: 'Meat Lover’s Pizza', image: require('../../assets/images/z3.png'), price: '$180' },
//         { id: uuidv4(), name: 'Four Cheese Pizza', image: require('../../assets/images/z4.png'), price: '$180' },
//       ],
//       sender: 'bot',
//     });
//   } else if (userText.toLowerCase().includes('book a table')) {
//     replies.push({
//       id: uuidv4(),
//       type: 'text',
//       text: "Could you please tell me which date you'd like to book??",
//       sender: 'bot',
//     });
//     replies.push({
//       id: uuidv4(),
//       type: 'select-date',
//       text: "",
//       sender: 'bot',
//     });
//   } else if (dateRegex.test(userText)) {
//     replies.push({

//       id: uuidv4(),
//       type: 'text',
//       text: "And what time would you prefer?",
//       sender: 'bot',
//     });
//     replies.push({
//       id: uuidv4(),
//       type: 'select-time',
//       text: "",
//       sender: 'bot',
//     });
//   } else if (timeRegex.test(userText)) {
//     replies.push({
//       id: uuidv4(),
//       type: 'text',
//       text: "What your name for the reservation",
//       sender: 'bot',
//     });
//     setpersonName(true);
//   } else {
//     replies.push({
//       id: uuidv4(),
//       type: 'text',
//       text: "I'm here to help you book a table. Which restaurant?",
//       sender: 'bot',
//     });
//   }

//   return replies;
// };



// let botMessages: Message[] = [];

// if (personName === true) {
//   setpersonName(false);
//   setbookingConfirmation(true);
//   // Direct bot response
//   const botReply: TextMessage = {
//     id: uuidv4(),
//     type: 'text',
//     text: `Thank you, ${input.trim()}!\nHow many people will be in your party?`,
//     sender: 'bot',
//   };
//   botMessages.push(botReply);
// } else if (bookingConfirmation == true) {
//   setbookingConfirmation(false);
//   const botReply: TextMessage = {
//     id: uuidv4(),
//     type: 'text',
//     text: "All set! ✨\nWe’ve reserved a table for 4 people under the name James Miller on June 10th at 15:00 PM.",
//     sender: 'bot',
//   };
//   botMessages.push(botReply);
//   const botReply1: bookingConfirmationMessage = {
//     id: uuidv4(),
//     type: 'booking-confirmation',
//     text: 'mm',
//     sender: 'bot',
//   };
//   botMessages.push(botReply1);
// } else {
//   // Normal bot flow

//   botMessages = generateBotReplies(input.trim());
// }

// setMessages(prev => {
//   const updatedMessages = [...prev, userMessage, ...botMessages];
//   requestAnimationFrame(() => {
//     flatListRef.current?.scrollToEnd({ animated: true });
//   });
//   return updatedMessages;
// });
// setIsTyping(false);
// }, 5000);
//
// const onChange = (event: any, selectedDate?: Date) => {
//   //    console.log('onChange event:', event);
//   // console.log('selectedDate:', selectedDate);
//   //   if (event.type === 'dismissed') {
//   //   // User canceled the picker, just close it
//   //   setShowPicker(false);
//   //   return;
//   // }
//   if (selectedDate) {
//     setDate(selectedDate);
//   }
//   // For Android, you can hide picker here but **do not** append message
//   if (Platform.OS === 'android') {
//     onDoneDateSelect(date.toLocaleDateString());
//     setShowPicker(false);
//   }
// };

// const onDoneDateSelect = (messageId: string) => {
//   const formattedDate = date.toLocaleDateString();

//   // Append user message (date text)
//   const userMessage: TextMessage = {
//     id: uuidv4(),
//     type: 'text',
//     text: formattedDate,
//     sender: 'user',
//   };

//   const botMessages = generateBotReplies(userMessage.text);

//   setMessages(prevMessages => {
//     // Mark the select-date message as answered by updating selectedDate
//     const updatedMessages = prevMessages.map(msg => {
//       if (msg.type === 'select-date' && msg.id === messageId) {
//         return {
//           ...msg,
//           selectedDate: formattedDate,
//         };
//       }
//       return msg;
//     });

//     // Add the user message and bot replies after updating
//     return [...updatedMessages, userMessage, ...botMessages];
//   });

//   setShowPicker(false);
// };
// Time picker onChange
// const onTimeChange = (event: any, selectedTime?: Date) => {
//   if (selectedTime) {
//     setTime(selectedTime);
//   }
//   if (Platform.OS === 'android') {
//     onDoneTimeSelect(time.toLocaleDateString());
//     setShowTimePicker(false);
//   }
// };
// Called when user confirms time (iOS "Done" button)
// const onDoneTimeSelect = (messageId: string) => {
//   const formattedTime = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//   // Mark the select-time message as answered by updating selectedTime
//   setMessages(prevMessages => prevMessages.map(msg => {
//     if (msg.type === 'select-time' && msg.id === messageId) {
//       return { ...msg, selectedTime: formattedTime };
//     }
//     return msg;
//   }));

//   // Append user message with selected time
//   const userMessage: TextMessage = {
//     id: uuidv4(),
//     type: 'text',
//     text: formattedTime,
//     sender: 'user',
//   };

//   const botReply: TextMessage = {
//     id: uuidv4(),
//     type: 'text',
//     text: `What your name for the reservation?`,
//     sender: 'bot',
//   };
//   setpersonName(true);
//   setMessages(prev => [...prev, userMessage, botReply]);
//   setShowTimePicker(false);
// };

// useEffect(() => {
//   return () => {
//     //   Tts.stop();
//   };
// }, []);