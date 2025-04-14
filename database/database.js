import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const USERS_KEY = 'KusinaDelights_USERS';
const USER_PROFILES_KEY = 'KusinaDelights_USER_PROFILES';
const CHEFS_KEY = 'KusinaDelights_CHEFS';
const RECIPES_KEY = 'KusinaDelights_RECIPES';
const REVIEWS_KEY = 'KusinaDelights_REVIEWS';

// Helper: save data
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving data', e);
  }
};

// Helper: get data
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error reading data', e);
  }
};

// Create a new user with default role 'user'
export const createUser = async (username, email, password) => {
  const users = (await getData(USERS_KEY)) || [];
  const newUser = {
    id: Date.now().toString(),
    username,
    email,
    password,
    role: 'user',
  };
  users.push(newUser);
  await storeData(USERS_KEY, users);
  return newUser;
};

// Create user profile
export const createUserProfile = async (
  userID,
  firstName,
  middleName,
  lastName,
  profileImage,
  introduction
) => {
  const profiles = (await getData(USER_PROFILES_KEY)) || [];
  const newProfile = {
    userID,
    firstName,
    middleName,
    lastName,
    profileImage,
    introduction,
  };
  profiles.push(newProfile);
  await storeData(USER_PROFILES_KEY, profiles);
  return newProfile;
};

// Update user record in the users array
export const updateUser = async (updatedUser) => {
  try {
    const users = (await getData(USERS_KEY)) || [];
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    await storeData(USERS_KEY, updatedUsers);
    return updatedUsers;
  } catch (error) {
    console.error('Error updating user', error);
  }
};

// Similarly, you can add functions for Chef, Recipe, and Reviews

export const getUsers = async () => {
  return (await getData(USERS_KEY)) || [];
};

export const getUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find((user) => user.email === email);
};

// Create a new recipe – now includes an author property and an optional youtubeTutorial field
export const createRecipe = async (recipeData) => {
  try {
    const recipes = (await getData(RECIPES_KEY)) || [];
    const newRecipe = {
      id: Date.now().toString(),
      ...recipeData,
      // Ensure the author is provided; if not, default to 'Unknown'
      author: recipeData.author || 'Unknown',
      // New field: youtubeTutorial – if not provided, set it to null
      youtubeTutorial: recipeData.youtubeTutorial || null,
      hidden: false, // default: visible
      dateCreated: new Date().toISOString(),
    };
    recipes.push(newRecipe);
    await storeData(RECIPES_KEY, recipes);
    return newRecipe;
  } catch (error) {
    console.error('Error creating recipe', error);
  }
};


// Get all recipes
export const getRecipes = async () => {
  try {
    const recipes = (await getData(RECIPES_KEY)) || [];
    return recipes;
  } catch (error) {
    console.error('Error getting recipes', error);
    return [];
  }
};

// Export more functions as needed...
