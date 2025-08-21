// import 'react-native-get-random-values';
// import React, { useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     StyleSheet,
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
// } from 'react-native';
// // import Tts from 'react-native-tts';
// import { v4 as uuidv4 } from 'uuid';
// import { SafeAreaView } from 'react-native-safe-area-context';

// const ChatScreen = () => {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');

//     useEffect(() => {
//         return () => {
//             //   Tts.stop();
//         };
//     }, []);

//     const sendMessage = () => {
//         if (!input.trim()) return;

//         const userMessage = { id: uuidv4(), type: 'text', text: input.trim(), sender: 'user' };
//         const botMessages = generateBotReplies(input.trim());

//         setMessages(prev => [...prev, userMessage, ...botMessages]);
//         setInput('');
//     };

//     const generateBotReplies = (userText) => {
//         let replies = [];

//         if (userText.toLowerCase().includes('pizza')) {
//             replies.push({
//                 id: uuidv4(),
//                 type: 'text',
//                 text: "Pizza Mania sounds great! What date would you like to book?",
//                 sender: 'bot',
//             });
//         } else if (userText.toLowerCase().includes('sushi')) {
//             replies.push({
//                 id: uuidv4(),
//                 type: 'text',
//                 text: "Sushi Delight? Nice choice! When are you planning to dine?",
//                 sender: 'bot',
//             });
//         } else if (userText.toLowerCase().includes('thai food')) {
//             replies.push({
//                 id: uuidv4(),
//                 type: 'text',
//                 text: "Thai food? Yum! Here are some popular dishes:",
//                 sender: 'bot',
//             });

//             replies.push({
//                 id: uuidv4(),
//                 type: 'horizontal-list',
//                 items: [
//                     { id: '1', name: 'Pad Thai' },
//                     { id: '2', name: 'Green Curry' },
//                     { id: '3', name: 'Tom Yum Soup' },
//                     { id: '4', name: 'Mango Sticky Rice' },
//                 ],
//                 sender: 'bot',
//             });
//         } else {
//             replies.push({
//                 id: uuidv4(),
//                 type: 'text',
//                 text: "I'm here to help you book a table. Which restaurant?",
//                 sender: 'bot',
//             });
//         }

//         return replies;
//     };

//     const renderItem = ({ item }) => {
//         if (item.type === 'text') {
//             return (
//                 <View
//                     style={[styles.bubble, item.sender === 'user' ? styles.userBubble : styles.botBubble]}
//                     accessibilityLabel={`${item.sender === 'user' ? 'You' : 'Bot'}: ${item.text}`}
//                 >
//                     <Text style={styles.bubbleText}>{item.text}</Text>
//                 </View>
//             );
//         }

//         if (item.type === 'horizontal-list') {
//             return (
//                 <View style={[styles.bubble, styles.botBubble, styles.thaiListContainer]}>
//                     <FlatList
//                         data={item.items}
//                         renderItem={({ item }) => (
//                             <View style={styles.thaiItem}>
//                                 <Text style={styles.thaiText}>{item.name}</Text>
//                             </View>
//                         )}
//                         keyExtractor={item => item.id}
//                         horizontal
//                         showsHorizontalScrollIndicator={false}
//                         contentContainerStyle={styles.thaiList}
//                     />
//                 </View>
//             );
//         }

//         return null;
//     };

//     return (
//         //  <SafeAreaView style={styles.safeArea}>
//         <KeyboardAvoidingView
//             style={styles.container}
//             behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//             keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
//         >
//             <FlatList
//                 data={messages}
//                 renderItem={renderItem}
//                 keyExtractor={item => item.id}
//                 contentContainerStyle={styles.chatContainer}
//                 initialNumToRender={10}
//             />

//             <View style={styles.inputBar}>
//                 <TextInput
//                     style={styles.input}
//                     value={input}
//                     onChangeText={setInput}
//                     placeholder="Type your message..."
//                     placeholderTextColor="#888"
//                     returnKeyType="send"
//                     onSubmitEditing={sendMessage}
//                     accessibilityLabel="Message input"
//                     accessibilityHint="Type your message and press send or return to submit"
//                 />
//                 <TouchableOpacity
//                     onPress={sendMessage}
//                     style={[styles.sendButton, !input.trim() && styles.disabledButton]}
//                     disabled={!input.trim()}
//                     accessibilityLabel="Send message"
//                     accessibilityRole="button"
//                 >
//                     <Text style={styles.sendText}>Send</Text>
//                 </TouchableOpacity>
//             </View>
//         </KeyboardAvoidingView>
//         // </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     container: { flex: 1, backgroundColor: '#fff' },
//     chatContainer: { padding: 10, paddingBottom: 20 },
//     bubble: {
//         padding: 12,
//         marginVertical: 5,
//         borderRadius: 15,
//         maxWidth: '100%',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.1,
//         shadowRadius: 2,
//         elevation: 2,
//     },
//     userBubble: { backgroundColor: '#DCF8C6', alignSelf: 'flex-end' },
//     botBubble: { backgroundColor: '#E5E5EA', alignSelf: 'flex-start' },
//     bubbleText: { fontSize: 16, color: '#000' },
//     inputBar: {
//         flexDirection: 'row',
//         padding: 10,
//         borderTopWidth: 1,
//         borderColor: '#ccc',
//         backgroundColor: '#fff',
//     },
//     input: {
//         flex: 1,
//         borderWidth: 1,
//         borderColor: '#ccc',
//         borderRadius: 20,
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//         fontSize: 16,
//         backgroundColor: '#f9f9f9',
//     },
//     sendButton: {
//         marginLeft: 10,
//         justifyContent: 'center',
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//         backgroundColor: '#007AFF',
//         borderRadius: 20,
//     },
//     disabledButton: {
//         backgroundColor: '#ccc',
//     },
//     sendText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//     thaiListContainer: {
//         height: 120,
//         justifyContent: 'center',
//     },
//     thaiList: {
//         paddingVertical: 5,
//         paddingLeft: 5,
//         height: 120,
//         // width:120
//     },
//     thaiItem: {
//         backgroundColor: '#FFECB3',
//         padding: 10,
//         marginRight: 10,
//         borderRadius: 10,
//         elevation: 2,
//         height: 100, // fits within 120 bubble height
//         width: 100,
//     },
//     thaiText: {
//         fontSize: 16,
//         color: '#333',
//     },
// });

// export default ChatScreen;