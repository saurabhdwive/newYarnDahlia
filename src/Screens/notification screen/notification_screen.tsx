// import React, { useEffect, useMemo, useState } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     TextInput,
//     ScrollView,
//     StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import SearchBar from '../promotion/search_bar';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTranslation } from 'react-i18next';
// import { useIsFocused } from '@react-navigation/native';




// type NotificationCardProps = {
//     borderColor: string;
//     message: string;
//     t: (key: string) => string;
// };

// const NotificationCard = ({ borderColor, message, t }: NotificationCardProps) => (
//     <View style={[styles.card,
//       {
//         borderRadius:10,
//     marginTop:5,backgroundColor:'white',paddingRight:20,
//     // overflow:'hidden',

//     }
//     ]}>
//         <View style={[{ flexDirection: 'row',marginRight:5,
// // backgroundColor:'yellow',
//                shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,

//          }]}>
//             <View style={{ backgroundColor: borderColor, width: 30,marginTop:0,borderTopLeftRadius: 11,borderBottomLeftRadius: 11, }}></View>
//             <View style={{ marginLeft:-5,marginRight: 0,marginTop:1,
//               marginBottom:1,backgroundColor:'white',borderRadius:10,

//     }}>
//                 <Text style={[styles.message,{marginRight:10}]}>{message}</Text>
//                 <TouchableOpacity style={styles.moreButton} >
//                     <Text style={styles.moreButtonText}>{t('more')}</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>

//     </View>
// );

// // Define static data outside component
// const NOTIFICATION_KEYS = [
//   {
//     id: 'n1',
//     type: 'critical',
//     titleKey: 'notifications_data.notifications.order_cancelled.title',
//     messageKey: 'notifications_data.notifications.order_cancelled.message',
//   },
//   {
//     id: 'n2',
//     type: 'order',
//     titleKey: 'notifications_data.notifications.points_updated.title',
//     messageKey: 'notifications_data.notifications.points_updated.message',
//   },
//   {
//     id: 'n3',
//     type: 'support',
//     titleKey: 'notifications_data.notifications.profile_updated.title',
//     messageKey: 'notifications_data.notifications.profile_updated.message',
//   },
//   {
//     id: 'n4',
//     type: 'order',
//     titleKey: 'notifications_data.notifications.order_shipped.title',
//     messageKey: 'notifications_data.notifications.order_shipped.message',
//   },
// ];

// const TAB_KEYS = [
//   { key: 'critical', labelKey: 'critical', color: '#E53935', icon: '⚠️' },
//   { key: 'order', labelKey: 'order_tracking', color: '#1E88E5', icon: '📦' },
//   { key: 'support', labelKey: 'support', color: '#2E7D32', icon: '💬' },
// ];

// const NotificationScreen = () => {
//   const { t } = useTranslation();

//   // Use useMemo to create translated data
//   const SAMPLE_NOTIFICATIONS = useMemo(() => 
//     NOTIFICATION_KEYS.map(item => ({
//       ...item,
//       title: t(item.titleKey),
//       message: t(item.messageKey),
//     })), [t]
//   );

//   const TABS = useMemo(() => 
//     TAB_KEYS.map(tab => ({
//       ...tab,
//       label: t(tab.labelKey),
//     })), [t]
//   );

//   const [query, setQuery] = useState('');
//   const [activeTab, setActiveTab] = useState('critical');
//   const isFocused = useIsFocused();

//   useEffect(() => {
//     if (isFocused) {

//       StatusBar.setBarStyle('light-content');
//       StatusBar.setBackgroundColor('grey');
//     }
//   }, [isFocused]);

//   const filtered = useMemo(() => {
//     return SAMPLE_NOTIFICATIONS.filter(
//       n => n.type === activeTab && n.message.toLowerCase().includes(query.toLowerCase()),
//     );
//   }, [activeTab, query, SAMPLE_NOTIFICATIONS]);

//   function renderTab(tab) {
//     const isActive = tab.key === activeTab;
//     return (
//       // <View style ={{flexDirection:'row',gap:4,flex:1}}>
//       <TouchableOpacity
//         key={tab.key}
//         style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
//         onPress={() => setActiveTab(tab.key)}>
//         <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
//           {tab.icon} {tab.label}
//         </Text>
//       </TouchableOpacity>
//       // </View>
//     );
//   }

