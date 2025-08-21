import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from './search_bar';
import { Divider } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { PromotionListResponse } from '../../models/promotion_list_model';
import { promotionList_api } from '../../api_functions/api_functions';
import { useNavigation, CommonActions, NavigationProp, useIsFocused } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { FlatList } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import OrderStack from '../../navigation/OrderStack';
import AskMartynaScreen from '../HomeScreen';

type BottomTabParamList = {
  [key: string]: any; // Allow any tab name for flexibility
  WebViewScreen: { url: string | undefined };
};
function FocusAwareStatusBar(props) {
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} /> : null;
}
const PromotionScreen = () => {
   const { t } = useTranslation();
  const [promotionData, setPromotionData] = useState<PromotionListResponse>({});
  const [activeTab, setActiveTab] = useState<string>(''); // default tab
  const [loading, setLoading] = React.useState(true);
  const [apiLoading, setapiLoading] = React.useState(true);
  const navigation = useNavigation<BottomTabNavigationProp<BottomTabParamList>>();
  const [query, setQuery] = useState('');

  // Debug: Log the actual tab names
  useEffect(() => {
    console.log('🔍 PromotionScreen Debug:');
    console.log('📱 Translation order_now:', t('order_now'));
    console.log('📱 Translation promotion:', t('promotion'));
    console.log('📱 Navigation state:', navigation.getState());
  }, [t, navigation]);

  const TABS = Object.keys(promotionData);

  const promotionList_Api = async () => {
    setLoading(true); // start loader for API
    try {
      const response = await promotionList_api();

      if (response && Array.isArray(response) && response[0]) {
        const data: PromotionListResponse = response[0]; // type-cast safely
        setPromotionData(data);

        // Optionally set the active tab if not already set
        const keys = Object.keys(data);
        if (keys.length && !activeTab) setActiveTab(keys[0]);
      } else {
        Alert.alert('No Data Found');
      }
    } catch (error) {
      console.error('Promotion API error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setapiLoading(false); // hide loader after API finishes
    }
  };

  useEffect(() => {
    promotionList_Api(); // call it here
  }, []);

  // function renderTab(tab) {
  //   const isActive = tab === activeTab;
  //   return (
  //     // <View style ={{flexDirection:'row',gap:4,flex:1}}>
  //     <TouchableOpacity
  //       key={tab}
  //       // style={{borderRadius:8,borderColor:'red',borderWidth:1,paddingHorizontal:10}}
  //       style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
  //       onPress={() => setActiveTab(tab)}>
  //       <Text style={[
  //         styles.tabLabel, isActive && styles.tabLabelActive

  //       ]}>
  //         {/* {tab.icon} {tab.label} */}
  //         {tab}
  //       </Text>
  //     </TouchableOpacity>
  //     // </View>
  //   );
  // }
  function renderTab(tab) {
    const isActive = tab === activeTab;
    return (
      //   <TouchableOpacity
      //     key={tab}
      //     style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
      //     onPress={() => setActiveTab(tab)}
      //   >
      //     <Text style={isActive ? styles.tabLabelActive : styles.tabLabel}>
      //       {tab}
      //     </Text>
      //   </TouchableOpacity>
      // );
      <TouchableOpacity
        key={tab}
        style={[styles.tab, isActive ? styles.tabActive : styles.tabInactive]}
        onPress={() => setActiveTab(tab)}
      >
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab}</Text>
      </TouchableOpacity>
    )
  }
  useEffect(() => {
    console.log('Filtered Promotions:', filteredPromotions);
  }, [query, promotionData, activeTab]);
  const filteredPromotions = promotionData[activeTab]?.filter((item) => {
    if (!item?.Url) return false;

    const searchText = query.toLowerCase();

    // Check multiple fields for matches
    return (
      (item.Url.Brand?.toLowerCase().includes(searchText))
      // ||
      // (item.Url.StoreUrl?.toLowerCase().includes(searchText)) ||
      // (item.Url.ImageUrl?.toLowerCase().includes(searchText))
    );
  }) || [];
  const insets = useSafeAreaInsets();
  // const isFocused = useIsFocused();

  // useEffect(() => {
  //   if (isFocused) {
    
  //     StatusBar.setBarStyle('light-content');
  //     StatusBar.setBackgroundColor('grey');
  //   }
  // }, [isFocused]);
  return (
    <>
      <FocusAwareStatusBar barStyle="light-content" backgroundColor="grey" />
    <LinearGradient
      colors={['rgb(246,248,260,1)', 'rgb(242,219,218,0.3)']}
      locations={[0.4, 0.5]} // 0 → start, 0.3 → 30% mark, 0.9 → 90% mark
      start={{ x: 0, y: 0 }}   // top-left
      end={{ x: 1, y: 1 }}     // bottom-right
      style={{ flex: 1, width: '100%' }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* <StatusBar barStyle="light-content" backgroundColor="grey" /> */}

        {apiLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="grey" />
          </View>
        ) : (

          <View style={[styles.container, { flex: 1 }]}>
            <SearchBar value={query} onChangeText={setQuery} />
            {/* <ScrollView
             horizontal
               showsHorizontalScrollIndicator={false} > 
              <View style={styles.tabsRow}>{TABS.map(renderTab)}</View>
            </ScrollView> */}

            {/* <ScrollView
            
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsRow}
            >
              {TABS.map(renderTab)} */}
            {/* {TABS.map((tab, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    // styles.tab, 
                    tab == activeTab ? styles.tabActive : styles.tabInactive
                  ]
                  }
                >
                  <Text
                    style={[
                      styles.tabLabel,
                        // tab == activeTab && styles.tabLabelActive
                    ]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))} */}
            {/* </ScrollView> */}
            <View style={{ height: 30 }}>
              <FlatList
                style={{}}
                horizontal
                data={TABS}
                keyExtractor={(item) => item}
                renderItem={({ item }) => renderTab(item)}
                contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 0 }}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View style={{ height: 15 }}></View>

            <View style={{ flex: 1 }}>
              <ScrollView showsVerticalScrollIndicator={false}
                //  contentContainerStyle={{ paddingBottom:  84}}

                style={{
                  // height:'80%',
                  // flex:1,    
                }}>
                {/* {restaurantData.map((r, i) => (
             */}

                {/* {promotionData[activeTab]?.map((restaurant, index) => ( */}
                {filteredPromotions.map((restaurant, index) => (

                  <View key={index} style={[styles.card, {
                  }]}>
                    {/* <Image source={restaurant.Url?.ImageUrl} style={styles.image} /> */}
                    {/* <Image source={{ uri: restaurant?.Url?.ImageUrl }} style={styles.image} />
                 */}
                    <View style={{ width: '100%', height: 130, justifyContent: 'center', alignItems: 'center' }}>
                      {loading && (
                        <ActivityIndicator
                          size="small"
                          color="#000"
                          style={{ position: 'absolute' }}
                        />
                      )}
                      <Image
                        source={{ uri: restaurant?.Url?.ImageUrl }}
                        style={styles.image}
                        onLoadStart={() => setLoading(true)}
                        onLoadEnd={() => setLoading(false)}
                      />
                    </View>
                    {/* Top Row */}
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={[styles.title, { marginVertical: 5 }]}>{restaurant.Url?.Brand}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 4, marginVertical: 5 }}>
                          <Image source={require('../../../assets/images/locationn.png')} style={{ height: 18, width: 18 }}></Image>
                          <Text style={[styles.subText, {}]}>{0} Branches</Text>
                        </View>
                      </View>
                      <Text style={[styles.price, { marginVertical: 5 }]}>
                        <Text style={styles.currency}>THB</Text> {0}
                      </Text>
                    </View>

                    {/* Buttons Row */}
                    <View style={styles.actionRow}>
                      <TouchableOpacity style={styles.actionButton}
                        onPress={() => {
                          navigation.navigate('WebViewScreen', {
                            url: restaurant.Url?.StoreUrl,
                          });
                        }}
                      >
                        <Text style={styles.chipText}>Delivery</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}
                        onPress={() => {
                          // Navigate to the Order now tab and pass restaurant name
                          const restaurantName = restaurant.Url?.Brand || 'Unknown Restaurant';
                          console.log('🍽️ Navigating to Order now tab with restaurant:', restaurantName);
                          
                          // Get the actual tab name from translations
                          const tabName = t('order_now');
                          console.log('📍 Tab name from translation:', tabName);
                          
                          // Navigation flow:
                          // 1. Try jumpTo (tab navigator method) - most reliable for tab switching
                          // 2. Fallback to parent navigator if jumpTo fails
                          try {
                            (navigation as any).jumpTo(tabName, {
                              screen: 'AskMartynaScreen',
                              params: { restaurantName },
                            });
                          } catch (error) {
                            console.log('📍 jumpTo failed, trying parent navigator');
                            const parentNavigation = navigation.getParent();
                            if (parentNavigation) {
                              parentNavigation.navigate(tabName, {
                                screen: 'AskMartynaScreen',
                                params: { restaurantName },
                              });
                            }
                          }
                        }}
                      >
                        <Text style={styles.chipText}>Reserve Table</Text>
                      </TouchableOpacity>
                      <Text style={styles.ratingText}>⭐ {0} ({0} reviews)</Text>
                    </View>

                    {/* Promo Text */}
                    {/* <Text style={styles.promoText}>{'0'}</Text> */}
                  </View>

                ))}
              </ScrollView>
            </View>
          </View>

        )}
      </SafeAreaView>
    </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12 },

  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    // justifyContent:'center',
    marginBottom: 16,
    // marginHorizontal:15
    gap: 10
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    borderWidth: 0.5,
    // borderColor: '#ccc',
    borderColor: 'rgb(49,95,149,1)',
  },
  categoryText: {
    fontSize: 12,
    color: 'rgb(49,95,149,1)',
    fontWeight: '500',
    textAlign: 'center',
    overflow: 'hidden',
  },

  card: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    // iOS shadow
    // shadowColor: 'red',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,

    // Android shadow
    elevation: 2,
  },
  image: {

    width: '100%',
    height: 130,
    resizeMode: 'cover',
    borderRadius: 12
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgb(113,113,113,1)',
  },
  subText: {
    fontSize: 13,
    color: 'rgb(140,140,140,1)',
    marginTop: 2,
  },
  price: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  currency: {
    fontWeight: '800',
    color: '#555',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 0.5,
    // borderColor: 'rgb(55,132,219,1)',
    borderColor: 'rgb(56,134,218,1)',
  },
  chipText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgb(56,134,218,1)',
    marginHorizontal: 10
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginLeft: 'auto',
  },
  promoText: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 12,
    paddingBottom: 12,
    lineHeight: 16,
  },
  tab: {
    // flex: 1,
    marginHorizontal: 4,
    // height:,
    borderRadius: 18,
    paddingVertical: 4,
    paddingHorizontal: 25,


    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: '#1E88E5',
    borderWidth: 1, // ✅ Keep border for consistent sizing
    borderColor: '#1E88E5', // Same as background so it blends in
  },
  tabInactive: {

    backgroundColor: '#fff',
    borderWidth: 1,
    // borderColor: '#E6E6E6',
    borderColor: 'rgb(49,95,149,1)',
    // shadowColor: '#000',
    // shadowOpacity: 0.03,
    // shadowRadius: 4,
    // elevation: 1,
  },

  tabLabel: {
    marginBottom: 0,
    lineHeight: 16,      // consistent line height
    fontSize: 11,
    color: 'rgb(49,95,149,1)',
    fontWeight: '600',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#fff',
    fontSize: 11,
    // color: 'rgb(49,95,149,1)',
    fontWeight: '600',
    textAlign: 'center',

  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  // tabsRow: {
  //   flexDirection: 'row',
  //   paddingHorizontal: 4,
  //   alignItems: 'center', // vertically center all tabs
  // },
  // tab: {
  //   borderRadius: 18,
  //   paddingVertical: 8,
  //   paddingHorizontal: 20,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginHorizontal: 4,
  //   // minWidth: 60, // optional: ensures small tabs aren’t tiny
  // },
  // tabActive: {
  //   backgroundColor: '#1E88E5',
  //   borderWidth: 1,
  //   borderColor: '#1E88E5',
  // },
  // tabInactive: {
  //   backgroundColor: '#fff',
  //   borderWidth: 1,
  //   borderColor: 'rgb(49,95,149,1)',
  // },
  // tabLabel: {
  //   fontSize: 11,
  //   fontWeight: '600',
  //   lineHeight: 16,
  //   textAlign: 'center',
  //   color: 'rgb(49,95,149,1)',
  // },
  // tabLabelActive: {
  //   color: '#fff',
  // },
});

