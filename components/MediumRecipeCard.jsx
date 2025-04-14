import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MediumRecipeCard = ({ item, onPress }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.recipeContent}>
        <View style={styles.titleRow}>
          <Text style={styles.recipeTitle}>{item.name}</Text>
          {item.favorite && (
            <Ionicons
              name="star"
              size={14}
              color="gold"
              style={styles.favoriteIcon}
            />
          )}
        </View>
        {item.author && (
          <Text style={styles.authorText}>by {item.author}</Text>
        )}
        <Text style={styles.recipeDescription} numberOfLines={1} ellipsizeMode="tail">
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

export default MediumRecipeCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 5,
    overflow: 'hidden',
    elevation: 3,
    width: '45%',
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  recipeImage: {
    width: '100%',
    height: 120,
  },
  recipeContent: {
    padding: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoriteIcon: {
    marginLeft: 4,
  },
  authorText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 2,
  },
  recipeDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'justify',
  },
  viewButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
