import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SettingsHeader = ({ headerTitle }) => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/KusinaDelightsLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>{headerTitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F8D64E",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    zIndex: 10,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default SettingsHeader;