export default PromotionScreen;



// const restaurantData = [
//     {
//       name: 'Sushi Hiro',
//       branches: 15,
//       priceRange: '500 – 1,200',
//       rating: 4.4,
//       reviews: 285,
//       image: require('../../../assets/images/bannerr.png'),
//       promoText: 'ส่งฟรี 15 กม. 60% ส่วนลด 5 กม. 10 กม. 15 กม. ฟรี! 5 กม. 300-500 THB 10 กม. 500-700 THB 15 กม. 1,200 THB'
//     },
//     {
//       name: 'Sushi Hiro',
//       branches: 15,
//       priceRange: '500 – 1,200',
//       rating: 4.4,
//       reviews: 285,
//       image: require('../../../assets/images/bannerr.png'),
//       promoText: 'ส่งฟรี 15 กม. 60% ส่วนลด 5 กม. 10 กม. 15 กม. ฟรี! 5 กม. 300-500 THB 10 กม. 500-700 THB 15 กม. 1,200 THB'
//     },
//     {
//       name: 'Sushi Hiro',
//       branches: 15,
//       priceRange: '500 – 1,200',
//       rating: 4.4,
//       reviews: 285,
//       image: require('../../../assets/images/bannerr.png'),
//       promoText: 'ส่งฟรี 15 กม. 60% ส่วนลด 5 กม. 10 กม. 15 กม. ฟรี! 5 กม. 300-500 THB 10 กม. 500-700 THB 15 กม. 1,200 THB'
//     },
//     {
//       name: 'Sushi Hiro',
//       branches: 15,
//       priceRange: '500 – 1,200',
//       rating: 4.4,
//       reviews: 285,
//       image: require('../../../assets/images/bannerr.png'),
//       promoText: 'ส่งฟรี 15 กม. 60% ส่วนลด 5 กม. 10 กม. 15 กม. ฟรี! 5 กม. 300-500 THB 10 กม. 500-700 THB 15 กม. 1,200 THB'
//     },
//   ];

