import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ListRecipeCard = ({ item, onPress }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: item.image }} style={styles.recipeImage} />
      <View style={styles.contentContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.recipeTitle}>{item.name}</Text>
          {item.favorite && (
            <Ionicons
              name="star"
              size={20}
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
      </View>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => onPress(item.id)}
      >
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListRecipeCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 8,
    padding: 12,
    alignItems: 'center',
    elevation: 3,
    width: '100%',
    alignSelf: 'center',
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  recipeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  favoriteIcon: {
    marginLeft: 5,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'justify',
  },
  viewButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  viewButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
