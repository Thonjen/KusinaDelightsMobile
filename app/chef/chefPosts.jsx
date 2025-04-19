// app/chef/chefPosts.jsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import ChefPostsHeader from '../../components/ChefPostsHeader';
import ChefBottomNavbar from '../../components/ChefBottomNavbar';
import ChefRecipeCard from '../../components/ChefRecipeCard';
import Pagination from '../../components/Pagination';
import { getRecipes, getReviews } from '../../database/database';

export default function ChefPosts() {
  const router = useRouter();
  const isFocused = useIsFocused();

  const [recipes, setRecipes] = useState([]);
  const [ratingMap, setRatingMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (!isFocused) return;
    (async () => {
      const meStr = await AsyncStorage.getItem('currentUser');
      if (!meStr) return;
      const me = JSON.parse(meStr);

      const allRecipes = await getRecipes();
      const mine = allRecipes.filter(r => r.author === me.username);
      setRecipes(mine);

      const allReviews = await getReviews();
      const map = {};
      mine.forEach(r => { map[r.id] = { sum: 0, count: 0 }; });
      allReviews.forEach(rv => {
        if (map[rv.recipeId]) {
          map[rv.recipeId].sum += rv.rating;
          map[rv.recipeId].count += 1;
        }
      });
      setRatingMap(map);
    })();
  }, [isFocused]);

  // apply search + exact-rating filter
  const filtered = recipes.filter(r => {
    if (!r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (ratingFilter === 'all') return true;
    const entry = ratingMap[r.id];
    const avg = entry?.count ? entry.sum / entry.count : 0;
    return Math.round(avg) === ratingFilter;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  return (
    <View style={styles.container}>
      <ChefPostsHeader
        title="My Recipes"
        searchQuery={searchQuery}
        onSearchChange={q => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
        ratingFilter={ratingFilter}
        onRatingChange={r => {
          setRatingFilter(r);
          setCurrentPage(1);
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {pageItems.map(rec => (
          <ChefRecipeCard
            key={rec.id}
            recipe={rec}
            avgRating={
              ratingMap[rec.id]?.count
                ? ratingMap[rec.id].sum / ratingMap[rec.id].count
                : 0
            }
            onView={() => router.push(`/recipeDetail?id=${rec.id}`)}
            onEdit={() => router.push(`/chef/chefEditRecipe?id=${rec.id}`)}
          />
        ))}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageSizeChange={v => {
            setPageSize(v);
            setCurrentPage(1);
          }}
          onNextPage={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
          onPrevPage={() => currentPage > 1 && setCurrentPage(p => p - 1)}
        />
      </ScrollView>

      <ChefBottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 90,
  },
});
