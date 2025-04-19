// components/MediumRecipeCard.jsx

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function MediumRecipeCard({ item, onPress }) {
  const stars = Math.round(item.avgRating);
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{item.name}</Text>
          {stars > 0 && (
            <View style={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < stars ? 'star' : 'star-outline'}
                  size={14}
                  color="#F8D64E"
                />
              ))}
            </View>
          )}
        </View>
        {item.author && <Text style={styles.author}>by {item.author}</Text>}
        <Text style={styles.desc} numberOfLines={1}>
          {item.description}
        </Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onPress(item.id)}
        >
          <Text style={styles.btnText}>View Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    margin: 5,
    overflow: 'hidden',
    elevation: 3,
    width: '45%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: { width: '100%', height: 120 },
  content: { padding: 8 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: { fontSize: 16, fontWeight: 'bold' },
  stars: { flexDirection: 'row' },
  author: { fontSize: 12, color: '#666', fontStyle: 'italic', marginBottom: 2 },
  desc: { fontSize: 12, color: '#666', marginBottom: 8, textAlign: 'justify' },
  btn: {
    backgroundColor: '#FFA500',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
});