// useEffect(() => {
//   const keys = Object.keys(promotionData);
//   if (keys.length && !activeTab) setActiveTab(keys[0]);
// }, [promotionData]);


// useEffect(() => {
//   const fetchData = async () => {
//     await promotionList_Api();
//   };
//   fetchData();
// }, []); // <-- empty array ensures it runs only once

// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';

// import { SafeAreaView } from 'react-native-safe-area-context';
// import SearchBar from './search_bar';
// const PromotionScreen = () => {
//     const restaurantData = [
//         {
//             name: 'Sushi Hiro',
//             branches: 15,
//             priceRange: '500 – 1,200',
//             rating: 4.4,
//             reviews: 285,
//             image: require('../../../assets/images/promotionn.jpg'), // Replace with actual image URL
//             promoText: 'ส่งฟรี 15 กม. 60% ส่วนลด 5 กม. 10 กม. 15 กม. ฟรี! 5 กม. 300-500 THB 10 กม. 500-700 THB 15 กม. 1,200 THB'
//         },
//         {
//             name: 'Sushi Hiro',
//             branches: 15,
//             priceRange: '500 – 1,200',
//             rating: 4.4,
//             reviews: 285,
//             image: require('../../../assets/images/promotionn.jpg'), // Replace with actual image URL
//             promoText: 'ส่งฟรี 15 กม. 60% ส่วนลด 5 กม. 10 กม. 15 กม. ฟรี! 5 กม. 300-500 THB 10 กม. 500-700 THB 15 กม. 1,200 THB'
//         },
//         {
//             name: 'Sushi Hiro',
//             branches: 15,
//             priceRange: '500 – 1,200',
//             rating: 4.4,
//             reviews: 285,
//             image: require('../../../assets/images/promotionn.jpg'), // Replace with actual image URL
//             promoText: 'ส่งฟรี 15 กม. 60% ส่วนลด 5 กม. 10 กม. 15 กม. ฟรี! 5 กม. 300-500 THB 10 กม. 500-700 THB 15 กม. 1,200 THB'
//         },
//         {
//             name: 'Sushi Hiro',
//             branches: 15,
//             priceRange: '500 – 1,200',
//             rating: 4.4,
//             reviews: 285,
//             image: require('../../../assets/images/promotionn.jpg'), // Replace with actual image URL
//             promoText: 'ส่งฟรี 15 กม. 60% ส่วนลด 5 กม. 10 กม. 15 กม. ฟรี! 5 กม. 300-500 THB 10 กม. 500-700 THB 15 กม. 1,200 THB'
//         },
//         {
//             name: 'Sushi Hiro',
//             branches: 15,
//             priceRange: '500 – 1,200',
//             rating: 4.4,
//             reviews: 285,
//             image: require('../../../assets/images/promotionn.jpg'), // Replace with actual image URL
//             promoText: 'ส่งฟรี 15 กม. 60% ส่วนลด 5 กม. 10 กม. 15 กม. ฟรี! 5 กม. 300-500 THB 10 กม. 500-700 THB 15 กม. 1,200 THB'
//         },
//         // Add more restaurant objects here
//     ];

