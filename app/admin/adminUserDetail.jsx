import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import RecipeDetailHeader from '../../components/HeaderCenter';
import AdminBottomNavbar from '../../components/AdminBottomNavbar';
import * as database from '../../database/database';
import RemoveUserAlert from '../../components/alerts/RemoveUserAlert';

const AdminUserDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [recipeCount, setRecipeCount] = useState(0);
  const [removeAlertVisible, setRemoveAlertVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const all = await database.getUsers();
      const u = all.find(x => x.id === id);
      if (!u) {
        Alert.alert('Not found','That user does not exist.',[
          { text:'OK', onPress:() => router.back() }
        ]);
        return;
      }
      setUser(u);

      if (u.role === 'chef') {
        const allRecipes = await database.getRecipes();
        setRecipeCount(allRecipes.filter(r => r.author === u.username).length);
      }
    })();
  }, [id]);

  const onRemoveConfirm = async () => {
    await database.removeUser(user.id);
    setRemoveAlertVisible(false);
    router.replace('/admin/adminUsers');
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <RecipeDetailHeader headerTitle="User Detail" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          {user.profileImage ? (
            <Image source={{ uri: user.profileImage }} style={styles.avatar} />
          ) : null}

          <Text style={styles.line}>
            <Text style={styles.bold}>Username:</Text> {user.username}
          </Text>
          <Text style={styles.line}>
            <Text style={styles.bold}>Email:</Text> {user.email}
          </Text>
          <Text style={styles.line}>
            <Text style={styles.bold}>Role:</Text> {user.role}
          </Text>
          <Text style={styles.line}>
            <Text style={styles.bold}>Joined:</Text>{' '}
            {new Date(user.dateJoined).toLocaleDateString()}
          </Text>
          {user.introduction ? (
            <Text style={styles.line}>
              <Text style={styles.bold}>Introduction:</Text> {user.introduction}
            </Text>
          ) : null}
          {user.role === 'chef' && (
            <Text style={styles.line}>
              <Text style={styles.bold}>Recipes:</Text> {recipeCount}
            </Text>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.editButton]}
              onPress={() => router.push(`/admin/adminEditUser?id=${user.id}`)}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.removeButton]}
              onPress={() => setRemoveAlertVisible(true)}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <AdminBottomNavbar />

      <RemoveUserAlert
        visible={removeAlertVisible}
        recipeCount={recipeCount}
        onCancel={() => setRemoveAlertVisible(false)}
        onConfirm={onRemoveConfirm}
      />
    </View>
  );
};

export default AdminUserDetail;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F5F5F5' 
  },
  scrollContent: { 
    padding: 16, 
    paddingBottom: 90 
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 12,
  },
  line: { 
    fontSize: 18, 
    marginVertical: 6 
  },
  bold: { 
    fontWeight: '600' 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: { 
    flex: 1, 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginHorizontal: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)", 
  },
  editButton: { 
    backgroundColor: '#AEF6C7' 
  },
  removeButton: { 
    backgroundColor: '#F88' 
  },
  buttonText: { 
    color: '#333', 
    fontWeight: '600' 
  },
});
