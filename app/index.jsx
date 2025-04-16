import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderCenter from '../components/HeaderCenter';
import { getUserByEmail } from '../database/database';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    try {
      const user = await getUserByEmail(email);
      if (user && user.password === password) {
        // Save current user and navigate
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        router.push('/home');
      } else {
        Alert.alert('Error', 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Login error', error);
      Alert.alert('Error', 'An error occurred during login.');
    }
  };

  const handleSignUp = () => {
    router.push('/signup');
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
        {/* Login Card */}
        <View style={styles.loginCard}>
          <Text style={styles.loginTitle}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Sign-Up Card */}
        <View style={styles.signUpCard}>
          <View style={styles.signUpHeader}>
            <Image
              source={require('../assets/images/KusinaDelightsLogo.png')}
              style={styles.cardLogo}
              resizeMode="contain"
            />
            <Text style={styles.signUpTitle}>Join Kusina Delights</Text>
          </View>
          <Text style={styles.signUpText}>
            Don't have an account? 
            {'\n'}
            Sign up to discover new recipes and delights!
          </Text>
          <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Bottom Curved Container */}
      <View style={styles.bottomContainer} />

    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  // Full-screen background image
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Semi-transparent overlay on top of the background image
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
  // Login card styling
  loginCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    width: '80%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 14,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#F8D64E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // Sign-up card styling
  signUpCard: {
    backgroundColor: '#F8D64E',
    width: '80%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  signUpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardLogo: {
    width: 40,
    height: 40,
    marginRight: 8,
  },
  signUpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  signUpText: {
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 25,
    boxShadow: "0px 2px 4px rgba(0,0,0,0.4)",
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  // Bottom curved container styling
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