//     return (
//         <SafeAreaView style = {{flex:1}}>
//         <View style={styles.container}>
//             {/* <TextInput style={styles.searchBar} placeholder="Search" /> */}
//           <SearchBar></SearchBar>
//             <View style={styles.categoryRow}>
//                 {['🍕 Pizza', '🍣 Japanese', '🍔 Burgers'].map((label, idx) => (
//                     <TouchableOpacity key={idx} style={styles.categoryButton}>
//                         <Text>{label}</Text>
//                     </TouchableOpacity>
//                 ))}
//             </View>
//             <ScrollView>
//                 {restaurantData.map((r, i) => (
//                     <View key={i} style={styles.card}>
//                         <Image source={r.image} style={styles.image} />
//                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignContent: 'flex-start' }}>
//                             <View style={{ alignItems: 'flex-start', justifyContent: 'flex-start', alignContent: 'flex-start' }}>
//                                 <Text style={styles.title}>{r.name}</Text>
//                                 <Text>{r.branches} Branches</Text>
//                             </View>

//                             <Text style ={{}}>
//                                 <Text style={styles.currency}>THB</Text> {r.priceRange}
//                             </Text>
//                         </View>
//                         <View style={styles.actionRow}>
//                             <TouchableOpacity style={styles.actionButton}>
//                                 <Text style = {styles.chipText}>Delivery</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.actionButton}>
//                                 <Text style = {styles.chipText}>Reserve Table</Text>
//                             </TouchableOpacity>
//                             <Text style={styles.ratingText}>⭐ {r.rating} ({r.reviews} reviews)</Text>
//                         </View>

