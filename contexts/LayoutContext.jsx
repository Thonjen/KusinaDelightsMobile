import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LayoutContext = createContext({
  layout: 'default',
  setLayout: () => {},
});

export const LayoutProvider = ({ children }) => {
  const [layout, setLayoutState] = useState('default');

  // Load the saved layout preference when the provider mounts.
  useEffect(() => {
    const loadLayoutPreference = async () => {
      try {
        const savedLayout = await AsyncStorage.getItem('preferredLayout');
        if (savedLayout) {
          setLayoutState(savedLayout);
        }
      } catch (error) {
        console.error('Error loading layout preference', error);
      }
    };

    loadLayoutPreference();
  }, []);

  // Update AsyncStorage whenever the layout is changed.
  const setLayout = async (newLayout) => {
    try {
      await AsyncStorage.setItem('preferredLayout', newLayout);
      setLayoutState(newLayout);
    } catch (error) {
      console.error('Error saving layout preference', error);
    }
  };

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};
