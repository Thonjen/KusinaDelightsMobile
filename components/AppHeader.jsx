import React from 'react';
import { View, Text, Image, StyleSheet, Animated, TextInput } from 'react-native';
import ProfileButton from './ProfileButton';

const AppHeader = ({
  headerTitle,
  currentUser,
  onProfilePress,
  animatedStyle,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <Animated.View style={[styles.headerContainer, animatedStyle]}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/KusinaDelightsLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>{headerTitle}</Text>
        </View>
        <ProfileButton currentUser={currentUser} onPress={onProfilePress} />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Recipes..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
    elevation: 2,
  },
  searchBar: {
    fontSize: 16,
  },
});

export default AppHeader;