//   function renderCard({item}) {
//     const meta = TABS.find(t => t.key === item.type) || TABS[0];
//     return (
//       <View style={styles.cardWrap}>
//         <View style={[styles.cardStripe, {backgroundColor: meta.color}]} />
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>{item.title}</Text>
//           <Text style={styles.cardMessage}>{item.message}</Text>
//           <TouchableOpacity style={[styles.moreBtn, {borderColor: meta.color,alignItems:'flex-end',alignSelf:'flex-end'}]}>
//             <Text style={[styles.moreTxt, {color: meta.color}]}>{t('more')}</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }
//     return (
//        <LinearGradient 
//                   colors={['rgb(246,248,260,1)', 'rgb(242,219,218,0.3)']}
//                   locations={[0.4, 0.5]} // 0 → start, 0.3 → 30% mark, 0.9 → 90% mark
//                   start={{ x: 0, y: 0 }}   // top-left
//                   end={{ x: 1, y: 1 }}     // bottom-right
//                   style={{ flex: 1, width: '100%' }}
//                 >
//         <SafeAreaView style={{ flex: 1 }}edges={['top']}>
//           <StatusBar barStyle="light-content" backgroundColor="grey" />
//             <View style={styles.container}>
//          <SearchBar value={query} onChangeText={setQuery} />

//          {/* Tabs */}
//          <View style={styles.tabsRow}>{TABS.map(renderTab)}</View>
//   <View style={{height:10}}></View>

//                 {/* Notification Cards */}
//                <ScrollView
//       style={{ flex: 1 }}
// //      contentContainerStyle={{
// //   flexGrow: 1,
// //   paddingBottom: -80,
// // }}
//       showsVerticalScrollIndicator={false}
//     >
//                     <NotificationCard
//                         borderColor= 'rgb(176,35,24,1)'
//                         message={t('notifications_data.notifications.order_cancelled.message')}
//                         t={t}
//                     />
//                     <NotificationCard
//                         borderColor='rgb(49,95,149,1)'
//                         message={t('notifications_data.notifications.points_updated.message')}
//                         t={t}
//                     />
//                     <NotificationCard
//                         borderColor='rgb(76,122,49,1)'
//                         message={t('notifications_data.notifications.points_updated.message')}
//                         t={t}
//                     />
//                        <NotificationCard
//                         borderColor= 'rgb(176,35,24,1)'
//                         message={t('notifications_data.notifications.order_cancelled.message')}
//                         t={t}
//                     />
//                     <NotificationCard
//                         borderColor='rgb(49,95,149,1)'
//                         message={t('notifications_data.notifications.points_updated.message')}
//                         t={t}
//                     />
//                     <NotificationCard
//                         borderColor='rgb(76,122,49,1)'
//                         message={t('notifications_data.notifications.points_updated.message')}
//                         t={t}
//                     />
//                 </ScrollView>
//             </View>
//         </SafeAreaView>
//         </LinearGradient>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         // backgroundColor: 'yellow',
//         marginHorizontal: 15
//     },

//     card: {

//         // backgroundColor: '#fff',

//         // borderWidth: 5,
//         borderRadius: 10,
//         // padding: 15,
//         marginBottom: 15,
//     },
//     message: {
//         fontSize: 20,
//         fontWeight:'500',
//         lineHeight:27,
//         color: '#000',
//         flexShrink: 1,
//         marginTop: 10,
//         marginLeft: 10,
//         //  marginRight: 408,
//     },
//     moreButton: {
//         marginRight: 20,
//         marginBottom: 10,
//         marginTop: 50,
//         paddingHorizontal: 30,
//         paddingVertical: 5,
//         alignSelf: 'flex-end',
//         borderColor: 'rgb(49,95,149,1)',
//         borderWidth: 1,
//         borderRadius: 20
//     },
//     moreButtonText: {
//         fontSize: 16,
//         fontWeight:'500',
//         color: 'rgb(49,95,149,1)',
//         alignSelf: 'flex-end',
//         // marginTop:30
//         // marginRight: 38,
//         paddingHorizontal:8

//     },
//       tab: {
//     flex: 1,
//     marginHorizontal: 4,
//     // height:,
//     borderRadius: 18,
//     paddingVertical: 4,

//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabActive: {
//     backgroundColor: '#1E88E5',
//     borderWidth: 1, // ✅ Keep border for consistent sizing
//     borderColor: '#1E88E5', // Same as background so it blends in
//   },
//   tabInactive: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     // borderColor: '#E6E6E6',
//     borderColor:'rgb(49,95,149,1)',
//     shadowColor: '#000',
//     shadowOpacity: 0.03,
//     shadowRadius: 4,
//     elevation: 1,
//   },

//   tabLabel: {fontSize: 11, color: 'rgb(49,95,149,1)', fontWeight: '600',textAlign:'center'},
//   tabLabelActive: {color: '#fff'},

