import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Use named imports for the database
import * as database from '../database/database';
import RecipeCard from '../components/RecipeCard';
import MediumRecipeCard from '../components/MediumRecipeCard';
import ListRecipeCard from '../components/ListRecipeCard';
import BottomNavbar from '../components/BottomNavbar';
import { LayoutContext } from '../contexts/LayoutContext';
import ProfileButton from '../components/ProfileButton';

const Recipe = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { layout } = useContext(LayoutContext);

  // Fetch recipes from the database and sort so that the newest appear first.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await database.getRecipes();
        // Reverse array to display the newest recipes first
        const sortedRecipes = [...data].reverse();
        const visibleRecipes = sortedRecipes.filter((recipe) => !recipe.hidden);
        setRecipes(visibleRecipes);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };
    fetchData();
  }, []);

  // Retrieve the current user from AsyncStorage
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

  const headerScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolate: 'clamp',
  });

  // Filter recipes based on the search query
  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewRecipe = (id) => {
    router.push(`/recipeDetail?id=${id}`);
  };

  return (
    <View style={styles.container}>
      {/* Animated Header with ProfileButton Component */}
      <Animated.View style={[styles.header, { transform: [{ scale: headerScale }] }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/KusinaDelightsLogo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Recent Recipes</Text>
          </View>
          <ProfileButton 
            currentUser={currentUser}
            onPress={() => router.push('/profile')}
          />
        </View>
      </Animated.View>

      {/* Search Bar */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search Recent Recipes..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Scrollable List of Recipes */}
      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingTop: 5 }}
        bounces={true}
        overScrollMode="always"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: Platform.OS !== 'web' }
        )}
        scrollEventThrottle={16}
      >
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>Recent Recipes</Text>
        {layout === 'medium' ? (
          <View style={styles.gridContainer}>
            {filteredRecipes.map((item) => (
              <MediumRecipeCard key={item.id} item={item} onPress={handleViewRecipe} />
            ))}
          </View>
        ) : (
          filteredRecipes.map((item) => {
            if (layout === 'default') {
              return <RecipeCard key={item.id} item={item} onPress={handleViewRecipe} />;
            } else if (layout === 'list') {
              return <ListRecipeCard key={item.id} item={item} onPress={handleViewRecipe} />;
            }
            return null;
          })
        )}
      </Animated.ScrollView>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </View>
  );
};

export default Recipe;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#F8D64E',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F8D64E',
    justifyContent: 'center',
    paddingBottom: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 4,
    boxShadow: "0px 2px 1px rgba(0,0,0,0.2)",
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    elevation: 2,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
});
