//NavegarScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NavegarScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Navegar</Text>
    </View>
  );
};

export default NavegarScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212121', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 20 },
});
