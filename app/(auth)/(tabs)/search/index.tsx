import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function SearchScreen() {
  const [search, setSearch] = useState('');

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Search',
          headerTitle: (props) => (
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{props.children}</Text>
            </View>
          ),
          headerSearchBarOptions: {
            placeholder: 'Search',
            onChangeText: (event) => setSearch(event.nativeEvent.text),
            tintColor: '#000',
            autoFocus: true,
            hideWhenScrolling: false,
            onCancelButtonPress: () => {},
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  user: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
});