//   listContainer: {paddingVertical: 8},
//   cardWrap: {
//     flexDirection: 'row',
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   cardStripe: {
//     width: 12,
//     height: 92,
//     borderRadius: 6,
//     marginRight: 12,
//   },
//   cardTitle: {fontSize: 18, fontWeight: '700', marginBottom: 6},
//   cardMessage: {fontSize: 15, color: '#333', lineHeight: 22, marginBottom: 10},
//   moreBtn: {

//     alignSelf: 'flex-start',
//     paddingVertical: 5,
//     paddingHorizontal: 30,
//     borderRadius: 999,
//     borderWidth: 1.5,
//   },
//   moreTxt: {fontSize: 14, fontWeight: '700'},

//   emptyWrap: {padding: 24, alignItems: 'center'},
//   emptyText: {color: '#888'},
//     tabsRow: {
//     flexDirection: 'row',
//     marginTop: 0,
//     marginBottom: 10,
//     justifyContent: 'space-between',
//   },
// });

// export default NotificationScreen;




























// import React, {useState, useMemo} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import SearchBar from '../promotion/search_bar';

// const TABS = [
//   {key: 'critical', label: 'Critical', color: '#E53935', icon: '⚠️'},
//   {key: 'order', label: 'Order Tracking', color: '#1E88E5', icon: '📦'},
//   {key: 'support', label: 'Support', color: '#2E7D32', icon: '💬'},
// ];

// const SAMPLE_NOTIFICATIONS = [
//   {
//     id: 'n1',
//     type: 'critical',
//     title: 'Order Cancelled',
//     message:
//       'Your order has been cancelled as the rider could not contact you on leaving the store.',
//   },
//   {
//     id: 'n2',
//     type: 'order',
//     title: 'Points Updated',
//     message:
//       'You have earned 50 points from your current order. Your points have been updated to your profile.',
//   },
//   {
//     id: 'n3',
//     type: 'support',
//     title: 'Profile Updated',
//     message:
//       'You have earned 50 points from your current order. Your points have been updated to your profile.',
//   },
//   {
//     id: 'n4',
//     type: 'order',
//     title: 'Order Shipped',
//     message: 'Your order #12345 has been shipped and is on the way.',
//   },
// ];

// export default function PromptScreen() {
//   const [query, setQuery] = useState('');
//   const [activeTab, setActiveTab] = useState('critical');

//   const filtered = useMemo(() => {
//     return SAMPLE_NOTIFICATIONS.filter(
//       n => n.type === activeTab && n.message.toLowerCase().includes(query.toLowerCase()),
//     );
//   }, [activeTab, query]);

//   function renderTab(tab) {
//     const isActive = tab.key === activeTab;
//     return (
//       <TouchableOpacity
//         key={tab.key}
//         style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
//         onPress={() => setActiveTab(tab.key)}>
//         <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
//           {tab.icon} {tab.label}
//         </Text>
//       </TouchableOpacity>
//     );
//   }

//   function renderCard({item}) {
//     const meta = TABS.find(t => t.key === item.type) || TABS[0];
//     return (
//       <View style={styles.cardWrap}>
//         <View style={[styles.cardStripe, {backgroundColor: meta.color}]} />
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>{item.title}</Text>
//           <Text style={styles.cardMessage}>{item.message}</Text>
//           <TouchableOpacity style={[styles.moreBtn, {borderColor: meta.color,alignItems:'flex-end',alignSelf:'flex-end'}]}>
//             <Text style={[styles.moreTxt, {color: meta.color}]}>More</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FBF8F7" />

//       <View style={styles.container}>
//         <SearchBar value={query} onChangeText={setQuery} />

//         {/* Tabs */}
//         <View style={styles.tabsRow}>{TABS.map(renderTab)}</View>

//         {/* List */}
//         <FlatList
//           data={filtered}
//           keyExtractor={i => i.id}
//           renderItem={renderCard}
//           contentContainerStyle={styles.listContainer}
//           ListEmptyComponent={() => (
//             <View style={styles.emptyWrap}>
//               <Text style={styles.emptyText}>No notifications in this category.</Text>
//             </View>
//           )}
//         />
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safe: {flex: 1, backgroundColor: '#FBF8F7'},
//   container: {flex: 1, paddingHorizontal: 18, paddingTop: 12},
//   tabsRow: {
//     flexDirection: 'row',
//     marginTop: 14,
//     marginBottom: 10,
//     justifyContent: 'space-between',
//   },
//   tab: {
//     flex: 1,
//     // marginHorizontal: 6,
//     // height:,
//     borderRadius: 18,
//     paddingVertical: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   tabActive: {
//     backgroundColor: '#1E88E5',
//     borderWidth: 1, // ✅ Keep border for consistent sizing
//     borderColor: '#1E88E5', // Same as background so it blends in
//   },
//   tabInactive: {
//     backgroundColor: '#fff',
//     borderWidth: 1,
//     borderColor: '#E6E6E6',
//     shadowColor: '#000',
//     shadowOpacity: 0.03,
//     shadowRadius: 4,
//     elevation: 1,
//   },

//   tabLabel: {fontSize: 11, color: '#555', fontWeight: '600',textAlign:'center'},
//   tabLabelActive: {color: '#fff'},

//   listContainer: {paddingVertical: 8},
//   cardWrap: {
//     flexDirection: 'row',
//     marginVertical: 10,
//     alignItems: 'center',
//   },
//   cardStripe: {
//     width: 12,
//     height: 92,
//     borderRadius: 6,
//     marginRight: 12,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 14,
//     shadowColor: '#000',
//     shadowOpacity: 0.06,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardTitle: {fontSize: 18, fontWeight: '700', marginBottom: 6},
//   cardMessage: {fontSize: 15, color: '#333', lineHeight: 22, marginBottom: 10},
//   moreBtn: {

//     alignSelf: 'flex-start',
//     paddingVertical: 5,
//     paddingHorizontal: 30,
//     borderRadius: 999,
//     borderWidth: 1.5,
//   },
//   moreTxt: {fontSize: 14, fontWeight: '700'},

//   emptyWrap: {padding: 24, alignItems: 'center'},
//   emptyText: {color: '#888'},
// });


// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTranslation } from 'react-i18next';
// import { useIsFocused } from '@react-navigation/native';
// import SearchBar from '../promotion/search_bar';

// // NotificationCard component
// type NotificationCardProps = {
//   borderColor: string;
//   title: string;
//   message: string;
// };

// const NotificationCard = ({ borderColor, title, message, t }: NotificationCardProps & { t: any }) => (
//   <View style={[styles.card]}>
//     <View style={[styles.cardRow]}>
//       <View style={[{ backgroundColor: borderColor }, styles.cardStripe]} />
//       <View style={styles.cardContent}>
//         <Text style={styles.cardTitle}>{title}</Text>
//         <Text style={styles.cardMessage}>{message}</Text>
//         <TouchableOpacity style={[styles.moreButton]}>
//           <Text style={styles.moreButtonText}>{t('more')}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// );


// // Notification keys
// const NOTIFICATION_KEYS = [
//   {
//     id: 'n1',
//     type: 'critical',
//     titleKey: 'notifications_data.order_cancelled.title',
//     messageKey: 'notifications_data.order_cancelled.message',
//   },
//   {
//     id: 'n2',
//     type: 'order',
//     titleKey: 'notifications_data.points_updated.title',
//     messageKey: 'notifications_data.points_updated.message',
//   },
//   {
//     id: 'n3',
//     type: 'support',
//     titleKey: 'notifications_data.profile_updated.title',
//     messageKey: 'notifications_data.profile_updated.message',
//   },
//   {
//     id: 'n4',
//     type: 'order',
//     titleKey: 'notifications_data.order_shipped.title',
//     messageKey: 'notifications_data.order_shipped.message',
//   },
// ];

// const TAB_KEYS = [
//   { key: 'critical', labelKey: 'critical', color: '#E53935', icon: '⚠️' },
//   { key: 'order', labelKey: 'order_tracking', color: '#1E88E5', icon: '📦' },
//   { key: 'support', labelKey: 'support', color: '#2E7D32', icon: '💬' },
// ];

// const NotificationScreen = () => {
//   const { t } = useTranslation();
//   const isFocused = useIsFocused();

//   const [query, setQuery] = useState('');
//   const [activeTab, setActiveTab] = useState('critical');

//   // Translate notifications dynamically
//   const SAMPLE_NOTIFICATIONS = useMemo(
//     () =>
//       NOTIFICATION_KEYS.map(item => ({
//         ...item,
//         title: t(item.titleKey),
//         message: t(item.messageKey),
//       })),
//     [t]
//   );

//   // Translate tabs dynamically
//   const TABS = useMemo(
//     () =>
//       TAB_KEYS.map(tab => ({
//         ...tab,
//         label: t(tab.labelKey),
//       })),
//     [t]
//   );

//   // Filter notifications based on active tab and search query
//   const filtered = useMemo(() => {
//     return SAMPLE_NOTIFICATIONS.filter(
//       n =>
//         n.type === activeTab &&
//         (n.title.toLowerCase().includes(query.toLowerCase()) ||
//          n.message.toLowerCase().includes(query.toLowerCase()))
//     );
//   }, [activeTab, query, SAMPLE_NOTIFICATIONS]);

//   // Handle StatusBar
//   useEffect(() => {
//     if (isFocused) {
//       StatusBar.setBarStyle('dark-content');
//       StatusBar.setBackgroundColor('#ffffff'); // White for this screen
//     }
//   }, [isFocused]);

//   const renderTab = tab => {
//     const isActive = tab.key === activeTab;
//     return (
//       <TouchableOpacity
//         key={tab.key}
//         style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
//         onPress={() => setActiveTab(tab.key)}
//       >
//         <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
//           {tab.icon} {tab.label}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <LinearGradient
//       colors={['rgba(246,248,260,1)', 'rgba(242,219,218,0.3)']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={{ flex: 1 }}
//     >
//       <SafeAreaView style={{ flex: 1 }} edges={['top']}>
//         <View style={styles.container}>
//           <SearchBar value={query} onChangeText={setQuery} />
//           <View style={styles.tabsRow}>{TABS.map(renderTab)}</View>

//           <ScrollView
//             style={{ flex: 1 }}
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 20 }}
//           >
//             {filtered.length > 0 ? (
//               filtered.map(n => (
//                 <NotificationCard
//                   key={n.id}
//                   borderColor={TABS.find(t => t.key === n.type)?.color || '#000'}
//                   title={n.title}
//                   message={n.message}
//                 />
//               ))
//             ) : (
//               <View style={styles.emptyWrap}>
//                 <Text style={styles.emptyText}>{t('no_notifications')}</Text>
//               </View>
//             )}
//           </ScrollView>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, marginHorizontal: 15 },
//   card: { marginBottom: 15, borderRadius: 10, backgroundColor: 'white', padding: 5 },
//   cardRow: { flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5 },
//   cardStripe: { width: 30, borderTopLeftRadius: 10, borderBottomLeftRadius: 10 },
//   cardContent: { flex: 1, backgroundColor: 'white', borderRadius: 10, padding: 10, marginLeft: -5 },
//   cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 5 },
//   cardMessage: { fontSize: 14, color: '#333', lineHeight: 20 },
//   tab: { flex: 1, marginHorizontal: 4, borderRadius: 18, paddingVertical: 6, alignItems: 'center', justifyContent: 'center' },
//   tabActive: { backgroundColor: '#1E88E5', borderWidth: 1, borderColor: '#1E88E5' },
//   tabInactive: { backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgba(49,95,149,1)', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
//   tabLabel: { fontSize: 11, color: 'rgba(49,95,149,1)', fontWeight: '600', textAlign: 'center' },
//   tabLabelActive: { color: '#fff' },
//   tabsRow: { flexDirection: 'row', marginTop: 0, marginBottom: 10, justifyContent: 'space-between' },
//   emptyWrap: { padding: 24, alignItems: 'center' },
//   emptyText: { color: '#888' },
//   moreButton: {
//   alignSelf: 'flex-end',
//   marginTop: 10,
//   paddingVertical: 5,
//   paddingHorizontal: 15,
//   borderWidth: 1,
//   borderColor: 'rgba(49,95,149,1)',
//   borderRadius: 20,
// },
// moreButtonText: {
//   fontSize: 14,
//   fontWeight: '600',
//   color: 'rgba(49,95,149,1)',
// },

