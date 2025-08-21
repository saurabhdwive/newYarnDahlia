

// import React, { useState } from 'react';
// import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

// export default function SearchBar() {
//   const [search, setSearch] = useState('');

//   return (
//     <View style={styles.searchContainer}>
//       <TextInput
//         style={styles.searchInput}
//         placeholder="Search"
//         value={search}
//         onChangeText={setSearch}
//       />
//       {search.length > 0 && (
//         <TouchableOpacity onPress={() => setSearch('')}>
//           <Text style={styles.clearButton}>✕</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 8,
//   },
//   clearButton: {
//     fontSize: 18,
//     color: '#888',
//     padding: 5,
//   },
// });


import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

export default function ({ value, onChangeText }) {
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  return (
    <View style={styles.searchContainer}>
      {/* Search Icon */}
      {/* <Image source={require('../../../assets/images/search.png')} style={styles.searchIcon} /> */}

      {/* Input */}
      <TextInput
        style={styles.searchInput}
        // placeholder="🔎 Search"
        placeholder={t('search')}
        placeholderTextColor="#ccc"
        value={value}
        onChangeText={onChangeText}
      />

      {search.length === 0 ? (
        // <TouchableOpacity onPress={() => console.log("Search pressed")}>
        <Image
          source={require('../../../assets/images/find.png')}
          style={[styles.searchIcon]}
        />
        // </TouchableOpacity>
      ) : (
        // Clear icon when text exists
        <TouchableOpacity onPress={() => setSearch('')}>
          <Text style={styles.clearButton}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    // backgroundColor: '#f5f5f5',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'rgb(242,242,242,1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    elevation: 2, // subtle shadow for Android
    shadowColor: '#000', // subtle shadow for iOS
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
    height: 45,
  },
  searchIcon: {
    width: 20,
    height: 20,
    // tintColor: '#666',
    tintColor: 'rgba(128,128,128,0.3)',
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    fontSize: 18,
    color: '#aaa',
    padding: 5,
  },
});