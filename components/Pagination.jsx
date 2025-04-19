import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageSizeChange,
  onNextPage,
  onPrevPage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Row 1: Page Size */}
        <View style={styles.row}>
          <Text style={styles.label}>Posts per page:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              mode="dropdown" // explicitly set mode
              selectedValue={pageSize}
              style={styles.picker}
              onValueChange={onPageSizeChange}
              dropdownIconColor="#333"
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="5" value={5} />
              <Picker.Item label="10" value={10} />
              <Picker.Item label="15" value={15} />
              <Picker.Item label="20" value={20} />
            </Picker>
          </View>
        </View>
        {/* Row 2: Navigation */}
        <View style={[styles.row, styles.navRow]}>
          <TouchableOpacity
            style={[styles.navButton, currentPage === 1 && styles.disabledButton]}
            onPress={onPrevPage}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.pageInfo}>
            {currentPage} / {totalPages}
          </Text>
          <TouchableOpacity
            style={[styles.navButton, currentPage === totalPages && styles.disabledButton]}
            onPress={onNextPage}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="chevron-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '70%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 8,
    elevation: 3,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  innerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  pickerContainer: {
    borderRadius: 6,
    backgroundColor: '#F8D64E',
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    width: 100, // increased width so the selected value shows clearly
    color: '#333',
  },
  pickerItem: {
    fontSize: 15,
    color: '#333',
  },
  navRow: {
    marginTop: 8,
  },
  navButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.4,
  },
  pageInfo: {
    fontSize: 14,
    color: '#333',
    marginHorizontal: 12,
    fontWeight: '600',
  },
});

export default Pagination;