// });

// export default NotificationScreen;




// import React, { useMemo, useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTranslation } from 'react-i18next';
// import { useIsFocused } from '@react-navigation/native';
// import SearchBar from '../promotion/search_bar';


// type NotificationCardProps = {
//   borderColor: string;
//   title: string;
//   message: string;
//   t: (key: string) => string;
// };


// const NotificationCard = ({ borderColor, title, message, t }: NotificationCardProps) => (
//   <View style={styles.cardContainer}>
//     <View style={[styles.card, { borderLeftColor: borderColor }]}>
//       <Text style={styles.cardTitle}>{title}</Text>
//       <Text style={styles.cardMessage}>{message}</Text>
//       <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
//         <TouchableOpacity style={[styles.moreButton, { borderColor: '#1E88E5' }]}>
//           <Text style={[styles.moreButtonText, { color: '#1E88E5' }]}>{t('more')}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// );


// const NOTIFICATION_KEYS = [
//   {
//     id: 'n1',
//     type: 'critical',
//     key: 'order_cancelled',
//   },
//   {
//     id: 'n2',
//     type: 'order',
//     key: 'points_updated',
//   },
//   {
//     id: 'n3',
//     type: 'support',
//     key: 'profile_updated',
//   },
//   {
//     id: 'n4',
//     type: 'order',
//     key: 'order_shipped',
//   },
// ];

