import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RecipeCard = ({ item, onPress }) => {
  return (
    <View style={styles.recipeCard}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeContent}>
        <View style={styles.titleRow}>
          <Text style={styles.recipeTitle}>{item.name}</Text>
          {item.favorite && (
            <Ionicons
              name="star"
              size={16}
              color="gold"
              style={styles.favoriteIcon}
            />
          )}
        </View>
        {item.author && (
          <Text style={styles.authorText}>by {item.author}</Text>
        )}
        <Text style={styles.recipeDescription} numberOfLines={2} ellipsizeMode="tail">
          {item.description}
        </Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => onPress(item.id)}
        >
          <Text style={styles.viewButtonText}>View Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecipeCard;

const styles = StyleSheet.create({
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    width: '85%',
    alignSelf: 'center',
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  recipeImage: {
    width: '100%',
    height: 175,
  },
  recipeContent: {
    padding: 10,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriteIcon: {
    marginLeft: 8,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    textAlign: 'justify',
  },
  viewButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
