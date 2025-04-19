import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import RecipeDetailHeader from '../../components/HeaderCenter';
import AdminBottomNavbar from '../../components/AdminBottomNavbar';
import SaveAlert from '../../components/alerts/SaveAlert';
import CancelAlert from '../../components/alerts/CancelAlert';
import RemoveUserAlert from '../../components/alerts/RemoveUserAlert';
import * as database from '../../database/database';

const AdminEditUser = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('');
  const [intro, setIntro] = useState('');
  const [avatar, setAvatar] = useState('');
  const [recipeCount, setRecipeCount] = useState(0);

  const [saveAlert, setSaveAlert] = useState(false);
  const [cancelAlert, setCancelAlert] = useState(false);
  const [removeAlert, setRemoveAlert] = useState(false);

  useEffect(() => {
    (async () => {
      const all = await database.getUsers();
      const u = all.find(x => x.id === id);
      if (!u) {
        Alert.alert('Not found','That user does not exist.',[
          { text:'OK', onPress:() => router.back() }
        ]);
        return;
      }
      setUser(u);
      setRole(u.role);
      setIntro(u.introduction || '');
      setAvatar(u.profileImage || '');

      if (u.role === 'chef') {
        const allRecipes = await database.getRecipes();
        setRecipeCount(allRecipes.filter(r => r.author === u.username).length);
      }
    })();
  }, [id]);

  if (!user) return null;

  const pickImage = async (fromCamera) => {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert('Permission needed','Permission is required.');
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.7 });
    if (!result.canceled && result.assets?.[0].uri) {
      setAvatar(result.assets[0].uri);
    }
  };

  const onSaveConfirm = async () => {
    await database.updateUser({
      ...user,
      username: user.username,
      email: user.email,
      role,
      introduction: intro,
      profileImage: avatar,
    });
    setSaveAlert(false);
    router.replace('/admin/adminUsers');
  };

  const onCancelDiscard = () => {
    setCancelAlert(false);
    router.back();
  };

  const onRemoveConfirm = async () => {
    await database.removeUser(user.id);
    setRemoveAlert(false);
    router.replace('/admin/adminUsers');
  };

  return (
    <View style={styles.container}>
      <RecipeDetailHeader headerTitle="Edit User" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : null}

          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.smallBtn} onPress={() => pickImage(false)}>
              <Text>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.smallBtn} onPress={() => pickImage(true)}>
              <Text>Camera</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={user.username}
            onChangeText={t => setUser(u => ({ ...u, username: t }))}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            value={user.email}
            onChangeText={t => setUser(u => ({ ...u, email: t }))}
          />

          <Text style={styles.label}>Role</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={role} onValueChange={setRole} style={styles.picker}>
              <Picker.Item label="user" value="user" />
              <Picker.Item label="chef" value="chef" />
              <Picker.Item label="admin" value="admin" />
            </Picker>
          </View>

          <Text style={styles.label}>Introduction</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            multiline
            value={intro}
            onChangeText={setIntro}
          />

          {user.role === 'chef' && (
            <Text style={styles.infoLine}>
              Recipes created: {recipeCount}
            </Text>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={() => setSaveAlert(true)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setCancelAlert(true)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.removeButton]}
              onPress={() => setRemoveAlert(true)}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <AdminBottomNavbar />

      <SaveAlert
        visible={saveAlert}
        onCancel={() => setSaveAlert(false)}
        onConfirm={onSaveConfirm}
      />
      <CancelAlert
        visible={cancelAlert}
        onKeepEditing={() => setCancelAlert(false)}
        onDiscard={onCancelDiscard}
      />
      <RemoveUserAlert
        visible={removeAlert}
        recipeCount={recipeCount}
        onCancel={() => setRemoveAlert(false)}
        onConfirm={onRemoveConfirm}
      />
    </View>
  );
};

export default AdminEditUser;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 90 
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 12,
  },
  imageButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  smallBtn: {
    backgroundColor: '#F8D64E',
    padding: 15,
    marginHorizontal: 6,
    borderRadius: 10,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  label: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginTop: 8 
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: '#F8D64E',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 4,
  },
  picker: { 
    height: 55 
  },
  infoLine: { 
    marginTop: 10, 
    fontStyle: 'italic', 
    color: '#555' 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: { 
    flex: 1, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginHorizontal: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  saveButton: { 
    backgroundColor: '#AEF6C7' 
  },
  cancelButton: { 
    backgroundColor: '#F8D64E' 
  },
  removeButton: { 
    backgroundColor: '#F88' 
  },
  buttonText: { 
    color: '#333', 
    fontWeight: '600' 
  },
});
