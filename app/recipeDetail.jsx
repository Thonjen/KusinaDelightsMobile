// app/recipeDetail.jsx

import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as database from "../database/database";
import RecipeDetailHeader from "../components/HeaderCenter";
import RecipeDetailBottomNavbar from "../components/RecipeDetailBottomNavbar";
import YoutubeIframe from "react-native-youtube-iframe";
import Reviews from "../components/Reviews"; // ← reviews component

const extractYoutubeId = (url) => {
  if (!url) return null;
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : null;
};

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    (async () => {
      const all = await database.getRecipes();
      setRecipe(all.find((r) => r.id === id));
    })();
  }, [id]);

  if (!recipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading recipe…</Text>
      </View>
    );
  }

  const instructionLines = recipe.instructions
    .split(/\r?\n/)
    .filter((l) => l.trim());
  const ingredientLines = recipe.ingredients
    .split(/\r?\n/)
    .filter((l) => l.trim());
  const youtubeId = extractYoutubeId(recipe.youtubeTutorial);

  return (
    <View style={styles.container}>
      <RecipeDetailHeader headerTitle={recipe.name} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: recipe.image }} style={styles.image} />
        <Text style={styles.authorText}>by {recipe.author}</Text>

        <Text style={styles.subTitle}>Description</Text>
        <Text style={[styles.description, { textAlign: "justify" }]}>
          {recipe.description}
        </Text>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsContainer}>
          {ingredientLines.map((line, i) => (
            <Text
              key={i}
              style={[styles.ingredientItem, { textAlign: "justify" }]}
            >
              • {line}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.instructionsContainer}>
          {instructionLines.map((line, i) => (
            <Text
              key={i}
              style={[styles.instructionItem, { textAlign: "justify" }]}
            >
              {i + 1}. {line}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.detailsContainer}>
          {recipe.preparation && (
            <Text style={[styles.detailItem, { textAlign: "justify" }]}>
              <Text style={styles.detailLabel}>Preparation Time:{"\n"}</Text>
              {recipe.preparation} minutes
            </Text>
          )}
          {recipe.cookingTime && (
            <Text style={[styles.detailItem, { textAlign: "justify" }]}>
              <Text style={styles.detailLabel}>Cooking Time:{"\n"}</Text>
              {recipe.cookingTime} minutes
            </Text>
          )}
          {recipe.servings && (
            <Text style={[styles.detailItem, { textAlign: "justify" }]}>
              <Text style={styles.detailLabel}>Servings:{"\n"}</Text>
              {recipe.servings}
            </Text>
          )}
          {recipe.difficulty && (
            <Text style={[styles.detailItem, { textAlign: "justify" }]}>
              <Text style={styles.detailLabel}>Difficulty:{"\n"}</Text>
              {recipe.difficulty}
            </Text>
          )}

          <Text style={styles.sectionTitle}>Youtube Tutorial</Text>
          {youtubeId && (
            <View style={styles.youtubeContainer}>
              <YoutubeIframe
                height={350}
                width={"100%"}
                videoId={youtubeId}
                play={false}
              />
            </View>
          )}

          {/* ↓ Reviews are now here, inside the same detailsContainer */}
          <Reviews recipeId={recipe.id} />
        </View>
      </ScrollView>

      <RecipeDetailBottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F5F5F5" 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 10 
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  authorText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
  },
  ingredientsContainer: { 
    marginBottom: 16 
  },
  ingredientItem: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    marginBottom: 4,
  },
  instructionsContainer: { 
    marginBottom: 16 
  },
  instructionItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 6,
  },
  detailsContainer: {
    marginBottom: 0, // ← removed the extra bottom-gap
  },
  detailItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  detailLabel: { 
    fontWeight: "bold" 
  },
  youtubeContainer: {
    marginTop: 5, // ← no extra top-gap
    alignItems: "center",
  },
});
