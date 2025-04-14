import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AdminPostCard = ({ recipe, onView, onEdit }) => {
  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{recipe.name}</Text>
        <Text style={styles.recipeAuthor}>By {recipe.author}</Text>
        <Text style={styles.recipeDescription} numberOfLines={1}>
          {recipe.description}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.viewButton} onPress={() => onView(recipe)}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(recipe)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminPostCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 6,
    marginHorizontal: 16,
    padding: 10,
    alignItems: 'center',
    elevation: 2,
    // boxShadow is not supported in React Native; use elevation (Android) or shadow props (iOS)
  },
  recipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  recipeAuthor: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
  recipeDescription: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'column',
    marginLeft: 8,
    justifyContent: 'space-between',
  },
  viewButton: {
    backgroundColor: '#AEF6C7',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});
