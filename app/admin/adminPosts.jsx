import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as AsyncStorage from '@react-native-async-storage/async-storage';
import AdminPostCard from '../../components/AdminPostCard';
import AdminBottomNavbar from '../../components/AdminBottomNavbar';
import RecipeDetailHeader from '../../components/HeaderCenter';
import * as database from '../../database/database';
import Pagination from '../../components/Pagination'; // Import Pagination

const AdminPosts = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Default posts per page

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const data = await database.getRecipes();
        // Admin can see all posts
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchRecipes();
  }, []);

  const totalPages = Math.ceil(recipes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentRecipes = recipes.slice(startIndex, endIndex);

  const handleViewRecipe = (recipe) => {
    router.push(`/recipeDetail?id=${recipe.id}`);
  };

  const handleEditRecipe = (recipe) => {
    Alert.alert('Edit Recipe', `Editing Recipe ID: ${recipe.id}`);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  const handleCreateRecipe = () => {
    router.push('/admin/adminCreatePost');
  };

  return (
    <View style={styles.container}>
      {/* Shared Header */}
      <RecipeDetailHeader headerTitle="Posts" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {currentRecipes.map((recipe) => (
          <AdminPostCard
            key={recipe.id}
            recipe={recipe}
            onView={handleViewRecipe}
            onEdit={handleEditRecipe}
          />
        ))}

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
        />

        {/* Create Recipe Button */}
        <TouchableOpacity style={styles.createRecipeButton} onPress={handleCreateRecipe}>
          <Text style={styles.createRecipeButtonText}>New Recipe</Text>
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
    paddingBottom: 40,
    paddingTop: 20,
  },
  createRecipeButton: {
    backgroundColor: '#FFA500',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  createRecipeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