// const TAB_KEYS = [
//   { key: 'critical', labelKey: 'critical', color: '#E53935', icon: '⚠️' },
//   { key: 'order', labelKey: 'order_tracking', color: '#1E88E5', icon: '📦' },
//   { key: 'support', labelKey: 'support', color: '#2E7D32', icon: '💬' },
// ];
// function FocusAwareStatusBar(props) {
//   const isFocused = useIsFocused();
//   return isFocused ? <StatusBar {...props} /> : null;
// }
// const NotificationScreen = () => {
//   const { t } = useTranslation();
//   const isFocused = useIsFocused();

//   const [query, setQuery] = useState('');
//   const [activeTab, setActiveTab] = useState('critical');

//   // Change status bar based on screen focus
//   // useEffect(() => {
//   //   if (isFocused) {
//   //     StatusBar.setBarStyle('light-content');
//   //     StatusBar.setBackgroundColor('grey');
//   //   }
//   // }, [isFocused]);

//   // Translate notifications
//   const notifications = useMemo(() => {
//     return NOTIFICATION_KEYS.map(n => ({
//       ...n,
//       title: t(`notifications_data.${n.key}.title`),
//       message: t(`notifications_data.${n.key}.message`),
//     }));
//   }, [t]);

//   const tabs = useMemo(() => {
//     return TAB_KEYS.map(tab => ({
//       ...tab,
//       label: t(tab.labelKey),
//     }));
//   }, [t]);

