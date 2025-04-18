// app/home.jsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRecipes, getReviews } from '../database/database';
import RecipeCard from '../components/RecipeCard';
import MediumRecipeCard from '../components/MediumRecipeCard';
import ListRecipeCard from '../components/ListRecipeCard';
import BottomNavbar from '../components/BottomNavbar';
import { LayoutContext } from '../contexts/LayoutContext';
import AppHeader from '../components/AppHeader';

const Home = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { layout } = useContext(LayoutContext);

  useEffect(() => {
    (async () => {
      // fetch recipes + reviews, compute avgRating
      const allRecipes = await getRecipes();
      const allReviews = await getReviews();
      const enriched = allRecipes.map((r) => {
        const rs = allReviews.filter(
          (rv) => String(rv.recipeId) === String(r.id)
        );
        const avg = rs.length
          ? rs.reduce((sum, rv) => sum + rv.rating, 0) / rs.length
          : 0;
        return { ...r, avgRating: avg };
      });
      // keep only rated recipes, sort descending
      const ratedOnly = enriched
        .filter((r) => r.avgRating > 0)
        .sort((a, b) => b.avgRating - a.avgRating);
      setRecipes(ratedOnly);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) setCurrentUser(JSON.parse(userString));
    })();
  }, []);

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  // apply search filter
  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewRecipe = (id) => router.push(`/recipeDetail?id=${id}`);

  return (
    <View style={styles.container}>
      <AppHeader
        headerTitle="KusinaDelights"
        currentUser={currentUser}
        onProfilePress={() => router.push('/profile')}
        animatedStyle={{ transform: [{ scale: headerScale }] }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>
          Famous Recipe
        </Text>

        {filteredRecipes.length === 0 ? (
          <Text style={styles.noRated}>
            No recipes have been rated yet.
          </Text>
        ) : layout === 'medium' ? (
          <View style={styles.gridContainer}>
            {filteredRecipes.map((item) => (
              <MediumRecipeCard
                key={item.id}
                item={item}
                onPress={handleViewRecipe}
              />
            ))}
          </View>
        ) : (
          filteredRecipes.map((item) => {
            if (layout === 'default') {
              return (
                <RecipeCard
                  key={item.id}
                  item={item}
                  onPress={handleViewRecipe}
                />
              );
            } else if (layout === 'list') {
              return (
                <ListRecipeCard
                  key={item.id}
                  item={item}
                  onPress={handleViewRecipe}
                />
              );
            }
            return null;
          })
        )}
      </Animated.ScrollView>

      <BottomNavbar />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContainer: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 90 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 16 },
  noRated: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});
