import React from 'react';
import { StyleSheet, View, ActivityIndicator, Platform, Text } from 'react-native';
import Constants from 'expo-constants';
import { WebView } from 'react-native-webview';

const WEB_URL = (Constants.manifest && Constants.manifest.extra && Constants.manifest.extra.WEB_URL) || 'http://YOUR_COMPUTER_IP:3000';

export default function App() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: WEB_URL }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" />
            <Text style={{marginTop:8}}>Chargement...</Text>
          </View>
        )}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});