//   const filteredNotifications = useMemo(() => {
//     return notifications.filter(
//       n =>
//         n.type === activeTab &&
//         n.message.toLowerCase().includes(query.toLowerCase())
//     );
//   }, [activeTab, query, notifications]);

//   const renderTab = (tab) => {
//     const isActive = tab.key === activeTab;
//     return (
      
//       <TouchableOpacity
//         key={tab.key}
//         style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
//         onPress={() => setActiveTab(tab.key)}
//       >
//         <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
//           {tab.icon} {tab.label}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//      <>
//      <FocusAwareStatusBar barStyle="light-content" backgroundColor="grey" />
//     <LinearGradient
//       colors={['#F6F8FC', '#F2DBDA']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={{ flex: 1 }}
//     >
//       <SafeAreaView style={{ flex: 1 }} edges={['top']}>
//         {/* <StatusBar barStyle="dark-content" backgroundColor="white" /> */}
//         <View style={styles.container}>
//           <SearchBar value={query} onChangeText={setQuery} />

//           {/* Tabs */}
//           <View style={styles.tabsRow}>{tabs.map(renderTab)}</View>

//           <ScrollView showsVerticalScrollIndicator={false}>
//             {filteredNotifications.map(n => (
//               <NotificationCard
//                 key={n.id}
//                 borderColor={tabs.find(t => t.key === n.type)?.color || '#000'}
//                 title={n.title}
//                 message={n.message}
//                 t={t}
//               />
//             ))}
//           </ScrollView>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, marginHorizontal: 15 },
//   tabsRow: { flexDirection: 'row', marginTop: 0, marginBottom: 10, justifyContent: 'space-between' },
//   tab: { flex: 1, marginHorizontal: 4, borderRadius: 18, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' },
//   tabActive: { backgroundColor: '#1E88E5', borderWidth: 1, borderColor: '#1E88E5' },
//   tabInactive: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1E88E5', elevation: 1 },
//   tabLabel: { fontSize: 11, color: '#1E88E5', fontWeight: '600', textAlign: 'center' },
//   tabLabelActive: { color: '#fff' },

//   cardContainer: { marginVertical: 5 },
//   card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, borderLeftWidth: 5 },
//   cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
//   cardMessage: { fontSize: 15, color: '#333', lineHeight: 22 },
//   moreButton: { marginTop: 10, alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1 },
//   moreButtonText: { fontSize: 14, fontWeight: '700' },
// });

// export default NotificationScreen;


// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   StatusBar,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import LinearGradient from 'react-native-linear-gradient';
// import { useTranslation } from 'react-i18next';
// import { useIsFocused } from '@react-navigation/native';
// import SearchBar from '../promotion/search_bar';

// // NotificationCard component
// type NotificationCardProps = {
//   borderColor: string;
//   title: string;
//   message: string;
//   t: (key: string) => string;
// };

// const NotificationCard = ({ borderColor, title, message, t }: NotificationCardProps) => (
//   <View style={styles.cardContainer}>
//     <View style={[styles.card, { borderLeftColor: borderColor }]}>
//       {/* <Text style={styles.cardTitle}>{title}</Text> */}
//       <Text style={styles.cardMessage}>{message}</Text>
//       <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
//         <TouchableOpacity style={[styles.moreButton, { borderColor }]}>
//           <Text style={[styles.moreButtonText, { color: borderColor }]}>{t('more')}</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   </View>
// );

