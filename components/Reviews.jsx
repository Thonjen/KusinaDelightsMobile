// components/Reviews.jsx

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReviews,
  createReview,
  removeReview,
  updateReview,
  getUsers,
  getUserProfile,
} from "../database/database";
import ReviewDeleteAlert from "./alerts/ReviewDeleteAlert";
import CancelAlert from "./alerts/CancelAlert";

const MAX_COMMENT_LENGTH = 200;

export default function Reviews({ recipeId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // delete confirmation
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // cancel editing confirmation
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    AsyncStorage.getItem("currentUser").then((str) => {
      if (str) setCurrentUser(JSON.parse(str));
    });
  }, []);

  const load = async () => {
    const all = await getReviews();
    const recs = all.filter((r) => r.recipeId === recipeId);
    const users = await getUsers();
    const enriched = await Promise.all(
      recs.map(async (r) => {
        const u = users.find((u) => u.id === r.userId) || {};
        const prof = await getUserProfile(r.userId);
        return {
          ...r,
          username: u.username || "Unknown",
          avatar: prof?.profileImage || u.profileImage,
        };
      })
    );
    setReviews(enriched);
  };

  useEffect(() => {
    load();
  }, [recipeId]);

  const resetForm = () => {
    setRating(0);
    setComment("");
    setEditingId(null);
  };

  const submit = async () => {
    if (!currentUser) return Alert.alert("Error", "Log in to review.");
    if (rating === 0) return Alert.alert("Error", "Select a star rating.");
    if (!comment.trim())
      return Alert.alert("Error", "Please enter your review comment.");

    if (editingId) {
      await updateReview({ id: editingId, rating, comment: comment.trim() });
    } else {
      await createReview({
        recipeId,
        userId: currentUser.id,
        rating,
        comment: comment.trim(),
      });
    }

    await load();
    resetForm();
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  const handleDeletePress = (id) => {
    setToDeleteId(id);
    setDeleteAlertVisible(true);
  };

  return (
    <>
      <ScrollView ref={scrollRef} style={styles.container}>
        <Text style={styles.header}>Reviews</Text>

        {reviews.length === 0 ? (
          <Text style={styles.noReviews}>
            No reviews yet, be the first!
          </Text>
        ) : (
          reviews.map((r) => (
            <View key={r.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                  {r.avatar ? (
                    <Image
                      source={{ uri: r.avatar }}
                      style={styles.avatar}
                    />
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

              <View style={styles.footerRow}>
                <Text style={styles.date}>
                  {new Date(r.dateCreated).toLocaleDateString()}
                </Text>

                {currentUser?.id === r.userId && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => {
                        setEditingId(r.id);
                        setRating(r.rating);
                        setComment(r.comment);
                        scrollRef.current?.scrollToEnd({ animated: true });
                      }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#333"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionBtn, styles.deleteBtn]}
                      onPress={() => handleDeletePress(r.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        )}

        <View style={styles.formCard}>
          <Text style={styles.header}>
            {editingId ? "Edit Review" : "Write a Review"}
          </Text>

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
              {
                color:
                  comment.length >= MAX_COMMENT_LENGTH ? "red" : "#888",
              },
            ]}
          >
            {comment.length}/{MAX_COMMENT_LENGTH}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setCancelAlertVisible(true)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={submit}
            >
              <Text style={styles.btnText}>
                {editingId ? "Save" : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ReviewDeleteAlert
        visible={deleteAlertVisible}
        onCancel={() => setDeleteAlertVisible(false)}
        onConfirm={async () => {
          await removeReview(toDeleteId);
          setDeleteAlertVisible(false);
          load();
        }}
      />

      <CancelAlert
        visible={cancelAlertVisible}
        onKeepEditing={() => setCancelAlertVisible(false)}
        onDiscard={() => {
          resetForm();
          setCancelAlertVisible(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 16, paddingHorizontal: 8 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  noReviews: { fontStyle: "italic", color: "#666", marginBottom: 12 },

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
  ratingRow: { flexDirection: "row", marginBottom: 6 },
  comment: { fontSize: 14, color: "#333", marginBottom: 4 },

  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: { fontSize: 12, color: "#888" },
  actionRow: {
    flexDirection: "row",
  },
  actionBtn: {
    padding: 6,
    marginLeft: 8,
    backgroundColor: "#EEE",
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: "#D9534F",
  },

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
