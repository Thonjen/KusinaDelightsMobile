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
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import RecipeDetailHeader from '../components/Header'; // Shared header component
import AdminBottomNavbar from '../components/AdminBottomNavbar';
import SaveAlert from '../components/alerts/SaveAlert';
import CancelAlert from '../components/alerts/CancelAlert';
import RemoveAlert from '../components/alerts/RemoveAlert';
import * as database from '../database/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminEditPost = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Get recipe id from URL query
  const [currentRecipe, setCurrentRecipe] = useState(null);

  // Form state variables for editing
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [prepTime, setPrepTime] = useState('');
  const [cookingTime, setCookingTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [youtubeTutorial, setYoutubeTutorial] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  // Alert visibility states
  const [saveAlertVisible, setSaveAlertVisible] = useState(false);
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
  const [removeAlertVisible, setRemoveAlertVisible] = useState(false);

  // Fetch the current recipe data
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const recipes = await database.getRecipes();
        const foundRecipe = recipes.find((rec) => rec.id === id);
        if (foundRecipe) {
          setCurrentRecipe(foundRecipe);
          // Prepopulate form with existing recipe details:
          setTitle(foundRecipe.name);
          setDescription(foundRecipe.description);
          setIngredients(foundRecipe.ingredients);
          setInstructions(foundRecipe.instructions);
          setImageUri(foundRecipe.image);
          setPrepTime(foundRecipe.preparation);
          setCookingTime(foundRecipe.cookingTime);
          setServings(foundRecipe.servings);
          setDifficulty(foundRecipe.difficulty);
          setYoutubeTutorial(foundRecipe.youtubeTutorial || '');
        }
      } catch (error) {
        console.error('Error fetching recipe for editing:', error);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  // Retrieve current user (to pass as author if needed)
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

  // Functions for image selection
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

  // Actual save function (called from alert confirmation)
  const onSaveConfirm = async () => {
    if (!title || !description || !ingredients || !instructions || !imageUri) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }
    try {
      const updatedRecipe = {
        ...currentRecipe,
        name: title,
        description,
        ingredients,
        instructions,
        image: imageUri,
        preparation: prepTime,
        cookingTime,
        servings,
        difficulty,
        youtubeTutorial: youtubeTutorial || null,
        author: currentUser?.username || currentRecipe.author || 'Admin',
      };
      await database.updateRecipe(updatedRecipe);
      Alert.alert('Recipe Updated', 'Your recipe has been updated successfully!');
      setSaveAlertVisible(false);
      router.push('/adminPosts');
    } catch (error) {
      console.error('Error updating recipe:', error);
      Alert.alert('Error', 'An error occurred while updating the recipe.');
      setSaveAlertVisible(false);
    }
  };

  // Actual cancel function (discard changes)
  const onCancelDiscard = () => {
    // Optionally, reset form fields to original values
    setTitle(currentRecipe.name);
    setDescription(currentRecipe.description);
    setIngredients(currentRecipe.ingredients);
    setInstructions(currentRecipe.instructions);
    setImageUri(currentRecipe.image);
    setPrepTime(currentRecipe.preparation);
    setCookingTime(currentRecipe.cookingTime);
    setServings(currentRecipe.servings);
    setDifficulty(currentRecipe.difficulty);
    setYoutubeTutorial(currentRecipe.youtubeTutorial || '');
    setCancelAlertVisible(false);
    router.push('/adminPosts');
  };

  // Actual remove function: remove recipe from storage
  const onRemoveConfirm = async () => {
    try {
      await database.removeRecipe(currentRecipe.id);
      Alert.alert('Recipe Removed', 'Your recipe has been removed successfully!');
      setRemoveAlertVisible(false);
      router.push('/adminPosts');
    } catch (error) {
      console.error('Error removing recipe:', error);
      Alert.alert('Error', 'An error occurred while removing the recipe.');
      setRemoveAlertVisible(false);
    }
  };

  // Handlers to show alerts
  const handleSavePress = () => {
    setSaveAlertVisible(true);
  };

  const handleCancelPress = () => {
    setCancelAlertVisible(true);
  };

  const handleRemovePress = () => {
    setRemoveAlertVisible(true);
  };

  if (!currentRecipe) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading recipe for editing...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Shared Header */}
      <RecipeDetailHeader headerTitle="Edit Post" />

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

        {/* Buttons: Save, Cancel, and Remove */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSavePress}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelPress}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={handleRemovePress}>
            <Text style={styles.buttonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Admin Bottom Navbar */}
      <AdminBottomNavbar />

      {/* Alert Components */}
      <SaveAlert
        visible={saveAlertVisible}
        onCancel={() => setSaveAlertVisible(false)}
        onConfirm={onSaveConfirm}
      />
      <CancelAlert
        visible={cancelAlertVisible}
        onKeepEditing={() => setCancelAlertVisible(false)}
        onDiscard={onCancelDiscard}
      />
      <RemoveAlert
        visible={removeAlertVisible}
        onCancel={() => setRemoveAlertVisible(false)}
        onConfirm={onRemoveConfirm}
      />
    </View>
  );
};

export default AdminEditPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 10,
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
    height: 150,
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
  saveButton: {
    flex: 1,
    backgroundColor: '#AEF6C7',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 4,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F88',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  removeButton: {
    flex: 1,
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