//                         {/* <Text>{r.promoText}</Text> */}
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//          </SafeAreaView>
//     );
// };

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 10 },
//     searchBar: {
//         borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 20
//     },
//     categoryRow: {
//         flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20,

//     },
//     categoryButton: {
//         paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#f0f0f0', borderRadius: 25,
//         borderWidth: 0.5,
//         borderColor: 'blue', // Light gray border
//     },
//     card: {
//         marginBottom: 20,
//         borderWidth: 1,
//         borderColor: '#ddd', // Light gray border
//         borderRadius: 10,
//         padding: 15,
//         backgroundColor: '#fff', // Optional: gives a clean look
//         shadowColor: '#000',     // Optional: adds subtle shadow
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3             // For Android shadow
//     },
//     image: {
//         width: '100%', height: 150, borderRadius: 10, resizeMode: 'cover'
//     },
//     title: {
//         fontSize: 18, fontWeight: 'bold', marginTop: 10
//     },
//     actionRow: {
//         flexDirection: 'row', marginVertical: 10, alignItems: 'center'
//     },
//     actionButton: {
//         paddingHorizontal: 10, paddingVertical: 5, backgroundColor: '#fffff', borderRadius: 20, marginRight: 10,
//         borderWidth: 0.5, borderColor: 'blue', fontSize: 8,fontWeight: '500', fontFamily: 'System', // or a custom font name if you loaded one // semi-bold
//     },
//     ratingText: {
//         fontSize: 12,
//         fontWeight: '500', // semi-bold
//         fontFamily: 'System', // or a custom font name if you loaded one
//         color: '#333'
//     },
//     currency: {
//         fontFamily: 'YourCustomFont', // or 'System'
//         fontWeight: 'bold',
//         color: '#555'
//     },
//     chipText: {
//         fontSize: 12,
//         fontFamily: 'YourCustomFont', 
//         fontWeight: '500',
//         color: '#555'
//     }
// });

// export default PromotionScreen;