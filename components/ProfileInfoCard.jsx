// components/ProfileInfoCard.jsx
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
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
  onCameraPress,
  onGalleryPress,
  charLimit,
  userNameLength,
  onLogoutPress,
}) => {
  const router = useRouter();
  const goAdmin = () => router.push('/admin/adminProfile');
  const goChef  = () => router.push('/chef/chefProfile');

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

        {isEditing && (
          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={onCameraPress}>
              <Ionicons name="camera" size={18} color="#333" />
              <Text style={styles.imageButtonText}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={onGalleryPress}>
              <Ionicons name="image" size={18} color="#333" />
              <Text style={styles.imageButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        {isEditing ? (
          <>
            {/* Username */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Username:</Text>
              <TextInput
                style={styles.textInput}
                value={userNameInput}
                onChangeText={onUserNameChange}
                maxLength={charLimit}
              />
            </View>
            {userNameLength === charLimit && (
              <Text style={styles.warningText}>
                Username cannot exceed {charLimit} characters.
              </Text>
            )}

            {/* Email */}
            <View style={styles.inputRow}>
              <Text style={styles.label}>Email:</Text>
              <TextInput
                style={styles.textInput}
                value={userEmailInput}
                onChangeText={onUserEmailChange}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <Text style={styles.infoText}>Date Joined: {formattedDate}</Text>

            {/* Save / Cancel */}
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
            {/* Read‑only info */}
            <View style={styles.infoItem}>
              <Text style={styles.label}>Username:</Text>
              <Text style={styles.infoText}>{currentUser?.username}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Email:</Text>
              <Text style={styles.infoText}>{currentUser?.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Date Joined:</Text>
              <Text style={styles.infoText}>{formattedDate}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
              <Ionicons name="create-outline" size={20} color="#000" />
              <Text style={styles.editButtonText}>Edit Info</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={onLogoutPress}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

        {/* Admin Dashboard */}
        {currentUser?.role === 'user' && (
          <TouchableOpacity style={styles.adminButton} onPress={goAdmin}>
            <Text style={styles.adminButtonText}>Admin Dashboard</Text>
          </TouchableOpacity>
        )}

        {/* Chef Dashboard (chefs only) */}
        {currentUser?.role === 'user' && (
          <TouchableOpacity style={styles.chefButton} onPress={goChef}>
            <Ionicons name="bar-chart" size={16} color="#FFF" />
            <Text style={styles.chefButtonText}>Chef Dashboard</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ProfileInfoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8D64E',
    margin: 16,
    borderRadius: 12,
    padding: 16,
  },
  boxShadow: {
    elevation: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  userInfoHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  profileImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  imageButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 6,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  imageButtonText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#333',
  },
  cardBody: { alignItems: 'center' },
  infoItem: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
  label: { fontWeight: 'bold', fontSize: 16 },
  infoText: { fontSize: 16, marginLeft: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 8,
    marginLeft: 6,
  },
  warningText: {
    alignSelf: 'flex-start',
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
  },
  infoTextSmall: { fontSize: 14 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#AEF6C7',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F88',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: { fontSize: 16, fontWeight: '600' },
  editButton: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  editButtonText: { marginLeft: 4, fontSize: 16 },
  logoutButton: {
    backgroundColor: '#AEF6C7',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 12,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#333' },
  adminButton: {
    marginTop: 12,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  adminButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  chefButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  chefButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
  },
});
