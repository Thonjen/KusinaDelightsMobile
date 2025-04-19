// components/AdminReviewCard.jsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminReviewCard({ review, onView, onEdit }) {
  const date = review.dateCreated
    ? new Date(review.dateCreated).toLocaleDateString()
    : '';

  return (
    <View style={styles.card}>
      {/* Recipe row */}
      <View style={styles.recipeRow}>
        {review.recipeImage && (
          <Image
            source={{ uri: review.recipeImage }}
            style={styles.recipeImg}
          />
        )}
        <View style={styles.recipeText}>
          <Text style={styles.recipeName} numberOfLines={1}>
            {review.recipeName}
          </Text>
          <Text style={styles.recipeAuthor} numberOfLines={1}>
            By {review.recipeAuthor}
          </Text>
        </View>
      </View>

      {/* Separator */}
      <View style={styles.separator} />

      {/* Review row */}
      <View style={styles.reviewRow}>
        <View style={styles.reviewerRow}>
          {review.avatar ? (
            <Image source={{ uri: review.avatar }} style={styles.avatar} />
          ) : (
            <Ionicons
              name="person-circle-outline"
              size={28}
              color="#666"
            />
          )}
          <Text style={styles.username}>{review.username}</Text>
        </View>
        <View style={styles.ratingDateRow}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Ionicons
              key={i}
              name={i < review.rating ? 'star' : 'star-outline'}
              size={14}
              color="#F8D64E"
            />
          ))}
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>

      {/* Comment */}
      <Text style={styles.comment}>{review.comment}</Text>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={onView}>
          <Ionicons name="eye-outline" size={16} color="#FFF" />
          <Text style={styles.actionText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={onEdit}
        >
          <Ionicons name="create-outline" size={16} color="#FFF" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    elevation: 2,
  },
  recipeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeImg: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
  },
  recipeText: {
    flex: 1,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  recipeAuthor: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
    marginVertical: 8,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reviewerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  ratingDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#777',
    marginLeft: 6,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  editBtn: {
    backgroundColor: '#F8D64E',
  },
  actionText: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 15,
    fontWeight: '600',
  },
});
