//EmBreveScreen.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmBreveScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tarefas Em Breve</Text>
    </View>
  );
};

export default EmBreveScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#212121', justifyContent: 'center', alignItems: 'center' },
  text: { color: '#fff', fontSize: 20 },
});
