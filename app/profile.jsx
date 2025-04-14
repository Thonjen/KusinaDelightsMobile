import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import RecipeDetailHeader from '../components/HeaderCenter'; // Shared header component
import BottomNavbar from '../components/BottomNavbar';
import SaveAlert from '../components/alerts/SaveAlert';
import CancelAlert from '../components/alerts/CancelAlert';
import { updateUser } from '../database/database';

const Profile = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditingUserInfo, setIsEditingUserInfo] = useState(false);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [userNameInput, setUserNameInput] = useState('');
  const [userEmailInput, setUserEmailInput] = useState('');
  const [introText, setIntroText] = useState('');

  // Custom alert visibility states for user info
  const [saveUserAlertVisible, setSaveUserAlertVisible] = useState(false);
  const [cancelUserAlertVisible, setCancelUserAlertVisible] = useState(false);

  // Custom alert visibility states for intro editing
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

  // Format date joined as a localized date
  const formattedDate = currentUser?.dateJoined
    ? new Date(currentUser.dateJoined).toLocaleDateString()
    : 'N/A';

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

  return (
    <View style={styles.container}>
      <RecipeDetailHeader headerTitle="Profile" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Information Card */}
        <View style={[styles.card, styles.boxShadow]}>
          <View style={styles.userInfoHeader}>
            {currentUser?.profileImage ? (
              <Image
                source={{ uri: currentUser.profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={80} color="#000" />
            )}
          </View>
          <View style={styles.cardBody}>
            {isEditingUserInfo ? (
              <>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Username: </Text>
                  <TextInput
                    style={styles.textInput}
                    value={userNameInput}
                    onChangeText={setUserNameInput}
                    maxLength={10}  // Limit username to 10 characters
                  />
                </View>
                <Text style={styles.charLimitText}>
                  {userNameInput.length}/10 characters
                </Text>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>Email: </Text>
                  <TextInput
                    style={styles.textInput}
                    value={userEmailInput}
                    onChangeText={setUserEmailInput}
                  />
                </View>
                <Text style={styles.infoText}>Date Joined: {formattedDate}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => setSaveUserAlertVisible(true)}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setCancelUserAlertVisible(true)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Username: </Text>
                  <Text style={styles.infoText}>
                    {currentUser?.username || 'Guest'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Email: </Text>
                  <Text style={styles.infoText}>
                    {currentUser?.email || 'N/A'}
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.label}>Date Joined: </Text>
                  <Text style={styles.infoText}>{formattedDate}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => setIsEditingUserInfo(true)}
                >
                  <Ionicons name="create-outline" size={20} color="#000" />
                  <Text style={styles.editButtonText}>Edit Info</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Introduction Card */}
        <View style={[styles.card, styles.boxShadow]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Introduction:</Text>
            {!isEditingIntro && (
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => setIsEditingIntro(true)}
              >
                <Ionicons name="create-outline" size={20} color="#000" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.cardBody}>
            {isEditingIntro ? (
              <>
                <TextInput
                  style={styles.textInput}
                  multiline
                  value={introText}
                  onChangeText={setIntroText}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={() => setSaveIntroAlertVisible(true)}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setCancelIntroAlertVisible(true)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text style={styles.cardContent}>{introText}</Text>
            )}
          </View>
        </View>

        {/* History Card */}
        <View style={[styles.card, styles.boxShadow]}>
          <Text style={styles.cardTitle}>History:</Text>
          {['Food 1', 'Food 2', 'Food 3', 'Food 4'].map((item, index) => (
            <Text style={styles.historyItem} key={index}>
              {item}
            </Text>
          ))}
        </View>
      </ScrollView>

      <BottomNavbar />

      {/* Save Alert for User Info */}
      <SaveAlert
        visible={saveUserAlertVisible}
        onCancel={onUserInfoSaveCancel}
        onConfirm={onUserInfoSaveConfirm}
      />

      {/* Cancel Alert for User Info */}
      <CancelAlert
        visible={cancelUserAlertVisible}
        onKeepEditing={onUserInfoCancelKeepEditing}
        onDiscard={onUserInfoCancelDiscard}
      />

      {/* Save Alert for Introduction */}
      <SaveAlert
        visible={saveIntroAlertVisible}
        onCancel={onIntroSaveCancel}
        onConfirm={onIntroSaveConfirm}
      />

      {/* Cancel Alert for Introduction */}
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
  // Card styling – use boxShadow for web compatibility
  card: {
    backgroundColor: '#F8D64E',
    margin: 16,
    borderRadius: 10,
    padding: 16,
  },
  boxShadow: {
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  // User Info Card Header (centered)
  userInfoHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cardBody: {
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 4,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  editButtonText: {
    marginLeft: 4,
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#AEF6C7',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // Card Header for Introduction Card
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    position: 'relative',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  editIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 4,
  },
  cardContent: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    textAlign: 'center',
  },
  historyItem: {
    fontSize: 16,
    marginBottom: 2,
    color: '#333',
    textAlign: 'center',
  },
  textInput: {
    width: '100%',
    fontSize: 16,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: '#AEF6C7',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F88',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  charLimitText: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    fontSize: 12,
    color: '#888',
  },
});
