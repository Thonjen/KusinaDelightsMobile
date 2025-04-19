// app/favorites.jsx

import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRecipes, getReviews, getFavoritesByUser } from '../database/database';
import RecipeCard from '../components/RecipeCard';
import MediumRecipeCard from '../components/MediumRecipeCard';
import ListRecipeCard from '../components/ListRecipeCard';
import BottomNavbar from '../components/BottomNavbar';
import { LayoutContext } from '../contexts/LayoutContext';
import AppHeader from '../components/AppHeader';

export default function Favorites() {
  const router = useRouter();
  const [all, setAll] = useState([]);           // all enriched recipes
  const [filtered, setFiltered] = useState([]); // post‐search
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { layout } = useContext(LayoutContext);

  // load user + data once
  useEffect(() => {
    (async () => {
      // 1) who’s logged in?
      const str = await AsyncStorage.getItem('currentUser');
      if (!str) return; 
      const user = JSON.parse(str);
      setCurrentUser(user);

      // 2) fetch recipes, reviews, favorites
      const [recipes, reviews, favs] = await Promise.all([
        getRecipes(),
        getReviews(),
        getFavoritesByUser(user.id),
      ]);

      // 3) enrich + filter to only favorites
      const enriched = recipes.map(r => {
        const rs = reviews.filter(rv => rv.recipeId === r.id);
        const avg = rs.length
          ? rs.reduce((sum, rv) => sum + rv.rating, 0) / rs.length
          : 0;
        return { ...r, avgRating: avg };
      });

      const favRecipes = favs
        .map(f => enriched.find(r => r.id === f.recipeId))
        .filter(Boolean);

      setAll(favRecipes);
      setFiltered(favRecipes);
    })();
  }, []);

  // apply search filter
  useEffect(() => {
    setFiltered(
      all.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, all]);

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const handleView = id => router.push(`/recipeDetail?id=${id}`);
  const onProfile = () => router.push('/profile');

  const renderCard = item => {
    if (layout === 'medium') {
      return (
        <MediumRecipeCard
          key={item.id}
          item={item}
          onPress={handleView}
        />
      );
    } else if (layout === 'list') {
      return (
        <ListRecipeCard
          key={item.id}
          item={item}
          onPress={handleView}
        />
      );
    } else {
      return (
        <RecipeCard
          key={item.id}
          item={item}
          onPress={handleView}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        headerTitle="Favorite Recipes"
        currentUser={currentUser}
        onProfilePress={onProfile}
        animatedStyle={{ transform: [{ scale: headerScale }] }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Text style={styles.sectionTitle}>Favorite Recipes</Text>

      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        {filtered.length === 0 ? (
          <Text style={styles.empty}>
            {all.length === 0
              ? 'You haven’t favorited any recipes yet.\nTap the ★ on a recipe to save it!'
              : 'No recipes match your search.'}
          </Text>
        ) : (
          <>
            {layout === 'medium' ? (
              <View style={styles.gridContainer}>
                {filtered.map(renderCard)}
              </View>
            ) : (
              filtered.map(renderCard)
            )}
          </>
        )}
      </Animated.ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContainer: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 90, paddingTop: 8 },
  empty: {
    textAlign: 'center',
    color: '#666',
    marginTop: 40,
    fontSize: 16,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});
