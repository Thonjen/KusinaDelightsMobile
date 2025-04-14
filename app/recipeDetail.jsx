import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  Linking
} from 'react-native';
// Use the alternative hook provided by expo-router:
import { useLocalSearchParams } from 'expo-router';
import * as database from '../database/database';
import RecipeDetailHeader from '../components/HeaderCenter';
import RecipeDetailBottomNavbar from '../components/RecipeDetailBottomNavbar';
import YoutubeIframe from 'react-native-youtube-iframe';
import { Ionicons } from '@expo/vector-icons';

// Helper function: extract YouTube video ID from URL
const extractYoutubeId = (url) => {
  if (!url) return null;
  // This regular expression matches common YouTube URL patterns.
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

const RecipeDetail = () => {
  // Retrieve the recipe id from URL query parameters
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipes = await database.getRecipes();
        const foundRecipe = recipes.find((rec) => rec.id === id);
        setRecipe(foundRecipe);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    if (id) {
      fetchRecipe();
    }
  }, [id]);

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading recipe...</Text>
      </View>
    );
  }

  // Process instructions: split by newline and filter out empty lines
  const instructionLines = recipe.instructions
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '');

  // Process ingredients: split by newline and filter out empty lines
  const ingredientLines = recipe.ingredients
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '');

  // Extract YouTube video ID and determine if a valid video is available
  const youtubeId = extractYoutubeId(recipe.youtubeTutorial);

  return (
    <View style={styles.container}>
      {/* Centered Header */}
      <RecipeDetailHeader headerTitle={recipe.name} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <Text style={styles.authorText}>by {recipe.author}</Text>

        {/* Description Section */}
        <Text style={styles.subTitle}>Description</Text>
        <Text style={[styles.description, { textAlign: 'justify' }]}>{recipe.description}</Text>

        {/* Ingredients Section */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsContainer}>
          {ingredientLines.map((line, index) => (
            <Text key={index} style={[styles.ingredientItem, { textAlign: 'justify' }]}>
              • {line}
            </Text>
          ))}
        </View>

        {/* Instructions Section */}
        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.instructionsContainer}>
          {instructionLines.map((line, index) => (
            <Text key={index} style={[styles.instructionItem, { textAlign: 'justify' }]}>
              {index + 1}. {line}
            </Text>
          ))}
        </View>

        {/* Additional Information Section */}
        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.detailsContainer}>
          {recipe.preparation && (
            <Text style={[styles.detailItem, { textAlign: 'justify' }]}>
              <Text style={styles.detailLabel}>Preparation Time:</Text>{'\n'}
              {recipe.preparation} minutes
            </Text>
          )}
          {recipe.cookingTime && (
            <Text style={[styles.detailItem, { textAlign: 'justify' }]}>
              <Text style={styles.detailLabel}>Cooking Time:</Text>{'\n'}
              {recipe.cookingTime} minutes
            </Text>
          )}
          {recipe.servings && (
            <Text style={[styles.detailItem, { textAlign: 'justify' }]}>
              <Text style={styles.detailLabel}>Servings:</Text>{'\n'}
              {recipe.servings}
            </Text>
          )}
          {recipe.difficulty && (
            <Text style={[styles.detailItem, { textAlign: 'justify' }]}>
              <Text style={styles.detailLabel}>Difficulty:</Text>{'\n'}
              {recipe.difficulty}
            </Text>
          )}

          <Text style={styles.sectionTitle}>Youtube Tutorial</Text>
          <Text style={styles.youtubeTitle}>Watch Tutorial</Text>
          {/* If a YouTube tutorial exists, display an embedded video */}
          {recipe.youtubeTutorial && youtubeId && (
            <View style={styles.youtubeContainer}>
              <YoutubeIframe
                height={300}
                width={350}
                videoId={youtubeId}
                play={false}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* New Bottom Navbar for Recipe Detail */}
      <RecipeDetailBottomNavbar />
    </View>
  );
};

export default RecipeDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  authorText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  ingredientsContainer: {
    marginBottom: 16,
  },
  ingredientItem: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
    marginBottom: 4,
  },
  instructionsContainer: {
    marginBottom: 16,
  },
  instructionItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailItem: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  youtubeContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  youtubeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA500',
  },
});
