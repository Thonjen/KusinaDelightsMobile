// app/chef/chefEditRecipe.jsx
import React, { useEffect, useState } from 'react';
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

import HeaderCenter from '../../components/HeaderCenter';
import SaveAlert from '../../components/alerts/SaveAlert';
import CancelAlert from '../../components/alerts/CancelAlert';
import ChefBottomNavbar from '../../components/ChefBottomNavbar';
import * as database from '../../database/database';

export default function ChefEditRecipe() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [recipe, setRecipe] = useState(null);
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

  const [saveAlertVisible, setSaveAlertVisible] = useState(false);
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const all = await database.getRecipes();
      const found = all.find(r => r.id === id);
      if (!found) {
        Alert.alert('Not found', 'Recipe not found.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }
      setRecipe(found);
      setTitle(found.name);
      setDescription(found.description);
      setIngredients(found.ingredients);
      setInstructions(found.instructions);
      setImageUri(found.image);
      setPrepTime(found.preparation || '');
      setCookingTime(found.cookingTime || '');
      setServings(found.servings || '');
      setDifficulty(found.difficulty || 'Easy');
      setYoutubeTutorial(found.youtubeTutorial || '');
    })();
  }, [id]);

  if (!recipe) return null;

  const pickImage = async fromCamera => {
    const permResult = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permResult.status !== 'granted') {
      return Alert.alert('Permission required', 'Need permission to select image.');
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets?.[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const onSaveConfirm = async () => {
    if (!title || !description || !ingredients || !instructions || !imageUri) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      setSaveAlertVisible(false);
      return;
    }
    const updated = {
      ...recipe,
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
    };
    await database.updateRecipe(updated);
    router.replace('/chef/chefPosts');
  };

  const onCancel = () => {
    setCancelAlertVisible(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <HeaderCenter headerTitle="Edit Recipe" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.label}>Recipe Title*</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        {/* Description */}
        <Text style={styles.label}>Description*</Text>
        <TextInput
          style={styles.multilineInput}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        {/* Ingredients */}
        <Text style={styles.label}>Ingredients*</Text>
        <TextInput
          style={styles.multilineInput}
          value={ingredients}
          onChangeText={setIngredients}
          multiline
          numberOfLines={4}
        />

        {/* Instructions */}
        <Text style={styles.label}>Instructions*</Text>
        <TextInput
          style={styles.multilineInput}
          value={instructions}
          onChangeText={setInstructions}
          multiline
          numberOfLines={4}
        />

        {/* Image */}
        <Text style={styles.label}>Image*</Text>
        <View style={styles.imageRow}>
          <View style={styles.imagePreviewContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePlaceholder}>No image</Text>
            )}
          </View>
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(false)}>
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(true)}>
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Prep/Cook/Servings */}
        <Text style={styles.label}>Preparation Time</Text>
        <TextInput
          style={styles.input}
          value={prepTime}
          onChangeText={setPrepTime}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Cooking Time</Text>
        <TextInput
          style={styles.input}
          value={cookingTime}
          onChangeText={setCookingTime}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Servings</Text>
        <TextInput
          style={styles.input}
          value={servings}
          onChangeText={setServings}
          keyboardType="numeric"
        />

        {/* Difficulty */}
        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={difficulty} onValueChange={setDifficulty} style={styles.picker}>
            <Picker.Item label="Easy" value="Easy" />
            <Picker.Item label="Medium" value="Medium" />
            <Picker.Item label="Hard" value="Hard" />
          </Picker>
        </View>

        {/* YouTube Tutorial */}
        <Text style={styles.label}>YouTube Tutorial (optional)</Text>
        <TextInput
          style={styles.input}
          value={youtubeTutorial}
          onChangeText={setYoutubeTutorial}
        />

        {/* Save / Cancel */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={() => setSaveAlertVisible(true)}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setCancelAlertVisible(true)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ChefBottomNavbar />

      <SaveAlert
        visible={saveAlertVisible}
        onCancel={() => setSaveAlertVisible(false)}
        onConfirm={onSaveConfirm}
      />
      <CancelAlert
        visible={cancelAlertVisible}
        onKeepEditing={() => setCancelAlertVisible(false)}
        onDiscard={onCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  label: { marginTop: 16, fontSize: 16, fontWeight: '600' },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  multilineInput: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    textAlignVertical: 'top',
  },
  imageRow: { flexDirection: 'row', marginTop: 8 },
  imagePreviewContainer: {
    flex: 1,
    height: 200,
    backgroundColor: '#EEE',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  imagePreview: { width: '100%', height: '100%', borderRadius: 10 },
  imagePlaceholder: { color: '#888' },
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
  imageButtonText: { color: '#FFF', fontWeight: '600' },
  pickerContainer: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginTop: 8,
    overflow: 'hidden',
  },
  picker: { height: 55 },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#AEF6C7',
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#F88',
    padding: 14,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: { fontWeight: '600', color: '#333' },
});
