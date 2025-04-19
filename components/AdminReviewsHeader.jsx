// components/AdminReviewsHeader.jsx
import React from 'react';
import { View, Text, TextInput, Image, StyleSheet } from 'react-native';

export default function AdminReviewsHeader({ title, searchQuery, onSearchChange }) {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/KusinaDelightsLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{title}</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by user or recipe..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 18,
  },
});
