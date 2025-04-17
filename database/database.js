// database/database.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const USERS_KEY = 'KusinaDelights_USERS';
const USER_PROFILES_KEY = 'KusinaDelights_USER_PROFILES';
const RECIPES_KEY = 'KusinaDelights_RECIPES';
const REVIEWS_KEY = 'KusinaDelights_REVIEWS';
const CHEFS_KEY = 'KusinaDelights_CHEFS';

// Helper: save data
const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving data for ${key}`, e);
  }
};

// Helper: get data (defaults to empty array)
const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error(`Error reading data for ${key}`, e);
    return [];
  }
};

/** USERS **/

// Create a new user with dateJoined timestamp
export const createUser = async (username, email, password) => {
  const users = await getData(USERS_KEY);
  const now = new Date().toISOString();
  const newUser = {
    id: now,            // use timestamp as unique ID
    username,
    email,
    password,
    role: 'user',
    dateJoined: now,    // when they signed up
  };
  users.push(newUser);
  await storeData(USERS_KEY, users);
  return newUser;
};

// Get all users
export const getUsers = async () => {
  return await getData(USERS_KEY);
};

// Find one user by email
export const getUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

// Update an existing user (preserves dateJoined)
export const updateUser = async (updatedUser) => {
  const users = await getData(USERS_KEY);
  const out = users.map((u) =>
    u.id === updatedUser.id ? { ...u, ...updatedUser } : u
  );
  await storeData(USERS_KEY, out);
  return out;
};

// Remove a user entirely
export const removeUser = async (userID) => {
  // remove from users
  const users = await getData(USERS_KEY);
  const filtered = users.filter((u) => u.id !== userID);
  await storeData(USERS_KEY, filtered);
  // also remove any profile
  const profiles = await getData(USER_PROFILES_KEY);
  await storeData(
    USER_PROFILES_KEY,
    profiles.filter((p) => p.userID !== userID)
  );
  return filtered;
};

/** USER PROFILES **/

// Create or update a user's profile (image + intro)
export const createUserProfile = async (userID, profileImage, introduction) => {
  const profiles = await getData(USER_PROFILES_KEY);
  const idx = profiles.findIndex((p) => p.userID === userID);
  const record = { userID, profileImage, introduction };
  if (idx >= 0) profiles[idx] = record;
  else profiles.push(record);
  await storeData(USER_PROFILES_KEY, profiles);
  return record;
};

// Get one user’s profile
export const getUserProfile = async (userID) => {
  const profiles = await getData(USER_PROFILES_KEY);
  return profiles.find((p) => p.userID === userID) || null;
};

/** RECIPES **/

// Get all recipes
export const getRecipes = async () => {
  return await getData(RECIPES_KEY);
};

// Create a new recipe with dateCreated timestamp
export const createRecipe = async (recipeData) => {
  const recipes = await getData(RECIPES_KEY);
  const now = new Date().toISOString();
  const newRecipe = {
    id: now,
    ...recipeData,
    author: recipeData.author || 'Unknown',
    youtubeTutorial: recipeData.youtubeTutorial || null,
    hidden: false,
    dateCreated: now,
  };
  recipes.push(newRecipe);
  await storeData(RECIPES_KEY, recipes);
  return newRecipe;
};

// Update a recipe
export const updateRecipe = async (updatedRecipe) => {
  const recipes = await getData(RECIPES_KEY);
  const out = recipes.map((r) =>
    r.id === updatedRecipe.id ? updatedRecipe : r
  );
  await storeData(RECIPES_KEY, out);
  return out;
};

// Remove a recipe
export const removeRecipe = async (recipeId) => {
  const recipes = await getData(RECIPES_KEY);
  const filtered = recipes.filter((r) => r.id !== recipeId);
  await storeData(RECIPES_KEY, filtered);
  return filtered;
};

/** REVIEWS **/

// Get all reviews
export const getReviews = async () => {
  return await getData(REVIEWS_KEY);
};

// Create a review
export const createReview = async (reviewData) => {
  const reviews = await getData(REVIEWS_KEY);
  const now = new Date().toISOString();
  const newReview = { id: now, ...reviewData, dateCreated: now };
  reviews.push(newReview);
  await storeData(REVIEWS_KEY, reviews);
  return newReview;
};

// Remove a review
export const removeReview = async (reviewId) => {
  const reviews = await getData(REVIEWS_KEY);
  const filtered = reviews.filter((r) => r.id !== reviewId);
  await storeData(REVIEWS_KEY, filtered);
  return filtered;
};

/** CHEFS **/

// Get all chefs
export const getChefs = async () => {
  return await getData(CHEFS_KEY);
};

// Create a chef
export const createChef = async (chefData) => {
  const chefs = await getData(CHEFS_KEY);
  const now = new Date().toISOString();
  const newChef = { id: now, ...chefData, dateCreated: now };
  chefs.push(newChef);
  await storeData(CHEFS_KEY, chefs);
  return newChef;
};

// Remove a chef
export const removeChef = async (chefId) => {
  const chefs = await getData(CHEFS_KEY);
  const filtered = chefs.filter((c) => c.id !== chefId);
  await storeData(CHEFS_KEY, filtered);
  return filtered;
};
