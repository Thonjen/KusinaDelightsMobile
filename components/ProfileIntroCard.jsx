// components/ProfileIntroCard.jsx
import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileIntroCard = ({
  introText,
  isEditing,
  onIntroChange,
  onEditPress,
  onSavePress,
  onCancelPress,
}) => {
  return (
    <View style={[styles.card, styles.boxShadow]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Introduction:</Text>
        {!isEditing && (
          <TouchableOpacity style={styles.editIcon} onPress={onEditPress}>
            <Ionicons name="create-outline" size={20} color="#000" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.cardBody}>
        {isEditing ? (
          <>
            <TextInput
              style={styles.textInput}
              multiline
              value={introText}
              onChangeText={onIntroChange}
            />
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
          <Text style={styles.cardContent}>{introText}</Text>
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
  boxShadow: {
    boxShadow: "0px 2px 4px rgba(0,0,0,0.3)",
  },
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
  cardBody: {
    alignItems: 'center',
  },
  cardContent: {
    fontSize: 16,
    lineHeight: 22,
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
});

export default ProfileIntroCard;
