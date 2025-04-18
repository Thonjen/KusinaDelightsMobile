import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AdminPostCard from '../../components/AdminPostCard';
import AdminBottomNavbar from '../../components/AdminBottomNavbar';
import AdminPostsHeader from '../../components/AdminPostsHeader';
import Pagination from '../../components/Pagination';
import * as database from '../../database/database';

const AdminPosts = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    (async () => {
      try {
        const data = await database.getRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    })();
  }, []);

  // filter by search
  const filtered = recipes.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIdx = (currentPage - 1) * pageSize;
  const currentRecipes = filtered.slice(startIdx, startIdx + pageSize);

  const handleView = recipe => {
    router.push(`/recipeDetail?id=${recipe.id}`);
  };
  const handleEdit = recipe => {
    Alert.alert('Edit Recipe', `Editing Recipe ID: ${recipe.id}`);
  };
  const handleCreate = () => router.push('/admin/adminCreatePost');

  return (
    <View style={styles.container}>
      <AdminPostsHeader
        title="Posts"
        searchQuery={searchQuery}
        onSearchChange={q => {
          setSearchQuery(q);
          setCurrentPage(1);
        }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentRecipes.map(recipe => (
          <AdminPostCard
            key={recipe.id}
            recipe={recipe}
            onView={handleView}
            onEdit={handleEdit}
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
          onNextPage={() =>
            currentPage < totalPages && setCurrentPage(p => p + 1)
          }
          onPrevPage={() =>
            currentPage > 1 && setCurrentPage(p => p - 1)
          }
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreate}
        >
          <Text style={styles.createButtonText}>New Recipe</Text>
        </TouchableOpacity>
      </ScrollView>

      <AdminBottomNavbar />
    </View>
  );
};

export default AdminPosts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 80,
  },
  createButton: {
    backgroundColor: '#FFA500',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