// // Notification & tab keys
// const NOTIFICATION_KEYS = [
//   { id: 'n1', type: 'critical', key: 'order_cancelled' },
//   { id: 'n2', type: 'order', key: 'points_updated' },
//   { id: 'n3', type: 'support', key: 'profile_updated' },
//   { id: 'n4', type: 'order', key: 'order_shipped' },
// ];

// const TAB_KEYS = [
//   { key: 'critical', labelKey: 'critical', color: '#E53935', icon: '⚠️' },
//   { key: 'order', labelKey: 'order_tracking', color: '#1E88E5', icon: '📦' },
//   { key: 'support', labelKey: 'support', color: '#2E7D32', icon: '💬' },
// ];

// const NotificationScreen = () => {
//   const { t } = useTranslation();
//   const isFocused = useIsFocused();

//   const [query, setQuery] = useState('');
//   const [activeTab, setActiveTab] = useState('critical');

//   // Change StatusBar based on screen focus
//   useEffect(() => {
//     if (isFocused) {
//       StatusBar.setBarStyle('light-content');
//       StatusBar.setBackgroundColor('grey');
//     }
//   }, [isFocused]);

//   // Translate notifications dynamically
//   const notifications = useMemo(() => {
//     return NOTIFICATION_KEYS.map(n => ({
//       ...n,
//       title: t(`notifications_data.${n.key}.title`),
//       message: t(`notifications_data.${n.key}.message`),
//     }));
//   }, [t]);

//   // Translate tabs dynamically
//   const tabs = useMemo(() => {
//     return TAB_KEYS.map(tab => ({
//       ...tab,
//       label: t(tab.labelKey),
//     }));
//   }, [t]);

//   // Filter notifications by active tab and search query
//   const filteredNotifications = useMemo(() => {
//     return notifications.filter(
//       n =>
//         n.type === activeTab &&
//         (n.title.toLowerCase().includes(query.toLowerCase()) ||
//           n.message.toLowerCase().includes(query.toLowerCase()))
//     );
//   }, [activeTab, query, notifications]);

//   const renderTab = (tab) => {
//     const isActive = tab.key === activeTab;
//     return (
//       <TouchableOpacity
//         key={tab.key}
//         style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
//         onPress={() => setActiveTab(tab.key)}
//       >
//         <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
//           {tab.icon} {tab.label}
//         </Text>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <LinearGradient
//       colors={['#F6F8FC', '#F2DBDA']}
//       start={{ x: 0, y: 0 }}
//       end={{ x: 1, y: 1 }}
//       style={{ flex: 1 }}
//     >
//       <SafeAreaView style={{ flex: 1 }} edges={['top']}>
//         <View style={styles.container}>
//           <SearchBar value={query} onChangeText={setQuery} />
//           <View style={styles.tabsRow}>{tabs.map(renderTab)}</View>
//           <ScrollView showsVerticalScrollIndicator={false}>
//             {filteredNotifications.length > 0 ? (
//               filteredNotifications.map(n => (
//                 <NotificationCard
//                   key={n.id}
//                   borderColor={tabs.find(t => t.key === n.type)?.color || '#000'}
//                   title={n.title}
//                   message={n.message}
//                   t={t}
//                 />
//               ))
//             ) : (
//               <View style={styles.emptyWrap}>
//                 <Text style={styles.emptyText}>{t('no_notifications')}</Text>
//               </View>
//             )}
//           </ScrollView>
//         </View>
//       </SafeAreaView>
//     </LinearGradient>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, marginHorizontal: 15 },
//   tabsRow: { flexDirection: 'row', marginTop: 0, marginBottom: 10, justifyContent: 'space-between' },
//   tab: { flex: 1, marginHorizontal: 4, borderRadius: 18, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' },
//   tabActive: { backgroundColor: '#1E88E5', borderWidth: 1, borderColor: '#1E88E5' },
//   tabInactive: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1E88E5', elevation: 1 },
//   tabLabel: { fontSize: 11, color: '#1E88E5', fontWeight: '600', textAlign: 'center' },
//   tabLabelActive: { color: '#fff' },

//   cardContainer: { marginVertical: 5 },
//   card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, borderLeftWidth: 5 },
//   cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
//   cardMessage: { fontSize: 15, color: '#333', lineHeight: 22 },
//   moreButton: { marginTop: 10, alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1 },
//   moreButtonText: { fontSize: 14, fontWeight: '700' },

//   emptyWrap: { padding: 24, alignItems: 'center' },
//   emptyText: { color: '#888' },
// });

// export default NotificationScreen;





import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '../promotion/search_bar';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';

type NotificationCardProps = {
    borderColor: string;
    message: string;
    t: (key: string) => string;
};

