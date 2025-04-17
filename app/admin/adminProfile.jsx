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
import RecipeDetailHeader from '../../components/HeaderCenter';
import AdminBottomNavbar from '../../components/AdminBottomNavbar';
import {
  getUserProfile,
  getUsers,
  getRecipes,
  getReviews,
  getChefs,
} from '../../database/database';

const AdminProfile = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [postsCount, setPostsCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [chefsCount, setChefsCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (!userString) throw new Error('Not logged in');
        const user = JSON.parse(userString);
        setCurrentUser(user);

        const prof = await getUserProfile(user.id);
        setProfile(prof);

        const [recipes, reviews, users, chefs] = await Promise.all([
          getRecipes(),
          getReviews(),
          getUsers(),
          getChefs(),
        ]);
        setPostsCount(recipes.length);
        setReviewsCount(reviews.length);
        setUsersCount(users.length);
        setChefsCount(chefs.length);
      } catch (e) {
        console.error(e);
        Alert.alert('Error', 'Could not load admin profile data.');
      }
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('currentUser');
    router.push('/');
  };

  const handleBackHome = () => {
    router.push('/home');
  };

  if (!currentUser) return null;

  const username = currentUser.username;
  const email = currentUser.email;
  const dateJoined = currentUser.dateJoined
    ? new Date(currentUser.dateJoined).toLocaleDateString()
    : 'N/A';
  const avatarUri = profile?.profileImage || currentUser.profileImage;

  return (
    <View style={styles.container}>
      <RecipeDetailHeader headerTitle="Admin Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={[styles.card, styles.profileCard]}>
          <View style={styles.profileAvatarContainer}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.profileAvatar} />
            ) : (
              <Ionicons name="person-circle" size={180} color="#000" />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.profileEmail}>Email: {email}</Text>
            <Text style={styles.profileDate}>Joined: {dateJoined}</Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.homeButton} onPress={handleBackHome}>
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editIcon}
            onPress={() => router.push('/profile')}
          >
            <Ionicons name="create-outline" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Stats Card */}
        <View style={[styles.card, styles.statsCard]}>
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{postsCount} Posts</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{reviewsCount} Reviews</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{usersCount} Users</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsNumber}>{chefsCount} Chefs</Text>
            </View>
          </View>
        </View>

        {/* Growth Card */}
        <View style={[styles.card, styles.growthCard]}>
          <Text style={styles.growthTitle}>Users Growth</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartLine} />
            <Text style={styles.chartPlaceholderText}>
              [Growth Chart Placeholder]
            </Text>
          </View>
        </View>
      </ScrollView>

      <AdminBottomNavbar />
    </View>
  );
};

export default AdminProfile;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  scrollContent: { 
    paddingBottom: 90 
  },
  card: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 20,
    padding: 16,
    elevation: 2,
  },
  profileCard: { 
    alignItems: 'center', 
    position: 'relative' 
  },
  profileAvatarContainer: { 
    marginBottom: 10 
  },
  profileAvatar: { 
    width: 180, 
    height: 180, 
    borderRadius: 90 
  },
  profileInfo: { 
    alignItems: 'center' 
  },
  profileName: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  profileEmail: { 
    fontSize: 16, 
    marginBottom: 4 
  },
  profileDate: { 
    fontSize: 16, 
    marginBottom: 8 
  },
  logoutButton: {
    backgroundColor: '#AEF6C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#333' 
  },
  homeButton: {
    backgroundColor: '#F8D64E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 8,
  },
  homeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  editIcon: { 
    position: 'absolute', 
    top: 16, 
    right: 16 
  },
  statsCard: { 
    justifyContent: 'center' 
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statsItem: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#F8D64E',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    elevation: 1,
  },
  statsNumber: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  growthCard: { 
    alignItems: 'center' 
  },
  growthTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
  chartContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#FFF7D7',
    borderRadius: 12,
    elevation: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartLine: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#F8D64E',
  },
  chartPlaceholderText: { 
    fontSize: 14, 
    color: '#999', 
    marginTop: 20 
  },
});
