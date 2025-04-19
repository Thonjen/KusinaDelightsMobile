import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUser, getUsers } from '../database/database';
import HeaderCenter from '../components/HeaderCenter';

const Signup = () => {
  const [username, setUsername]             = useState('');
  const [email, setEmail]                   = useState('');
  const [password, setPassword]             = useState('');
  const [duplicateEmailWarning, setDuplicateEmailWarning] = useState('');
  const [duplicateUsernameWarning, setDuplicateUsernameWarning] = useState('');
  const router = useRouter();
  const MAX_USERNAME = 10;

  // Warning for max username characters (always shows if reached max)
  const maxUsernameWarning =
    username.length === MAX_USERNAME
      ? "Username cannot exceed 10 characters."
      : '';

  const handleSignup = async () => {
    // Clear previous duplicate warnings
    setDuplicateEmailWarning('');
    setDuplicateUsernameWarning('');

    if (!username || !email || !password) {
      // Empty fields
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    
    try {
      const users = await getUsers();
      // Check if email already exists (case insensitive)
      const emailTaken = users.some(
        (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
      );
      if (emailTaken) {
        setDuplicateEmailWarning('Email has already been taken, try another.');
      }
      // Check if username already exists (case insensitive)
      const usernameTaken = users.some(
        (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
      );
      if (usernameTaken) {
        setDuplicateUsernameWarning('Username has already been taken, try another.');
      }

      // If either duplicate warning is set, do not proceed with signup
      if (emailTaken || usernameTaken) {
        return;
      }

      // Create user if no duplicates found
      const newUser = await createUser(username, email, password);
      await AsyncStorage.setItem('currentUser', JSON.stringify(newUser));
      router.push('/home');
    } catch (error) {
      console.error('Signup error', error);
      Alert.alert('Error', 'An error occurred during sign up.');
    }
  };

  const handleLogin = () => {
    router.push('/');
  };

  return (
    <ImageBackground
      source={require('../assets/images/Banner.jpg')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* Background Overlay */}
      <View style={styles.overlay} />

      {/* Header */}
      <HeaderCenter headerTitle="Kusina Delights" />

      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Sign Up Form Card */}
        <View style={styles.signUpFormCard}>
          <Text style={styles.cardTitle}>Sign Up</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              // Clear duplicate warning if the user is retyping
              setDuplicateUsernameWarning('');
            }}
            maxLength={MAX_USERNAME}
          />
          {/* Show max characters warning if reached and no duplicate warning */}
          {maxUsernameWarning && !duplicateUsernameWarning ? (
            <Text style={styles.warningText}>{maxUsernameWarning}</Text>
          ) : null}
          {duplicateUsernameWarning ? (
            <Text style={styles.warningText}>{duplicateUsernameWarning}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setDuplicateEmailWarning('');
            }}
            autoCapitalize="none"
          />
          {duplicateEmailWarning ? (
            <Text style={styles.warningText}>{duplicateEmailWarning}</Text>
          ) : null}
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.primaryButton} onPress={handleSignup}>
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>

        {/* Login Prompt Card */}
        <View style={styles.loginPromptCard}>
          <View style={styles.promptHeader}>
            <Image
              source={require('../assets/images/KusinaDelightsLogo.png')}
              style={styles.promptLogo}
              resizeMode="contain"
            />
            <Text style={styles.promptTitle}>Already Have an Account?</Text>
          </View>
          <Text style={styles.promptText}>
            Login to find new Opportunities{'\n'}and Discover new Delights
          </Text>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleLogin}>
            <Text style={styles.secondaryButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Curved Container */}
      <View style={styles.bottomContainer} />
    </ImageBackground>
  );
};

export default Signup;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  // Sign Up Form Card
  signUpFormCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '80%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
    color: '#333',
  },
  warningText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#F8D64E',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // Login Prompt Card
  loginPromptCard: {
    backgroundColor: '#F8D64E',
    width: '80%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  promptLogo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  promptTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  promptText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  // Bottom curved container styling (placed at the bottom)
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#F8D64E',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
});
