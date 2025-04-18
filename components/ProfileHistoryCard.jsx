// components/ProfileHistoryCard.jsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileHistoryCard({ history, onView, onDelete }) {
  if (!history.length) return null;
  return (
    <View style={[styles.card, styles.boxShadow]}>
      <Text style={styles.header}>History</Text>
      {history.map(item => (
        <View key={item.recipeId} style={styles.entry}>
          <Image source={{ uri: item.image }} style={styles.image} />
          <View style={styles.details}>
            <View style={styles.topRow}>
              <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
              <View style={styles.stars}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < item.rating ? "star" : "star-outline"}
                    size={16}
                    color="#F8D64E"
                  />
                ))}
              </View>
            </View>
            <Text style={styles.author}>By {item.author}</Text>
            <Text style={styles.comment} numberOfLines={2}>{item.comment}</Text>
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.viewBtn}
                onPress={() => onView(item.recipeId)}
              >
                <Ionicons name="eye-outline" size={16} color="#FFF" />
                <Text style={styles.btnText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.delBtn}
                onPress={() => onDelete(item.recipeId)}
              >
                <Ionicons name="trash-outline" size={16} color="#FFF" />
                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8D64E',
    margin: 16,
    borderRadius: 12,
    padding: 12,
  },
  boxShadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  entry: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  image: {
    width: 60,
    height: 60,
  },
  details: {
    flex: 1,
    padding: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  stars: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  author: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },
  comment: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  viewBtn: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  delBtn: {
    backgroundColor: '#D9534F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  btnText: {
    color: '#FFF',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
});
