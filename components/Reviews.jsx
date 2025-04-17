// components/Reviews.jsx

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReviews,
  createReview,
  getUsers,
  getUserProfile,
} from "../database/database";

const MAX_COMMENT_LENGTH = 200;

export default function Reviews({ recipeId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    (async () => {
      const all = await getReviews();
      const recs = all.filter((r) => r.recipeId === recipeId);
      const users = await getUsers();
      const enriched = await Promise.all(
        recs.map(async (r) => {
          const user = users.find((u) => u.id === r.userId) || {};
          const profile = await getUserProfile(r.userId);
          const avatarUri = profile?.profileImage || user.profileImage;
          return {
            ...r,
            username: user.username || "Unknown",
            avatar: avatarUri,
          };
        })
      );
      setReviews(enriched);
    })();
  }, [recipeId]);

  const submit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Please select a star rating.");
      return;
    }
    if (!comment.trim()) {
      Alert.alert("Error", "Please enter your review comment.");
      return;
    }
    const userString = await AsyncStorage.getItem("currentUser");
    if (!userString) {
      Alert.alert("Error", "You must be logged in to review.");
      return;
    }
    const user = JSON.parse(userString);

    await createReview({
      recipeId,
      userId: user.id,
      rating,
      comment: comment.trim(),
    });

    // reload
    const all = await getReviews();
    const recs = all.filter((r) => r.recipeId === recipeId);
    const users = await getUsers();
    const enriched = await Promise.all(
      recs.map(async (r) => {
        const u = users.find((u) => u.id === r.userId) || {};
        const profile = await getUserProfile(r.userId);
        const avatarUri = profile?.profileImage || u.profileImage;
        return {
          ...r,
          username: u.username || "Unknown",
          avatar: avatarUri,
        };
      })
    );
    setReviews(enriched);
    setRating(0);
    setComment("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Reviews</Text>

      {reviews.length === 0 ? (
        <Text style={styles.noReviews}>No reviews yet, be the first!</Text>
      ) : (
        reviews.map((r) => (
          <View key={r.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.userInfo}>
                {r.avatar ? (
                  <Image source={{ uri: r.avatar }} style={styles.avatar} />
                ) : (
                  <Ionicons
                    name="person-circle-outline"
                    size={32}
                    color="#666"
                  />
                )}
                <Text style={styles.username}>{r.username}</Text>
              </View>
              <View style={styles.ratingRow}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Ionicons
                    key={i}
                    name={i < r.rating ? "star" : "star-outline"}
                    size={16}
                    color="#F8D64E"
                  />
                ))}
              </View>
            </View>
            <Text style={styles.comment}>{r.comment}</Text>
            <Text style={styles.date}>
              {new Date(r.dateCreated).toLocaleDateString()}
            </Text>
          </View>
        ))
      )}

      <View style={styles.formCard}>
        <Text style={styles.header}>Write a Review</Text>

        <View style={styles.ratingRow}>
          {Array.from({ length: 5 }, (_, i) => (
            <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
              <Ionicons
                name={i < rating ? "star" : "star-outline"}
                size={28}
                color="#F8D64E"
              />
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Your comment..."
          maxLength={MAX_COMMENT_LENGTH}
          value={comment}
          onChangeText={setComment}
        />
        <Text
          style={[
            styles.charCount,
            { color: comment.length >= MAX_COMMENT_LENGTH ? "red" : "#888" },
          ]}
        >
          {comment.length}/{MAX_COMMENT_LENGTH}
        </Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => {
              setRating(0);
              setComment("");
            }}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitBtn} onPress={submit}>
            <Text style={styles.btnText}>Submit Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16, paddingHorizontal: 8 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  noReviews: { fontStyle: "italic", color: "#666" },

  // individual review card
  card: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  userInfo: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  username: { fontSize: 14, fontWeight: "600" },
  ratingRow: { flexDirection: "row" },
  comment: { fontSize: 14, color: "#333", marginBottom: 4 },
  date: { fontSize: 12, color: "#888" },

  // write-a-review form card
  formCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    marginBottom: 24,
    elevation: 1,
  },
  textInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 8,
  },
  charCount: {
    textAlign: "right",
    fontSize: 12,
    marginVertical: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cancelBtn: {
    backgroundColor: "#F88",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 4,
    alignItems: "center",
  },
  submitBtn: {
    backgroundColor: "#AEF6C7",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 4,
    alignItems: "center",
  },
  btnText: { fontWeight: "600" },
});
