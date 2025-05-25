// database/database.js

import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncOneToFirebase } from '../contexts/syncToFirebase';

// Keys for AsyncStorage
const USERS_KEY     = 'KusinaDelights_USERS';
const PROFILES_KEY  = 'KusinaDelights_USER_PROFILES';
const RECIPES_KEY   = 'KusinaDelights_RECIPES';
const REVIEWS_KEY   = 'KusinaDelights_REVIEWS';
const CHEFS_KEY     = 'KusinaDelights_CHEFS';
const FAVORITES_KEY = 'KusinaDelights_FAVORITES';

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
    lastUpdated: now,
  };
  users.push(newUser);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  await syncOneToFirebase('users', newUser, 'set');
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
  const now   = new Date().toISOString();
  const out   = users.map(u =>
    u.id === updatedUser.id
      ? { ...u, ...updatedUser, lastUpdated: now }
      : u
  );
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(out));
  await syncOneToFirebase('users', { ...updatedUser, lastUpdated: now }, 'set');
  return out;
}

export async function removeUser(userID) {
  // Remove user
  const users    = await getData(USERS_KEY);
  const filtered = users.filter(u => u.id !== userID);
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  await syncOneToFirebase('users', { id: userID }, 'delete');

  // Also remove their profile
  const profiles      = await getData(PROFILES_KEY);
  const filteredProf  = profiles.filter(p => p.userID !== userID);
  const removedProf   = profiles.filter(p => p.userID === userID);
  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(filteredProf));
  for (const p of removedProf) {
    await syncOneToFirebase('profiles', { id: p.userID }, 'delete');
  }

  return filtered;
}

/** USER PROFILES **/
export async function createUserProfile(userID, profileImage, introduction) {
  const profiles = await getData(PROFILES_KEY);
  const now      = new Date().toISOString();
  const record   = {
    id:          userID,
    userID,
    profileImage,
    introduction,
    lastUpdated: now,
  };
  const idx = profiles.findIndex(p => p.userID === userID);
  if (idx >= 0) profiles[idx] = record;
  else profiles.push(record);

  await AsyncStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  await syncOneToFirebase('profiles', record, 'set');
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
    id:              now,
    ...recipeData,
    author:          recipeData.author || 'Unknown',
    youtubeTutorial: recipeData.youtubeTutorial || null,
    hidden:          false,
    dateCreated:     now,
    lastUpdated:     now,
  };
  recipes.push(newRecipe);
  await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  await syncOneToFirebase('recipes', newRecipe, 'set');
  return newRecipe;
}

export async function updateRecipe(updatedRecipe) {
  const recipes = await getData(RECIPES_KEY);
  const now     = new Date().toISOString();
  const out     = recipes.map(r =>
    r.id === updatedRecipe.id
      ? { ...updatedRecipe, lastUpdated: now }
      : r
  );
  await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(out));
  await syncOneToFirebase('recipes', { ...updatedRecipe, lastUpdated: now }, 'set');
  return out;
}

export async function removeRecipe(recipeId) {
  const recipes  = await getData(RECIPES_KEY);
  const filtered = recipes.filter(r => r.id !== recipeId);
  await AsyncStorage.setItem(RECIPES_KEY, JSON.stringify(filtered));
  await syncOneToFirebase('recipes', { id: recipeId }, 'delete');
  return filtered;
}

/** REVIEWS **/
export async function getReviews() {
  return await getData(REVIEWS_KEY);
}

export async function createReview(reviewData) {
  const reviews = await getData(REVIEWS_KEY);
  const now     = new Date().toISOString();
  const newReview = {
    id:          now,
    ...reviewData,
    dateCreated: now,
    lastUpdated: now,
  };
  reviews.push(newReview);
  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  await syncOneToFirebase('reviews', newReview, 'set');
  return newReview;
}

export async function removeReview(reviewId) {
  const reviews  = await getData(REVIEWS_KEY);
  const filtered = reviews.filter(r => r.id !== reviewId);
  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(filtered));
  await syncOneToFirebase('reviews', { id: reviewId }, 'delete');
  return filtered;
}

export async function updateReview(updatedReview) {
  const reviews = await getData(REVIEWS_KEY);
  const now     = new Date().toISOString();
  const out     = reviews.map(r =>
    r.id === updatedReview.id
      ? { ...r, rating: updatedReview.rating, comment: updatedReview.comment, lastUpdated: now }
      : r
  );
  await AsyncStorage.setItem(REVIEWS_KEY, JSON.stringify(out));
  await syncOneToFirebase('reviews', { ...updatedReview, lastUpdated: now }, 'set');
  return out;
}

/** CHEFS **/
export async function getChefs() {
  return await getData(CHEFS_KEY);
}

export async function createChef(chefData) {
  const chefs = await getData(CHEFS_KEY);
  const now   = new Date().toISOString();
  const newChef = { id: now, ...chefData, dateCreated: now, lastUpdated: now };
  chefs.push(newChef);
  await AsyncStorage.setItem(CHEFS_KEY, JSON.stringify(chefs));
  await syncOneToFirebase('chefs', newChef, 'set');
  return newChef;
}

export async function removeChef(chefId) {
  const chefs    = await getData(CHEFS_KEY);
  const filtered = chefs.filter(c => c.id !== chefId);
  await AsyncStorage.setItem(CHEFS_KEY, JSON.stringify(filtered));
  await syncOneToFirebase('chefs', { id: chefId }, 'delete');
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
    const now    = new Date().toISOString();
    const newFav = { id: `${userId}_${recipeId}`, userId, recipeId, lastUpdated: now };
    all.push(newFav);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(all));
    await syncOneToFirebase('favorites', newFav, 'set');
  }
  return all;
}

export async function removeFavorite(userId, recipeId) {
  let all      = await getFavorites();
  const toDrop = `${userId}_${recipeId}`;
  all          = all.filter(f => f.id !== toDrop);
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(all));
  await syncOneToFirebase('favorites', { id: toDrop }, 'delete');
  return all;
}
