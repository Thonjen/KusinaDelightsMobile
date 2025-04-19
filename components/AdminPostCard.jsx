import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AdminPostCard = ({ recipe, onView }) => {
  const router = useRouter();

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
        <TouchableOpacity
          style={[styles.button, styles.viewButton]}
          onPress={() => onView(recipe)}
        >
          <Ionicons name="eye-outline" size={18} color="#FFF" />
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => router.push(`/admin/adminEditPost?id=${recipe.id}`)}
        >
          <Ionicons name="create-outline" size={18} color="#FFF" />
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
    flexDirection: 'row',
    marginLeft: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 6,
  },
  viewButton: {
    backgroundColor: '#4CAf50',
  },
  editButton: {
    backgroundColor: '#f0ad4e',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});
