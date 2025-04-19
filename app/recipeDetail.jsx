// app/recipeDetail.jsx

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as database from "../database/database";
import RecipeDetailHeader from "../components/HeaderCenter";
import RecipeDetailBottomNavbar from "../components/RecipeDetailBottomNavbar";
import FloatingTimerButton from "../components/FloatingTimerButton";  // ← added
import { Audio } from "expo-av";                                       // ← added
import YoutubeIframe from "react-native-youtube-iframe";
import Reviews from "../components/Reviews";
import { useRouter } from 'expo-router';

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
  const [userId, setUserId] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const router = useRouter(); 
  const [floatingEnabled, setFloatingEnabled] = useState(true);
  const [timerEnabled, setTimerEnabled] = useState(true);

  // Ensure audio plays even in silent mode (iOS)
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    });
  }, []);


  // load floating/timer toggles
  useEffect(() => {
    (async () => {
      try {
        const floatVal = await AsyncStorage.getItem("floatingEnabled");
        const timerVal = await AsyncStorage.getItem("timerEnabled");
        setFloatingEnabled(floatVal !== "false"); // default true
        setTimerEnabled(timerVal !== "false");     // default true
      } catch (e) {
        console.error("Failed to load floating toggles", e);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const all = await database.getRecipes();
      setRecipe(all.find((r) => r.id === id));
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      const str = await AsyncStorage.getItem("currentUser");
      if (!str) return;
      const u = JSON.parse(str);
      setUserId(u.id);
      const favs = await database.getFavoritesByUser(u.id);
      setIsFav(favs.some((f) => f.recipeId === id));
    })();
  }, [id]);

  const toggleFav = useCallback(async () => {
    if (!userId) {
      return Alert.alert("Please log in to favorite recipes.");
    }
    if (isFav) {
      await database.removeFavorite(userId, id);
      setIsFav(false);
    } else {
      await database.addFavorite(userId, id);
      setIsFav(true);
    }
  }, [isFav, userId, id]);

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

        <View style={styles.authorRow}>
         <TouchableOpacity
           activeOpacity={0.7}
           onPress={() =>
             router.push(`/author/${encodeURIComponent(recipe.author)}`)
           }
         >
           <Text style={styles.authorText}>by {recipe.author}</Text>
         </TouchableOpacity>
          {userId && (
            <TouchableOpacity onPress={toggleFav}>
              <Text style={styles.star}>{isFav ? "★" : "☆"}</Text>
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{recipe.description}</Text>

        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.list}>
          {ingredientLines.map((line, i) => (
            <Text key={i} style={styles.listItem}>
              • {line}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Instructions</Text>
        <View style={styles.list}>
          {instructionLines.map((line, i) => (
            <Text key={i} style={styles.listItem}>
              {i + 1}. {line}
            </Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Additional Information</Text>
        <View style={styles.detailsContainer}>
          {recipe.preparation && (
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Preparation Time:</Text>{" "}
              {recipe.preparation} min
            </Text>
          )}
          {recipe.cookingTime && (
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Cooking Time:</Text>{" "}
              {recipe.cookingTime} min
            </Text>
          )}
          {recipe.servings && (
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Servings:</Text>{" "}
              {recipe.servings}
            </Text>
          )}
          {recipe.difficulty && (
            <Text style={styles.detailItem}>
              <Text style={styles.detailLabel}>Difficulty:</Text>{" "}
              {recipe.difficulty}
            </Text>
          )}
        </View>

        {youtubeId && (
          <>
            <Text style={styles.sectionTitle}>YouTube Tutorial</Text>
            <YoutubeIframe
              height={320}
              width={"100%"}
              videoId={youtubeId}
              play={false}
            />
          </>
        )}

        <Reviews recipeId={recipe.id} />
      </ScrollView>

    {/* only show floating/timer if enabled: */}
    {floatingEnabled && (
      <FloatingTimerButton timerEnabled={timerEnabled} />
    )}

      <RecipeDetailBottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 16, paddingBottom: 10 },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
  },
  authorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  authorText: { fontSize: 14, fontStyle: "italic", color: "#666" },
  star: { fontSize: 24, color: "#F8D64E" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 4,
  },
  description: { fontSize: 16, color: "#333", marginBottom: 12 },
  list: { marginBottom: 12 },
  listItem: { fontSize: 16, color: "#333", marginBottom: 4 },
  detailsContainer: { marginBottom: 12 },
  detailItem: { fontSize: 16, color: "#333", marginBottom: 6 },
  detailLabel: { fontWeight: "bold" },
});
