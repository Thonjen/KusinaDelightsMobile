import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Animated, TextInput, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as database from '../database/database';
import RecipeCard from '../components/RecipeCard';
import MediumRecipeCard from '../components/MediumRecipeCard';
import ListRecipeCard from '../components/ListRecipeCard';
import BottomNavbar from '../components/BottomNavbar';
import { LayoutContext } from '../contexts/LayoutContext';
import AppHeader from '../components/AppHeader';

const Recipe = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { layout } = useContext(LayoutContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await database.getRecipes();
        const sortedRecipes = [...data].reverse();
        const visibleRecipes = sortedRecipes.filter((recipe) => !recipe.hidden);
        setRecipes(visibleRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (userString) {
          setCurrentUser(JSON.parse(userString));
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewRecipe = (id) => {
    router.push(`/recipeDetail?id=${id}`);
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        headerTitle="Recent Recipes"
        currentUser={currentUser}
        onProfilePress={() => router.push('/profile')}
        animatedStyle={{ transform: [{ scale: headerScale }] }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        overScrollMode="always"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>Recent Recipes</Text>
        {layout === 'medium' ? (
          <View style={styles.gridContainer}>
            {filteredRecipes.map((item) => (
              <MediumRecipeCard key={item.id} item={item} onPress={handleViewRecipe} />
            ))}
          </View>
        ) : (
          filteredRecipes.map((item) => {
            if (layout === 'default') {
              return <RecipeCard key={item.id} item={item} onPress={handleViewRecipe} />;
            } else if (layout === 'list') {
              return <ListRecipeCard key={item.id} item={item} onPress={handleViewRecipe} />;
            }
            return null;
          })
        )}
      </Animated.ScrollView>

      <BottomNavbar />
    </View>
  );
};

export default Recipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 90, // Updated paddingBottom here as well
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});
