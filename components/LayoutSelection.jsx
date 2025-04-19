import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// A preview component that shows an example look of the recipe card for each layout option.
const CardPreview = ({ layout }) => {
  if (layout === 'default') {
    return (
      <View style={styles.previewDefault}>
        <View style={styles.previewImageDefault} />
        <View style={styles.previewContentDefault}>
          <Text style={styles.previewTitle}>Recipe Title</Text>
          <Text style={styles.previewDesc}>
            This is a sample description for a default card layout.
          </Text>
        </View>
      </View>
    );
  } else if (layout === 'medium') {
    return (
      <View style={styles.previewMediumRow}>
        <View style={styles.previewMediumCard}>
          <View style={styles.previewImageMedium} />
          <View style={styles.previewContentMedium}>
            <Text style={styles.previewTitleMedium}>Title</Text>
            <Text style={styles.previewDescMedium}>
              Short description here.
            </Text>
          </View>
        </View>
        <View style={styles.previewMediumCard}>
          <View style={styles.previewImageMedium} />
          <View style={styles.previewContentMedium}>
            <Text style={styles.previewTitleMedium}>Title</Text>
            <Text style={styles.previewDescMedium}>
              Short description here.
            </Text>
          </View>
        </View>
      </View>
    );
  } else if (layout === 'list') {
    return (
      <View style={styles.previewList}>
        <View style={styles.previewImageList} />
        <View style={styles.previewContentList}>
          <Text style={styles.previewTitleList}>Recipe Title</Text>
          <Text style={styles.previewDescList}>Sample description...</Text>
        </View>
      </View>
    );
  }
  return null;
};

const LayoutSelection = ({ visible, selectedLayout, setSelectedLayout, onClose }) => {
  // Save the preferred layout in AsyncStorage.
  const handleSetLayout = async (layoutValue) => {
    try {
      await AsyncStorage.setItem('preferredLayout', layoutValue);
      setSelectedLayout(layoutValue);
    } catch (error) {
      console.error('Error saving layout preference', error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackground}>
        <View style={styles.container}>
          <Text style={styles.title}>Choose Recipe Layout</Text>
          <View style={styles.previewContainer}>
            <CardPreview layout={selectedLayout} />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                selectedLayout === 'default' && styles.selectedButton,
              ]}
              onPress={() => handleSetLayout('default')}
            >
              <Text style={styles.buttonText}>Default / Large Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedLayout === 'medium' && styles.selectedButton,
              ]}
              onPress={() => handleSetLayout('medium')}
            >
              <Text style={styles.buttonText}>Medium Card</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                selectedLayout === 'list' && styles.selectedButton,
              ]}
              onPress={() => handleSetLayout('list')}
            >
              <Text style={styles.buttonText}>List Card</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LayoutSelection;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  previewContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  // Default Layout Preview Styles
  previewDefault: {
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    elevation: 3,
  },
  previewImageDefault: {
    width: '100%',
    height: 120,
    backgroundColor: '#ddd',
  },
  previewContentDefault: {
    padding: 10,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  previewDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  // Medium Layout Preview Styles
  previewMediumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  previewMediumCard: {
    width: '48%',
    borderRadius: 12,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    elevation: 3,
  },
  previewImageMedium: {
    width: '100%',
    height: 100,
    backgroundColor: '#ddd',
  },
  previewContentMedium: {
    padding: 8,
  },
  previewTitleMedium: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  previewDescMedium: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  // List Layout Preview Styles
  previewList: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    marginVertical: 10,
    elevation: 3,
  },
  previewImageList: {
    width: 80,
    height: 80,
    backgroundColor: '#ddd',
  },
  previewContentList: {
    flex: 1,
    padding: 8,
  },
  previewTitleList: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  previewDescList: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#F8D64E',
    paddingVertical: 12,
    borderRadius: 10,
    marginVertical: 6,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#FFA500',
    elevation: 4,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
