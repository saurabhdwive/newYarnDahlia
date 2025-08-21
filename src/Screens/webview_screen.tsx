// import React, { useState } from 'react';
// import { View, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
// import { WebView } from 'react-native-webview';

// export default function WebViewScreen({ route }) {
//   const { url } = route.params;
//   const [loading, setLoading] = useState(true);

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={styles.container}>
//         <WebView
//           source={{ uri: url }}
//           onLoadStart={() => setLoading(true)}
//           onLoadEnd={() => setLoading(false)}
//         />
//         {loading && (
//           <View style={styles.loader}>
//             <ActivityIndicator size="large" color="grey" />
//           </View>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   loader: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.7)', // optional: translucent white overlay
//   },
// });


import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { Linking } from 'react-native';

export default function WebViewScreen({ route, navigation }) {
  const { url } = route.params;

  useEffect(() => {
    async function openBrowser() {
      try {
        if (await InAppBrowser.isAvailable()) {
          await InAppBrowser.open(url, {
            // Android
            showTitle: true,
            toolbarColor: 'rgb(212,44,32,1)',
            secondaryToolbarColor: 'white',
            enableUrlBarHiding: false,
            enableDefaultShare: false,
            // iOS
            dismissButtonStyle: 'close',
            preferredBarTintColor: 'white',
            preferredControlTintColor: 'rgb(212,44,32,1)',
            readerMode: false,
          });
          // After closing, go back
          navigation.goBack();
        } else {
          Linking.openURL(url);
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', error.message);
        navigation.goBack();
      }
    }

    openBrowser();
  }, [url]);

  return null; // no UI, since Chrome Tab handles it
}
