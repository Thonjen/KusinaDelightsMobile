import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const NAVBAR_HEIGHT = 70;

export default function ChefBottomNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const anim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [pathname]);

  const tabs = [
    { route: "/chef/chefProfile", icon: "home", label: "Home" },
    { route: "/chef/chefPosts", icon: "document-text", label: "Posts" },
    { route: "/chef/chefCreateRecipe", icon: "add-circle", label: "Create" },
  ];

  const isActive = (r) => pathname === r;

  return (
    <View style={styles.navbarContainer}>
      <View style={styles.navbarBackground} />
      <View style={styles.tabRow}>
        {tabs.map((t) => {
          const active = isActive(t.route);
          return (
            <TouchableOpacity
              key={t.route}
              style={[styles.tabItem, active && styles.activeTabItem]}
              onPress={() => router.push(t.route)}
            >
              <Animated.View
                style={[
                  styles.iconContainer,
                  active && {
                    backgroundColor: "#f0c209",
                    transform: [
                      {
                        translateY: anim.interpolate({
                          inputRange: [0.8, 1, 1.2],
                          outputRange: [-5, -15, -5],
                        }),
                      },
                      { scale: anim },
                    ],
                  },
                ]}
              >
                <Ionicons name={t.icon} size={24} color="black" />
              </Animated.View>
              <Text style={styles.tabLabel}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbarContainer: { height: NAVBAR_HEIGHT, position: "relative" },
  navbarBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#F8D64E",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  tabRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingBottom: 3,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "flex-end",
    width: 60,
    marginBottom: 5,
  },
  activeTabItem: { marginTop: -30 },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: { fontSize: 10, color: "black", marginTop: 2 },
});
