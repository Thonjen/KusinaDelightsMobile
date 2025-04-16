// app/Profile.jsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
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
  
  // Alert visibility states
  const [saveUserAlertVisible, setSaveUserAlertVisible] = useState(false);
  const [cancelUserAlertVisible, setCancelUserAlertVisible] = useState(false);
  const [saveIntroAlertVisible, setSaveIntroAlertVisible] = useState(false);
  const [cancelIntroAlertVisible, setCancelIntroAlertVisible] = useState(false);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (userString) {
          const user = JSON.parse(userString);
          setCurrentUser(user);
          setUserNameInput(user.username || '');
          setUserEmailInput(user.email || '');
          setIntroText(user.introduction || 'No introduction yet.');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const formattedDate = currentUser?.dateJoined
    ? new Date(currentUser.dateJoined).toLocaleDateString()
    : 'N/A';
  
  // User Info Handlers
  const onUserInfoSaveConfirm = async () => {
    const updatedUser = {
      ...currentUser,
      username: userNameInput,
      email: userEmailInput,
    };
    setCurrentUser(updatedUser);
    await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
    await updateUser(updatedUser);
    setIsEditingUserInfo(false);
    setSaveUserAlertVisible(false);
  };
  
  const onUserInfoSaveCancel = () => {
    setSaveUserAlertVisible(false);
  };
  
  const onUserInfoCancelDiscard = () => {
    setUserNameInput(currentUser?.username || '');
    setUserEmailInput(currentUser?.email || '');
    setIsEditingUserInfo(false);
    setCancelUserAlertVisible(false);
  };
  
  const onUserInfoCancelKeepEditing = () => {
    setCancelUserAlertVisible(false);
  };
  
  // Intro Handlers
  const onIntroSaveConfirm = async () => {
    const updatedUser = { ...currentUser, introduction: introText };
    setCurrentUser(updatedUser);
    await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
    await updateUser(updatedUser);
    setIsEditingIntro(false);
    setSaveIntroAlertVisible(false);
  };
  
  const onIntroSaveCancel = () => {
    setSaveIntroAlertVisible(false);
  };
  
  const onIntroCancelDiscard = () => {
    setIntroText(currentUser?.introduction || 'No introduction yet.');
    setIsEditingIntro(false);
    setCancelIntroAlertVisible(false);
  };
  
  const onIntroCancelKeepEditing = () => {
    setCancelIntroAlertVisible(false);
  };
  
  // Handler for picking a new profile image
  const onProfileImageChange = async () => {
    // Request permissions on mobile
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }
    // Launch the image library with base64 enabled
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });
    if (!result.cancelled) {
      // On web, use the base64 string to create a data URI (if available)
      let newImageUri = result.uri;
      if (result.base64) {
        newImageUri = `data:image/jpeg;base64,${result.base64}`;
      }
      const updatedUser = { ...currentUser, profileImage: newImageUri };
      setCurrentUser(updatedUser);
      await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));
      await updateUser(updatedUser);
    }
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
          onProfileImageChange={onProfileImageChange}
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
      
      {/* Alerts for User Info */}
      <SaveAlert
        visible={saveUserAlertVisible}
        onCancel={onUserInfoSaveCancel}
        onConfirm={onUserInfoSaveConfirm}
      />
      <CancelAlert
        visible={cancelUserAlertVisible}
        onKeepEditing={onUserInfoCancelKeepEditing}
        onDiscard={onUserInfoCancelDiscard}
      />
      
      {/* Alerts for Introduction */}
      <SaveAlert
        visible={saveIntroAlertVisible}
        onCancel={onIntroSaveCancel}
        onConfirm={onIntroSaveConfirm}
      />
      <CancelAlert
        visible={cancelIntroAlertVisible}
        onKeepEditing={onIntroCancelKeepEditing}
        onDiscard={onIntroCancelDiscard}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 80,
  },
});
