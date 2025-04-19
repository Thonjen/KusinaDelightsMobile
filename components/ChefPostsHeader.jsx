// components/ChefPostsHeader.jsx
import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const ChefPostsHeader = ({
  title,
  searchQuery,
  onSearchChange,
  ratingFilter,
  onRatingChange,
}) => {
  const ratings = ['all', 1, 2, 3, 4, 5];

  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <Image
          source={require('../assets/images/KusinaDelightsLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{title}</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search recipes..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      <View style={styles.filterRow}>
        {ratings.map(r => (
          <TouchableOpacity
            key={r}
            style={[
              styles.filterBtn,
              ratingFilter === r && styles.filterBtnActive,
            ]}
            onPress={() => onRatingChange(r)}
          >
            <Text
              style={[
                styles.filterBtnText,
                ratingFilter === r && styles.filterBtnTextActive,
              ]}
            >
              {r === 'all' ? 'All' : `${r}★`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ChefPostsHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  searchInput: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#DDD',
  },
  filterBtnActive: {
    backgroundColor: '#FFF',
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  filterBtnTextActive: {
    color: '#000',
  },
});
