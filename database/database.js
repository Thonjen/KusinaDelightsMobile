// database/database.js

import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for AsyncStorage
const USERS_KEY      = 'KusinaDelights_USERS';
const PROFILES_KEY   = 'KusinaDelights_USER_PROFILES';
const RECIPES_KEY    = 'KusinaDelights_RECIPES';
const REVIEWS_KEY    = 'KusinaDelights_REVIEWS';
const CHEFS_KEY      = 'KusinaDelights_CHEFS';
const FAVORITES_KEY  = 'KusinaDelights_FAVORITES';  // ← NEW

/** Helper: save data under a given key **/
async function storeData(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving data for ${key}`, e);
  }
}

/** Helper: get data array (defaults to empty array) **/
async function getData(key) {
  try {
    const json = await AsyncStorage.getItem(key);
    return json != null ? JSON.parse(json) : [];
  } catch (e) {
    console.error(`Error reading data for ${key}`, e);
    return [];
  }
}

/** USERS **/
export async function createUser(username, email, password) {
  const users = await getData(USERS_KEY);
  const now   = new Date().toISOString();
  const newUser = {
    id: now,
    username,
    email,
    password,
    role: 'user',
    dateJoined: now,
  };
  users.push(newUser);
  await storeData(USERS_KEY, users);
  return newUser;
}

export async function getUsers() {
  return await getData(USERS_KEY);
}

export async function getUserByEmail(email) {
  const users = await getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export async function updateUser(updatedUser) {
  const users = await getData(USERS_KEY);
  const out   = users.map(u =>
    u.id === updatedUser.id ? { ...u, ...updatedUser } : u
  );
  await storeData(USERS_KEY, out);
  return out;
}

export async function removeUser(userID) {
  const users    = await getData(USERS_KEY);
  const filtered = users.filter(u => u.id !== userID);
  await storeData(USERS_KEY, filtered);

  const profiles = await getData(PROFILES_KEY);
  await storeData(PROFILES_KEY, profiles.filter(p => p.userID !== userID));

  return filtered;
}

/** USER PROFILES **/
export async function createUserProfile(userID, profileImage, introduction) {
  const profiles = await getData(PROFILES_KEY);
  const idx      = profiles.findIndex(p => p.userID === userID);
  const record   = { userID, profileImage, introduction };
  if (idx >= 0) profiles[idx] = record;
  else profiles.push(record);
  await storeData(PROFILES_KEY, profiles);
  return record;
}

export async function getUserProfile(userID) {
  const profiles = await getData(PROFILES_KEY);
  return profiles.find(p => p.userID === userID) || null;
}

/** RECIPES **/
export async function getRecipes() {
  return await getData(RECIPES_KEY);
}

export async function createRecipe(recipeData) {
  const recipes = await getData(RECIPES_KEY);
  const now     = new Date().toISOString();
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
}

export async function updateRecipe(updatedRecipe) {
  const recipes = await getData(RECIPES_KEY);
  const out     = recipes.map(r =>
    r.id === updatedRecipe.id ? updatedRecipe : r
  );
  await storeData(RECIPES_KEY, out);
  return out;
}

export async function removeRecipe(recipeId) {
  const recipes = await getData(RECIPES_KEY);
  const filtered = recipes.filter(r => r.id !== recipeId);
  await storeData(RECIPES_KEY, filtered);
  return filtered;
}

/** REVIEWS **/
export async function getReviews() {
  return await getData(REVIEWS_KEY);
}

export async function createReview(reviewData) {
  const reviews = await getData(REVIEWS_KEY);
  const now     = new Date().toISOString();
  const newReview = { id: now, ...reviewData, dateCreated: now };
  reviews.push(newReview);
  await storeData(REVIEWS_KEY, reviews);
  return newReview;
}

export async function removeReview(reviewId) {
  const reviews  = await getData(REVIEWS_KEY);
  const filtered = reviews.filter(r => r.id !== reviewId);
  await storeData(REVIEWS_KEY, filtered);
  return filtered;
}

export async function updateReview(updatedReview) {
  const reviews = await getData(REVIEWS_KEY);
  const out     = reviews.map(r =>
    r.id === updatedReview.id
      ? { ...r, rating: updatedReview.rating, comment: updatedReview.comment }
      : r
  );
  await storeData(REVIEWS_KEY, out);
  return out;
}

/** CHEFS **/
export async function getChefs() {
  return await getData(CHEFS_KEY);
}

export async function createChef(chefData) {
  const chefs = await getData(CHEFS_KEY);
  const now   = new Date().toISOString();
  const newChef = { id: now, ...chefData, dateCreated: now };
  chefs.push(newChef);
  await storeData(CHEFS_KEY, chefs);
  return newChef;
}

export async function removeChef(chefId) {
  const chefs    = await getData(CHEFS_KEY);
  const filtered = chefs.filter(c => c.id !== chefId);
  await storeData(CHEFS_KEY, filtered);
  return filtered;
}

/** FAVORITES **/
export async function getFavorites() {
  return await getData(FAVORITES_KEY);
}

export async function getFavoritesByUser(userId) {
  const all = await getFavorites();
  return all.filter(f => f.userId === userId);
}

export async function addFavorite(userId, recipeId) {
  const all = await getFavorites();
  if (!all.find(f => f.userId === userId && f.recipeId === recipeId)) {
    all.push({ userId, recipeId });
    await storeData(FAVORITES_KEY, all);
  }
  return all;
}

export async function removeFavorite(userId, recipeId) {
  let all = await getFavorites();
  all = all.filter(f => !(f.userId === userId && f.recipeId === recipeId));
  await storeData(FAVORITES_KEY, all);
  return all;
}
