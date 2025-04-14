// components/RecipeDetailBottomNavbar.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const RecipeDetailBottomNavbar = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back(); 
  };

  const handleRecipes = () => {
    router.push('/recipe'); 
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity style={styles.navButton} onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Text style={styles.navButtonText}>Back</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={handleRecipes}>
        <Ionicons name="book" size={24} color="#black" />
        <Text style={styles.navButtonText}>Recipes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navButton} onPress={handleSettings}>
        <Ionicons name="settings" size={24} color="black" />
        <Text style={styles.navButtonText}>Settings</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecipeDetailBottomNavbar;

const styles = StyleSheet.create({
  navbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#F8D64E',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // For web use boxShadow:
    boxShadow: "0px -2px 4px rgba(0,0,0,0.3)",
    // For Android use elevation:
    elevation: 4,
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 11,
    color: 'black',
    marginTop: 2,
  },
});
