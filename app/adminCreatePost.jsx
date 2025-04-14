import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import RecipeDetailHeader from '../components/Header'; // Shared header component
import AdminBottomNavbar from '../components/AdminBottomNavbar';
import * as database from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminCreatePost = () => {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUri, setImageUri] = useState(null); // For preview
  const [prepTime, setPrepTime] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  // New state: Youtube Tutorial (optional)
  const [youtubeTutorial, setYoutubeTutorial] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Retrieve current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (userString) {
          setCurrentUser(JSON.parse(userString));
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  // Handle opening camera or gallery
  const pickImageFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.[0].uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image from camera:', error);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Gallery permission is required.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.[0].uri) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image from gallery:', error);
    }
  };

  const handleCreate = async () => {
    // Validate required fields
    if (!title || !description || !ingredients || !instructions || !imageUri) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    try {
      // Include the author (current user admin username)
      const newRecipe = await database.createRecipe({
        name: title,
        description,
        ingredients,
        instructions,
        image: imageUri,
        preparation: prepTime,
        cookingTime,
        servings,
        difficulty,
        author: currentUser?.username || 'Admin',
        youtubeTutorial: youtubeTutorial || null,
      });
      Alert.alert('Recipe Created', 'Your recipe has been created successfully!');
      // Navigate back to AdminPosts so the new post appears
      router.push('/adminPosts');
    } catch (error) {
      console.error('Error creating recipe:', error);
      Alert.alert('Error', 'An error occurred while creating the recipe.');
    }
  };

  const handleCancel = () => {
    router.push('/adminPosts');
  };

  return (
    <View style={styles.container}>
      {/* Shared Header */}
      <RecipeDetailHeader headerTitle="Create Post" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Recipe Title */}
        <Text style={styles.label}>Recipe Title*</Text>
        <TextInput
          style={styles.input}
          placeholder="Recipe Title"
          value={title}
          onChangeText={setTitle}
        />

        {/* Description */}
        <Text style={styles.label}>Description*</Text>
        <TextInput
          style={styles.multilineInput}
          placeholder="Short description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Ingredients */}
        <Text style={styles.label}>Ingredients*</Text>
        <TextInput
          style={styles.multilineInput}
          placeholder="List of ingredients"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          numberOfLines={4}
        />

        {/* Instructions */}
        <Text style={styles.label}>Instructions*</Text>
        <TextInput
          style={styles.multilineInput}
          placeholder="Step-by-step instructions"
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={4}
        />

        {/* Image selection */}
        <Text style={styles.label}>Image*</Text>
        <View style={styles.imageRow}>
          <View style={styles.imagePreviewContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePlaceholder}>No image selected</Text>
            )}
          </View>
          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={pickImageFromGallery}
            >
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={pickImageFromCamera}
            >
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preparation Time */}
        <Text style={styles.label}>Preparation Time (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 15"
          value={prepTime}
          onChangeText={setPrepTime}
          keyboardType="numeric"
        />

        {/* Cooking Time */}
        <Text style={styles.label}>Cooking Time (minutes)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 30"
          value={cookingTime}
          onChangeText={setCookingTime}
          keyboardType="numeric"
        />

        {/* Servings */}
        <Text style={styles.label}>Servings</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 4"
          value={servings}
          onChangeText={setServings}
          keyboardType="numeric"
        />

        {/* Difficulty Picker */}
        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={difficulty}
            style={styles.picker}
            onValueChange={(value) => setDifficulty(value)}
          >
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>
        </View>

        {/* Youtube Tutorial (Optional) */}
        <Text style={styles.label}>Youtube Tutorial (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Youtube URL (if any)"
          value={youtubeTutorial}
          onChangeText={setYoutubeTutorial}
        />

        {/* Create and Cancel Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Admin Bottom Navbar */}
      <AdminBottomNavbar />
    </View>
  );
};

export default AdminCreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  label: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  multilineInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  imagePreviewContainer: {
    flex: 1,
    height: 100,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  imagePlaceholder: {
    color: '#888',
  },
  imageButtons: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 100,
  },
  imageButton: {
    backgroundColor: '#F8D64E',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  imageButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginTop: 8,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#AEF6C7',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F88',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
