// app/profile.jsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import HeaderCenter from '../components/HeaderCenter';
import BottomNavbar from '../components/BottomNavbar';
import SaveAlert from '../components/alerts/SaveAlert';
import CancelAlert from '../components/alerts/CancelAlert';
import ReviewDeleteAlert from '../components/alerts/ReviewDeleteAlert';
import {
  updateUser,
  getReviews,
  getRecipes,
  removeReview
} from '../database/database';
import ProfileInfoCard from '../components/ProfileInfoCard';
import ProfileIntroCard from '../components/ProfileIntroCard';
import ProfileHistoryCard from '../components/ProfileHistoryCard';

const Profile = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [introText, setIntroText] = useState('');
  // alert state
  const [saveUserAlertVisible, setSaveUserAlertVisible] = useState(false);
  const [cancelUserAlertVisible, setCancelUserAlertVisible] = useState(false);
  const [saveIntroAlertVisible, setSaveIntroAlertVisible] = useState(false);
  const [cancelIntroAlertVisible, setCancelIntroAlertVisible] = useState(false);
  // history
  const [history, setHistory] = useState([]);
  const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);
  const [toDeleteRecipeId, setToDeleteRecipeId] = useState(null);

  // load user & history
  useEffect(() => {
    (async () => {
      const userString = await AsyncStorage.getItem('currentUser');
      if (!userString) return;
      const user = JSON.parse(userString);
      setCurrentUser(user);
      setUserNameInput(user.username);
      setUserEmailInput(user.email);
      setIntroText(user.introduction || 'No introduction yet.');
      await loadHistory(user.id);
    })();
  }, []);

  const loadHistory = async (userId) => {
    const allReviews = await getReviews();
    const byUser = allReviews.filter(r => r.userId === userId);
    // group by recipeId, take the latest review per recipe
    const grouped = {};
    byUser.forEach(r => {
      if (!grouped[r.recipeId] || grouped[r.recipeId].dateCreated < r.dateCreated) {
        grouped[r.recipeId] = r;
      }
    });
    const recipes = await getRecipes();
    const hist = Object.values(grouped).map(r => {
      const rec = recipes.find(p => p.id === r.recipeId) || {};
      return {
        recipeId: r.recipeId,
        name: rec.name,
        image: rec.image,
        author: rec.author,
        comment: r.comment,
        dateCreated: r.dateCreated,
        rating: r.rating
      };
    });
    setHistory(hist);
  };

  const formattedDate = currentUser?.dateJoined
    ? new Date(currentUser.dateJoined).toLocaleDateString()
    : 'N/A';

  const pickImage = async (fromCamera = false) => {
    const perm = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== 'granted') {
      return Alert.alert('Permission required','Please grant permission.');
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({allowsEditing:true,aspect:[1,1],quality:1})
      : await ImagePicker.launchImageLibraryAsync({mediaTypes:ImagePicker.MediaTypeOptions.Images,allowsEditing:true,aspect:[1,1],quality:1});
    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri ?? result.uri;
    if (!uri) return;
    const updated = { ...currentUser, profileImage: uri };
    setCurrentUser(updated);
    await AsyncStorage.setItem('currentUser', JSON.stringify(updated));
    await updateUser(updated);
  };

  const handleDeleteHistory = (recipeId) => {
    setToDeleteRecipeId(recipeId);
    setDeleteAlertVisible(true);
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
          onLogoutPress={async () => {
            await AsyncStorage.removeItem('currentUser');
            router.push('/');
          }}
        />

        <ProfileIntroCard
          introText={introText}
          isEditing={isEditingIntro}
          onIntroChange={setIntroText}
          onEditPress={() => setIsEditingIntro(true)}
          onSavePress={() => setSaveIntroAlertVisible(true)}
          onCancelPress={() => setCancelIntroAlertVisible(true)}
        />

        {/* ----------- History Card ----------- */}
        <ProfileHistoryCard
          history={history}
          onView={(id) => router.push(`/recipeDetail?id=${id}`)}
          onDelete={handleDeleteHistory}
        />
      </ScrollView>
      <BottomNavbar />

      {/* User Info Save/Cancel */}
      <SaveAlert
        visible={saveUserAlertVisible}
        onCancel={() => setSaveUserAlertVisible(false)}
        onConfirm={async () => {
          const updated = { ...currentUser, username: userNameInput, email: userEmailInput };
          setCurrentUser(updated);
          await AsyncStorage.setItem('currentUser', JSON.stringify(updated));
          await updateUser(updated);
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

      {/* Intro Save/Cancel */}
      <SaveAlert
        visible={saveIntroAlertVisible}
        onCancel={() => setSaveIntroAlertVisible(false)}
        onConfirm={async () => {
          const updated = { ...currentUser, introduction: introText };
          setCurrentUser(updated);
          await AsyncStorage.setItem('currentUser', JSON.stringify(updated));
          await updateUser(updated);
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

      {/* History Delete Confirmation */}
      <ReviewDeleteAlert
        visible={deleteAlertVisible}
        onCancel={() => setDeleteAlertVisible(false)}
        onConfirm={async () => {
          // remove all reviews for that recipe by this user
          const all = await getReviews();
          const toRemove = all.filter(r =>
            r.userId === currentUser.id && r.recipeId === toDeleteRecipeId
          );
          for (let r of toRemove) {
            await removeReview(r.id);
          }
          setDeleteAlertVisible(false);
          await loadHistory(currentUser.id);
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
