import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

const BottomNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const activeTabAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(activeTabAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(activeTabAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(activeTabAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pathname]);

  const isActive = (route) => pathname === route;

  const tabs = [
    { route: '/home', label: 'Home', icon: 'home' },
    { route: '/recipe', label: 'Recipe', icon: 'book' },
    { route: '/favorites', label: 'Favorites', icon: 'star' },
    { route: '/settings', label: 'Settings', icon: 'cog' },
  ];

  const handleTabPress = (tab) => {
    router.push(tab.route);
  };

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbarBackground} />
      <View style={styles.tabRow}>
        {tabs.map((tab, index) => {
          const active = isActive(tab.route);
          const iconColor = 'black';

          return (
            <TouchableOpacity
              key={index}
              style={[styles.tabItem, active && styles.activeTabItem]}
              onPress={() => handleTabPress(tab)}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  active && {
                    backgroundColor: '#f0c209',
                    transform: [
                      {
                        translateY: activeTabAnim.interpolate({
                          inputRange: [0.8, 1, 1.2],
                          outputRange: [-5, -15, -5],
                        }),
                      },
                      { scale: activeTabAnim },
                    ],
                  },
                ]}
              >
                <Ionicons name={tab.icon} size={24} color={iconColor} />
              </Animated.View>
              <Text style={[styles.tabLabel, { color: iconColor }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default BottomNavbar;

const NAVBAR_HEIGHT = 70;

const styles = StyleSheet.create({
  navbarContainer: {
    height: NAVBAR_HEIGHT,
    position: 'absolute', // <-- fix here
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 10, // ensure it stays above content
  },
  navbarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F8D64E',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  tabRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 3,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 60,
    marginBottom: 5,
  },
  activeTabItem: {
    marginTop: -30,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
  },
});
