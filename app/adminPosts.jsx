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
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import * as AsyncStorage from '@react-native-async-storage/async-storage';
import AdminPostCard from '../components/AdminPostCard';
import AdminBottomNavbar from '../components/AdminBottomNavbar';
import RecipeDetailHeader from '../components/HeaderCenter';
import * as database from '../database/database';

const AdminPosts = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Default posts per page

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
    router.push('/adminCreatePost');
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
        <View style={styles.paginationContainer}>
          <Text style={styles.perPageLabel}>Posts per page</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={pageSize}
              style={styles.picker}
              onValueChange={handlePageSizeChange}
            >
              <Picker.Item label="5" value={5} />
              <Picker.Item label="10" value={10} />
              <Picker.Item label="15" value={15} />
              <Picker.Item label="20" value={20} />
            </Picker>
          </View>
          <View style={styles.navButtons}>
            <TouchableOpacity
              style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
              onPress={handlePrevPage}
              disabled={currentPage === 1}
            >
              <Text style={styles.navButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.navButton,
                currentPage === totalPages && styles.disabledButton,
              ]}
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.paginationInfo}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>

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
    paddingBottom: 80,
    paddingTop: 20,
  },
  paginationContainer: {
    marginVertical: 12,
    marginHorizontal: 16,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 12,
    elevation: 1,
  },
  perPageLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: '#F8D64E',
    borderRadius: 10,
    marginBottom: 12,
  },
  picker: {
    height: 40,
    color: '#000',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  navButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  disabledButton: {
    opacity: 0.3,
  },
  navButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  paginationInfo: {
    textAlign: 'center',
    marginTop: 6,
    fontSize: 14,
    color: '#333',
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
