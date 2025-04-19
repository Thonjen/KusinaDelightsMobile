// app/author/[author].jsx
import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRecipes, getReviews } from '../../database/database';
import RecipeCard from '../../components/RecipeCard';
import MediumRecipeCard from '../../components/MediumRecipeCard';
import ListRecipeCard from '../../components/ListRecipeCard';
import BottomNavbar from '../../components/BottomNavbar';
import AppHeader from '../../components/AppHeader';
import { LayoutContext } from '../../contexts/LayoutContext';

export default function AuthorPage() {
  const router = useRouter();
  const { author } = useLocalSearchParams();
  const [all, setAll] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { layout } = useContext(LayoutContext);

  useEffect(() => {
    (async () => {
      const ustr = await AsyncStorage.getItem('currentUser');
      if (ustr) setUser(JSON.parse(ustr));
      const recs = await getRecipes();
      const revs = await getReviews();
      // enrich avgRating
      const enriched = recs.map(r => {
        const rs = revs.filter(x => x.recipeId === r.id);
        const avg = rs.length ? rs.reduce((s, x) => s + x.rating, 0)/rs.length : 0;
        return { ...r, avgRating: avg };
      });
      // only this author, most recent first
      const byAuth = enriched
        .filter(r => r.author === author && !r.hidden)
        .sort((a,b)=> Number(b.id)-Number(a.id));
      setAll(byAuth);
      setFiltered(byAuth);
    })();
  }, [author]);

  useEffect(() => {
    setFiltered(
      all.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query, all]);

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  const onView = id => router.push(`/recipeDetail?id=${id}`);

  return (
    <View style={styles.container}>
      <AppHeader
        headerTitle={`Recipes by ${author}`}
        currentUser={user}
        onProfilePress={() => router.push('/profile')}
        animatedStyle={{ transform: [{ scale: headerScale }] }}
        searchQuery={query}
        onSearchChange={setQuery}
      />
      

      <Animated.ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        {layout === 'medium' ? (
          <View style={styles.grid}>
            {filtered.map(item => (
              <MediumRecipeCard
                key={item.id}
                item={item}
                onPress={onView}
              />
            ))}
          </View>
        ) : (
          filtered.map(item => {
            if (layout === 'default') {
              return (
                <RecipeCard
                  key={item.id}
                  item={item}
                  onPress={onView}
                />
              );
            } else {
              return (
                <ListRecipeCard
                  key={item.id}
                  item={item}
                  onPress={onView}
                />
              );
            }
          })
        )}
      </Animated.ScrollView>

      <BottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 90, marginTop: 20 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});