const NotificationCard = ({ borderColor, message, t }: NotificationCardProps) => (
    <View style={[styles.card, { backgroundColor: 'white', paddingRight: 20 }]}>
        <View style={{
            flexDirection: 'row',
            marginRight: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 5,
        }}>
            <View style={{ backgroundColor: borderColor, width: 30, borderTopLeftRadius: 11, borderBottomLeftRadius: 11 }} />
            <View style={{ marginLeft: -5, marginTop: 1, marginBottom: 1, backgroundColor: 'white', borderRadius: 10, flex: 1 }}>
                <Text style={[styles.message, { marginRight: 10 }]}>{message}</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreButtonText}>{t('more')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
);

// Notifications and tabs
const NOTIFICATION_KEYS = [
    { id: 'n1', type: 'critical', key: 'order_cancelled' },
    { id: 'n2', type: 'order', key: 'points_updated' },
    { id: 'n3', type: 'support', key: 'profile_updated' },
    { id: 'n4', type: 'order', key: 'order_shipped' },
];

const TAB_KEYS = [
    { key: 'critical', labelKey: 'critical', color: '#E53935', icon: '⚠️' },
    { key: 'order', labelKey: 'order_tracking', color: '#1E88E5', icon: '📦' },
    { key: 'support', labelKey: 'support', color: '#2E7D32', icon: '💬' },
];

const NotificationScreen = () => {
    const { t } = useTranslation();
    const isFocused = useIsFocused();

    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState('critical');

    // StatusBar config
    useEffect(() => {
        if (isFocused) {
            StatusBar.setBarStyle('light-content');
            StatusBar.setBackgroundColor('grey');
        }
    }, [isFocused]);

    // Localized notifications
    const notifications = useMemo(() => {
        return NOTIFICATION_KEYS.map(n => ({
            ...n,
            message: t(`notifications_data.${n.key}.message`),
        }));
    }, [t]);

    // Localized tabs
    const tabs = useMemo(() => {
        return TAB_KEYS.map(tab => ({
            ...tab,
            label: t(tab.labelKey),
        }));
    }, [t]);

    // Filtered notifications by tab and search
    const filteredNotifications = useMemo(() => {
        return notifications.filter(
            n =>
                n.type === activeTab &&
                n.message.toLowerCase().includes(query.toLowerCase())
        );
    }, [activeTab, query, notifications]);

    const renderTab = (tab) => {
        const isActive = tab.key === activeTab;
        return (
            <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
                onPress={() => setActiveTab(tab.key)}>
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                    {tab.icon} {tab.label}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={['rgba(246,248,260,1)', 'rgba(242,219,218,0.3)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, width: '100%' }}
        >
            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                <View style={styles.container}>
                    <SearchBar value={query} onChangeText={setQuery} />

                    {/* Tabs */}
                    <View style={styles.tabsRow}>{tabs.map(renderTab)}</View>
                    <View style={{ height: 10 }} />

                    {/* Notifications */}
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map(n => (
                                <NotificationCard
                                    key={n.id}
                                    borderColor={tabs.find(t => t.key === n.type)?.color || '#000'}
                                    message={n.message}
                                    t={t}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyWrap}>
                                <Text style={styles.emptyText}>{t('no_notifications')}</Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, marginHorizontal: 15 },

    card: { borderRadius: 10, marginBottom: 15 },
    message: { fontSize: 20, fontWeight: '500', lineHeight: 27, color: '#000', flexShrink: 1, marginTop: 10, marginLeft: 10 },
    moreButton: { marginRight: 0, marginBottom: 10, marginTop: 50, paddingHorizontal: 30, paddingVertical: 5, alignSelf: 'flex-end', borderColor: 'rgb(49,95,149,1)', borderWidth: 1, borderRadius: 20 },
    moreButtonText: { fontSize: 16, fontWeight: '500', color: 'rgb(49,95,149,1)', alignSelf: 'flex-end', paddingHorizontal: 8 },

    tab: { flex: 1, marginHorizontal: 4, borderRadius: 18, paddingVertical: 4, alignItems: 'center', justifyContent: 'center' },
    tabActive: { backgroundColor: '#1E88E5', borderWidth: 1, borderColor: '#1E88E5' },
    tabInactive: { backgroundColor: '#fff', borderWidth: 1, borderColor: 'rgb(49,95,149,1)', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
    tabLabel: { fontSize: 11, color: 'rgb(49,95,149,1)', fontWeight: '600', textAlign: 'center' },
    tabLabelActive: { color: '#fff' },

    tabsRow: { flexDirection: 'row', marginTop: 0, marginBottom: 10, justifyContent: 'space-between' },

    emptyWrap: { padding: 24, alignItems: 'center' },
    emptyText: { color: '#888' },
});

export default NotificationScreen;
