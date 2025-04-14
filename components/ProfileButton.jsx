import React from 'react';
import { TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileButton = ({ currentUser, onPress }) => {
  return (
    <TouchableOpacity style={styles.profileButton} onPress={onPress}>
      {currentUser && currentUser.profileImage ? (
        <Image
          source={{ uri: currentUser.profileImage }}
          style={styles.profileImage}
        />
      ) : (
        <Ionicons name="person" size={20} color="black" />
      )}
      {currentUser && (
        <Text style={styles.username}>{currentUser.username}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCE98E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    // Use boxShadow for web compatibility:
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
  profileImage: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    marginRight: 6,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});

export default ProfileButton;
