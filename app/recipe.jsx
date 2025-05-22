import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRecipes, getReviews } from '../database/database';
import RecipeCard from '../components/RecipeCard';
import MediumRecipeCard from '../components/MediumRecipeCard';
import ListRecipeCard from '../components/ListRecipeCard';
import BottomNavbar from '../components/BottomNavbar';
import { LayoutContext } from '../contexts/LayoutContext';
import AppHeader from '../components/AppHeader';
import { useLoading } from '../contexts/LoadingContext';

const Recipe = () => {
  const router = useRouter();
  const { layout } = useContext(LayoutContext);
  const { setLoading } = useLoading();

  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // pull-down & scroll-up refresh states
  const [refreshing, setRefreshing] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [triggeredRefresh, setTriggeredRefresh] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Fetch & enrich data
  const fetchData = async () => {
    setLoading(true);
    try {
      const allRecipes = await getRecipes();
      const allReviews = await getReviews();

      const enriched = allRecipes.map((r) => {
        const rs = allReviews.filter((rv) => rv.recipeId === r.id);
        const avg =
          rs.length > 0
            ? rs.reduce((sum, rv) => sum + rv.rating, 0) / rs.length
            : 0;
        return { ...r, avgRating: avg };
      });

      const visible = enriched
        .filter((r) => !r.hidden)
        .sort((a, b) => Number(b.id) - Number(a.id));

      setRecipes(visible);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, []);

  // Load currentUser
  useEffect(() => {
    (async () => {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) setCurrentUser(JSON.parse(userString));
    })();
  }, []);

  // Pull-down refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Scroll-up refresh (like Facebook)
  const refreshOnScrollUp = async () => {
    setLoading(true);
    try {
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setTriggeredRefresh(false);
    }
  };

  // Animated header scale
  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  // Filtered list
  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (id) => router.push(`/recipeDetail?id=${id}`);

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
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: Platform.OS !== 'web',
            listener: (event) => {
              const y = event.nativeEvent.contentOffset.y;
              // detect scroll-up near top
              if (y < 30 && prevScrollY - y > 10 && !triggeredRefresh) {
                setTriggeredRefresh(true);
                refreshOnScrollUp();
              }
              setPrevScrollY(y);
            },
          }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#F8D64E']}
            tintColor="#F8D64E"
          />
        }
      >
        <Text style={styles.sectionTitle}>Recent Recipes</Text>

        {layout === 'medium' ? (
          <View style={styles.gridContainer}>
            {filtered.map((item) => (
              <MediumRecipeCard
                key={item.id}
                item={item}
                onPress={handleView}
              />
            ))}
          </View>
        ) : (
          filtered.map((item) =>
            layout === 'default' ? (
              <RecipeCard
                key={item.id}
                item={item}
                onPress={handleView}
              />
            ) : (
              <ListRecipeCard
                key={item.id}
                item={item}
                onPress={handleView}
              />
            )
          )
        )}
      </Animated.ScrollView>

      <BottomNavbar />
    </View>
  );
};

export default Recipe;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContainer: { flex: 1, paddingHorizontal: 16 },
  scrollContent: { paddingBottom: 90 },
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
