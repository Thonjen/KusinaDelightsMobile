// app/admin/adminReviews.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';
import AdminReviewsHeader from '../../components/AdminReviewsHeader';
import AdminReviewCard from '../../components/AdminReviewCard';
import AdminBottomNavbar from '../../components/AdminBottomNavbar';
import Pagination from '../../components/Pagination';
import {
  getReviews,
  getUsers,
  getUserProfile,
  getRecipes,
  removeReview,
} from '../../database/database';

const AdminReviews = () => {
  const router = useRouter();
  const [allReviews, setAllReviews]   = useState([]);
  const [filtered, setFiltered]       = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize]       = useState(10);

  // load once
  useEffect(() => {
    (async () => {
      await loadReviews();
    })();
  }, []);

  // re-filter when search or data changes
  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFiltered(
      allReviews.filter(r =>
        r.username.toLowerCase().includes(q) ||
        r.recipeName.toLowerCase().includes(q)
      )
    );
    setCurrentPage(1);
  }, [searchQuery, allReviews]);

  async function loadReviews() {
    try {
      const reviews = await getReviews();
    //   console.log('⟳ raw reviews from storage:', reviews);
      const users   = await getUsers();
      const recipes = await getRecipes();
      // fetch profiles in same order as users
      const profiles = await Promise.all(
        users.map(u => getUserProfile(u.id))
      );

      const enriched = reviews.map(r => {
        const u   = users.find(u => u.id === r.userId) || {};
        // guard against null profile
        const p   = profiles.find(p => p && p.userID === r.userId) || {};
        const rec = recipes.find(rec => rec.id === r.recipeId) || {};
        return {
          ...r,
          username:     u.username     || 'Unknown',
          avatar:       p.profileImage || u.profileImage || null,
          recipeName:   rec.name       || 'Unknown',
          recipeAuthor: rec.author     || 'Unknown',
          recipeImage:  rec.image      || null,
        };
      });

      setAllReviews(enriched);
      setFiltered(enriched);
    } catch (err) {
      console.error('Failed to load reviews:', err);
      Alert.alert('Error', 'Could not load reviews.');
    }
  }

  const handleDelete = (id) => {
    Alert.alert(
      'Delete Review?',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await removeReview(id);
            await loadReviews();
          },
        },
      ]
    );
  };

  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems  = filtered.slice(startIndex, startIndex + pageSize);

  return (
    <View style={styles.container}>
      <AdminReviewsHeader
        title="Reviews"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {pageItems.length === 0 ? (
          <Text style={styles.noReviews}>No reviews found.</Text>
        ) : (
          pageItems.map(r => (
            <AdminReviewCard
              key={r.id}
              review={r}
              onView={() => router.push(`/recipeDetail?id=${r.recipeId}`)}
              onEdit={() => router.push(`/admin/adminEditReview?id=${r.id}`)}
              onDelete={handleDelete}
            />
          ))
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageSizeChange={(v) => {
            setPageSize(v);
            setCurrentPage(1);
          }}
          onPrevPage={() => currentPage > 1 && setCurrentPage(p => p - 1)}
          onNextPage={() => currentPage < totalPages && setCurrentPage(p => p + 1)}
        />
      </ScrollView>

      <AdminBottomNavbar />
    </View>
  );
};

export default AdminReviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingTop: 12,
    paddingBottom: 80,
  },
  noReviews: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
    fontStyle: 'italic',
  },
});
