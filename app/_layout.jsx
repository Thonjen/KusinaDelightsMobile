import React from 'react';
import { Slot } from 'expo-router';
import { LayoutProvider } from '../contexts/LayoutContext';

const RootLayout = () => {
  return (
    <LayoutProvider>
      <Slot />
    </LayoutProvider>
  );
};

export default RootLayout;
