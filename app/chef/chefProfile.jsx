import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderCenter from '../../components/HeaderCenter';
import ChefBottomNavbar from '../../components/ChefBottomNavbar';
import { getUserProfile, getRecipes, getReviews } from '../../database/database';

export default function ChefProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [postsCount, setPostsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [income, setIncome] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('currentUser');
        if (!stored) throw new Error('Not logged in');
        const u = JSON.parse(stored);
        setUser(u);

        // load profile image/introduction
        const prof = await getUserProfile(u.id);
        setProfile(prof);

        // fetch all recipes & reviews
        const allRecipes = await getRecipes();
        const myRecipes = allRecipes.filter(r => r.author === u.username);
        setPostsCount(myRecipes.length);

        const allReviews = await getReviews();
        // count reviews on my recipes
        setReviewsCount(
          allReviews.filter(r =>
            myRecipes.some(rc => rc.id === r.recipeId)
          ).length
        );

        // sum up each recipe’s `views` field (default to 0)
        setViewsCount(
          myRecipes.reduce((sum, r) => sum + (r.views || 0), 0)
        );

        // placeholder income = posts * $5
        setIncome(myRecipes.length * 5);
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Could not load chef profile.');
      }
    })();
  }, []);

  if (!user) return null;

  const joined = user.dateJoined
    ? new Date(user.dateJoined).toLocaleDateString()
    : 'N/A';
  const avatarUri = profile?.profileImage || user.profileImage;

  const logout = async () => {
    await AsyncStorage.removeItem('currentUser');
    router.push('/');
  };
  const backHome = () => router.push('/home');

  return (
    <View style={styles.container}>
      <HeaderCenter headerTitle="Chef Dashboard" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={[styles.card, styles.profileCard]}>
          <View style={styles.avatarContainer}>
            {avatarUri
              ? <Image source={{ uri: avatarUri }} style={styles.avatar} />
              : <Ionicons name="person-circle" size={100} color="#000" />}
          </View>
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.sub}>{user.email}</Text>
          <Text style={styles.sub}>Joined: {joined}</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.btn} onPress={logout}>
              <Text style={styles.btnText}>Log out</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.homeBtn]} onPress={backHome}>
              <Text style={styles.btnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Card */}
        <View style={[styles.card, styles.statsCard]}>
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{postsCount}</Text>
              <Text>Posts</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{reviewsCount}</Text>
              <Text>Reviews</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{viewsCount}</Text>
              <Text>Views</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>${income}</Text>
              <Text>Income</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <ChefBottomNavbar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: { paddingBottom: 90 },
  card: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
  },
  profileCard: {
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 100, height: 100, borderRadius: 50,
  },
  name: {
    fontSize: 22, fontWeight: 'bold', marginBottom: 4,
  },
  sub: {
    fontSize: 14, color: '#555', marginBottom: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    marginTop: 12,
  },
  btn: {
    backgroundColor: '#AEF6C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  homeBtn: {
    backgroundColor: '#F8D64E',
  },
  btnText: {
    fontWeight: '600',
    color: '#333',
  },
  statsCard: {},
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  statsItem: {
    flex: 1,
    backgroundColor: '#F8D64E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
