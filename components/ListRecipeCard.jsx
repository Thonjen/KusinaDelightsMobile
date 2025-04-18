// components/ListRecipeCard.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ListRecipeCard({ item, onPress }) {
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
                  size={16}
                  color="#F8D64E"
                />
              ))}
            </View>
          )}
        </View>
        {item.author && <Text style={styles.author}>by {item.author}</Text>}
        <Text style={styles.desc} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => onPress(item.id)}
      >
        <Text style={styles.btnText}>View</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 8,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
  content: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  stars: { flexDirection: 'row' },
  author: { fontSize: 14, color: '#666', fontStyle: 'italic', marginBottom: 4 },
  desc: { fontSize: 13, color: '#666', textAlign: 'justify' },
  btn: {
    backgroundColor: '#FFA500',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  btnText: { color: '#FFF', fontWeight: 'bold' },
});
