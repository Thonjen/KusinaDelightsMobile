import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeDetailHeader from '../../components/HeaderCenter'; // Shared header component
import AdminBottomNavbar from '../../components/AdminBottomNavbar';

const AdminProfile = () => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  // Sample stat placeholders
  const [postsCount, setPostsCount] = useState(10);
  const [reviewsCount, setReviewsCount] = useState(10);
  const [usersCount, setUsersCount] = useState(180);
  const [chefsCount, setChefsCount] = useState(10);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userString = await AsyncStorage.getItem('currentUser');
        if (userString) {
          setCurrentUser(JSON.parse(userString));
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      router.push('/'); // or '/login'
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const screenWidth = Dimensions.get('window').width;

  // Basic fallback for admin info
  const username = currentUser?.username || 'Code_Celestia';
  const email = currentUser?.email || 'admin@example.com';
  const dateJoined = currentUser?.dateJoined
    ? new Date(currentUser.dateJoined).toLocaleDateString()
    : 'N/A';

  return (
    <View style={styles.container}>
      {/* Use the shared header component */}
      <RecipeDetailHeader headerTitle="Admin Profile" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={[styles.card, styles.profileCard]}>
          <View style={styles.profileAvatarContainer}>
            <Ionicons name="person-circle" size={80} color="#000" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.profileEmail}>Email: {email}</Text>
            <Text style={styles.profileDate}>Date Joined: {dateJoined}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editIcon} onPress={() => router.push('/profile')}>
            <Ionicons name="create-outline" size={20} color="#000" />
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
          {/* Placeholder chart area */}
          <View style={styles.chartContainer}>
            <View style={styles.chartLine} />
            <Text style={styles.chartPlaceholderText}>[Growth Chart Placeholder]</Text>
          </View>
        </View>
      </ScrollView>

      {/* Admin Bottom Navbar */}
      <AdminBottomNavbar />
    </View>
  );
};

export default AdminProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  card: {
    backgroundColor: '#FFF',
    margin: 16,
    borderRadius: 20,
    padding: 16,
    elevation: 2,
  },
  // 1) Profile Card
  profileCard: {
    alignItems: 'center',
    position: 'relative',
  },
  profileAvatarContainer: {
    marginBottom: 10,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  profileDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  editIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  logoutButton: {
    backgroundColor: '#AEF6C7',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginTop: 10,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  // 2) Stats Card
  statsCard: {
    justifyContent: 'center',
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
    fontWeight: '600',
  },
  // 3) Growth Card
  growthCard: {
    alignItems: 'center',
  },
  growthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
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
    marginTop: 20,
  },
});
