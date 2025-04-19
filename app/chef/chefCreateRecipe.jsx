import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import HeaderCenter from "../../components/HeaderCenter";
import ChefBottomNavbar from "../../components/ChefBottomNavbar";
import * as database from "../../database/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ChefCreatePost() {
  const router = useRouter();
  const [fields, set] = useState({
    name: "",
    description: "",
    ingredients: "",
    instructions: "",
    image: null,
    preparation: "",
    cookingTime: "",
    servings: "",
    difficulty: "Easy",
    youtubeTutorial: "",
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("currentUser").then((str) => {
      if (str) setUser(JSON.parse(str));
    });
  }, []);

  const pick = async (camera) => {
    const perm = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") {
      return Alert.alert("Permission needed", "Please grant permission.");
    }
    const res = camera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          quality: 0.7,
        })
      : await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 0.7,
        });
    if (!res.canceled) set((f) => ({ ...f, image: res.assets[0].uri }));
  };

  const create = async () => {
    const req = [
      "name",
      "description",
      "ingredients",
      "instructions",
      "image",
    ].some((k) => !fields[k]);
    if (req) {
      return Alert.alert("Missing", "Please fill required fields.");
    }
    try {
      await database.createRecipe({
        ...fields,
        author: user?.username || "Chef",
      });
      Alert.alert("Created", "Recipe successfully created.");
      router.push("/chef/chefPosts");
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Could not create recipe.");
    }
  };

  return (
    <View style={styles.container}>
      <HeaderCenter headerTitle="Create Recipe" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {[
          { label: "Title*", key: "name" },
          {
            label: "Description*",
            key: "description",
            multiline: true,
            lines: 3,
          },
          {
            label: "Ingredients*",
            key: "ingredients",
            multiline: true,
            lines: 4,
          },
          {
            label: "Instructions*",
            key: "instructions",
            multiline: true,
            lines: 4,
          },
        ].map(({ label, key, multiline, lines }) => (
          <React.Fragment key={key}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={multiline ? styles.multilineInput : styles.input}
              placeholder={label}
              value={fields[key]}
              onChangeText={(t) => set((f) => ({ ...f, [key]: t }))}
              multiline={!!multiline}
              numberOfLines={lines}
            />
          </React.Fragment>
        ))}

        <Text style={styles.label}>Image*</Text>
        <View style={styles.imageRow}>
          <View style={styles.preview}>
            {fields.image ? (
              <Image
                source={{ uri: fields.image }}
                style={styles.imagePreview}
              />
            ) : (
              <Text style={styles.placeholder}>No image</Text>
            )}
          </View>
          <View style={styles.imageBtns}>
            <TouchableOpacity onPress={() => pick(false)} style={styles.imgBtn}>
              <Text>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pick(true)} style={styles.imgBtn}>
              <Text>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {[
          { label: "Prep Time", key: "preparation", num: true },
          { label: "Cook Time", key: "cookingTime", num: true },
          { label: "Servings", key: "servings", num: true },
        ].map(({ label, key, num }) => (
          <React.Fragment key={key}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
              style={styles.input}
              placeholder={label}
              keyboardType={num ? "numeric" : "default"}
              value={fields[key]}
              onChangeText={(t) => set((f) => ({ ...f, [key]: t }))}
            />
          </React.Fragment>
        ))}

        <Text style={styles.label}>Difficulty</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={fields.difficulty}
            onValueChange={(v) => set((f) => ({ ...f, difficulty: v }))}
            style={styles.picker}
          >
            {["Easy", "Medium", "Hard"].map((d) => (
              <Picker.Item key={d} label={d} value={d} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Youtube URL (opt.)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          value={fields.youtubeTutorial}
          onChangeText={(t) => set((f) => ({ ...f, youtubeTutorial: t }))}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={create}>
            <Text style={styles.btnText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.push("/chef/chefPosts")}
          >
            <Text style={styles.btnText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ChefBottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 16 },
  label: { marginTop: 16, fontSize: 16, fontWeight: "600" },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  multilineInput: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlignVertical: "top",
  },
  imageRow: { flexDirection: "row", marginTop: 8 },
  preview: {
    flex: 1,
    height: 200,
    backgroundColor: "#FFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  placeholder: { color: "#888" },
  imagePreview: { width: "100%", height: "100%", borderRadius: 8 },
  imageBtns: { justifyContent: "space-between", marginLeft: 8 },
  imgBtn: {
    backgroundColor: "#F8D64E",
    padding: 8,
    borderRadius: 8,
  },
  pickerContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  picker: { height: 55, width: "100%" },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 40,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: "#AEF6C7",
    padding: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F88",
    padding: 14,
    borderRadius: 8,
    marginLeft: 8,
  },
  btnText: { fontSize: 16, fontWeight: "600", color: "#333" },
});
