import React, { createContext, useState, useContext } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingContext = createContext({
    loading: false,
    setLoading: () => {}, // No type annotation here
  });
  

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}

      {/** full-screen overlay when loading */}
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#F8D64E" />
        </View>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,       // cover entire screen
    backgroundColor: 'rgba(0,0,0,0.4)',      // semi-transparent
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});
