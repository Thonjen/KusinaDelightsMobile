import React from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ProfileInfoCard = ({
  currentUser,
  isEditing,
  userNameInput,
  userEmailInput,
  formattedDate,
  onUserNameChange,
  onUserEmailChange,
  onEditPress,
  onSavePress,
  onCancelPress,
  onProfileImageChange,
  charLimit,
  userNameLength,
  onLogoutPress,
}) => {
  const router = useRouter();

  const handleAdminDashboardPress = () => {
    router.push('/admin/adminProfile');
  };

  return (
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
        {/* Show change image button if editing */}
        {isEditing && (
          <TouchableOpacity style={styles.changeImageButton} onPress={onProfileImageChange}>
            <Text style={styles.changeImageText}>Change Image</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.cardBody}>
        {isEditing ? (
          <>
            <View style={styles.inputRow}>
              <Text style={styles.label}>Username: </Text>
              <TextInput
                style={styles.textInput}
                value={userNameInput}
                onChangeText={onUserNameChange}
                maxLength={charLimit}
              />
            </View>
            {/* Remove character counter and show warning only if max reached */}
            {userNameInput.length === charLimit && (
              <Text style={styles.warningText}>
                Username cannot exceed {charLimit} characters.
              </Text>
            )}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Email: </Text>
              <TextInput
                style={styles.textInput}
                value={userEmailInput}
                onChangeText={onUserEmailChange}
              />
            </View>
            <Text style={styles.infoText}>Date Joined: {formattedDate}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.confirmButton} onPress={onSavePress}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancelPress}>
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
            <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
              <Ionicons name="create-outline" size={20} color="#000" />
              <Text style={styles.editButtonText}>Edit Info</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
        {/* Admin dashboard button appears only for admin users */}
        {currentUser?.role === 'user' && (
          <TouchableOpacity style={styles.adminButton} onPress={handleAdminDashboardPress}>
            <Text style={styles.adminButtonText}>Admin Dashboard</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8D64E',
    margin: 16,
    borderRadius: 10,
    padding: 16,
  },
  // Box shadow for web and elevation for mobile
  boxShadow: {
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
    elevation: 4,
  },
  userInfoHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  changeImageButton: {
    marginTop: 8,
    backgroundColor: '#FFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  changeImageText: {
    fontSize: 12,
    color: '#333',
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  textInput: {
    width: '60%',
    fontSize: 16,
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  warningText: {
    alignSelf: 'flex-start',
    color: 'red',
    fontSize: 12,
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
  // Admin Dashboard button styles
  adminButton: {
    marginTop: 12,
    backgroundColor: '#000', // You can adjust the color as needed
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  adminButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});

export default ProfileInfoCard;
