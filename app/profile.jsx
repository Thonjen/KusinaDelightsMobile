// app/profile.jsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import HeaderCenter from '../components/HeaderCenter';
import BottomNavbar from '../components/BottomNavbar';
import SaveAlert from '../components/alerts/SaveAlert';
import CancelAlert from '../components/alerts/CancelAlert';
import { updateUser } from '../database/database';
import ProfileInfoCard from '../components/ProfileInfoCard';
import ProfileIntroCard from '../components/ProfileIntroCard';

const Profile = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [introText, setIntroText] = useState('');
  // Alert visibility
  const [saveUserAlertVisible, setSaveUserAlertVisible] = useState(false);
  const [cancelUserAlertVisible, setCancelUserAlertVisible] = useState(false);
  const [saveIntroAlertVisible, setSaveIntroAlertVisible] = useState(false);
  const [cancelIntroAlertVisible, setCancelIntroAlertVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
        setUserNameInput(user.username || '');
        setUserEmailInput(user.email || '');
        setIntroText(user.introduction || 'No introduction yet.');
      }
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    router.push('/');
  };

  const formattedDate = currentUser?.dateJoined
    ? new Date(currentUser.dateJoined).toLocaleDateString()
    : 'N/A';

  // fixed pickImage
  const pickImage = async (fromCamera = false) => {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Please grant permissions to change your profile image.'
      );
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });

    if (result.canceled) return;

    // support both new & old APIs
    const uri = result.assets?.[0]?.uri ?? result.uri;
    if (!uri) return;

    const updatedUser = { ...currentUser, profileImage: uri };
    setCurrentUser(updatedUser);
    await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
    await updateUser(updatedUser);
  };

  return (
    <View style={styles.container}>
      <HeaderCenter headerTitle="Profile" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ProfileInfoCard
          currentUser={currentUser}
          isEditing={isEditingUserInfo}
          userNameInput={userNameInput}
          userEmailInput={userEmailInput}
          formattedDate={formattedDate}
          onUserNameChange={setUserNameInput}
          onUserEmailChange={setUserEmailInput}
          onEditPress={() => setIsEditingUserInfo(true)}
          onSavePress={() => setSaveUserAlertVisible(true)}
          onCancelPress={() => setCancelUserAlertVisible(true)}
          onCameraPress={() => pickImage(true)}
          onGalleryPress={() => pickImage(false)}
          charLimit={10}
          userNameLength={userNameInput.length}
          onLogoutPress={handleLogout}
        />
        <ProfileIntroCard
          introText={introText}
          isEditing={isEditingIntro}
          onIntroChange={setIntroText}
          onEditPress={() => setIsEditingIntro(true)}
          onSavePress={() => setSaveIntroAlertVisible(true)}
          onCancelPress={() => setCancelIntroAlertVisible(true)}
        />
      </ScrollView>
      <BottomNavbar />

      {/* Alerts */}
      <SaveAlert
        visible={saveUserAlertVisible}
        onCancel={() => setSaveUserAlertVisible(false)}
        onConfirm={async () => {
          const updatedUser = {
            ...currentUser,
            username: userNameInput,
            email: userEmailInput,
          };
          setCurrentUser(updatedUser);
          await AsyncStorage.setItem(
            'currentUser',
            JSON.stringify(updatedUser)
          );
          await updateUser(updatedUser);
          setIsEditingUserInfo(false);
          setSaveUserAlertVisible(false);
        }}
      />
      <CancelAlert
        visible={cancelUserAlertVisible}
        onKeepEditing={() => setCancelUserAlertVisible(false)}
        onDiscard={() => {
          setUserNameInput(currentUser.username);
          setUserEmailInput(currentUser.email);
          setIsEditingUserInfo(false);
          setCancelUserAlertVisible(false);
        }}
      />
      <SaveAlert
        visible={saveIntroAlertVisible}
        onCancel={() => setSaveIntroAlertVisible(false)}
        onConfirm={async () => {
          const updatedUser = { ...currentUser, introduction: introText };
          setCurrentUser(updatedUser);
          await AsyncStorage.setItem(
            'currentUser',
            JSON.stringify(updatedUser)
          );
          await updateUser(updatedUser);
          setIsEditingIntro(false);
          setSaveIntroAlertVisible(false);
        }}
      />
      <CancelAlert
        visible={cancelIntroAlertVisible}
        onKeepEditing={() => setCancelIntroAlertVisible(false)}
        onDiscard={() => {
          setIntroText(currentUser.introduction);
          setIsEditingIntro(false);
          setCancelIntroAlertVisible(false);
        }}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { paddingBottom: 80 },
});
