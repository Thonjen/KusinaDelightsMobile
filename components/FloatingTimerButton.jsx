// components/FloatingTimerButton.jsx

import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import TimerModal from './TimerModal';
import TimerAlert from './alerts/TimerAlert';

export default function FloatingTimerButton({
  timerEnabled = true,
  mainButtonContent,
}) {
  const { width, height } = Dimensions.get('window');
  const pan = useRef(new Animated.ValueXY({ x: width - 80, y: height - 160 })).current;
  const [expanded, setExpanded] = useState(false);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerAlertVisible, setTimerAlertVisible] = useState(false);
  const timerRef = useRef(null);
  const soundRef = useRef(null);

  // PanResponder for drag
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => pan.flattenOffset(),
    })
  ).current;

  const toggleExpand = () => setExpanded((v) => !v);

  // Play the selected end-of-timer sound
  const playEndSound = async () => {
    const key = (await AsyncStorage.getItem('timerSound')) || 'Bell';
    const mapping = { Bell: require('../assets/sfx/Bell.mp3') };
    try {
      const { sound } = await Audio.Sound.createAsync(mapping[key]);
      soundRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.error('Error playing end sound', e);
    }
  };

  // Kick off the countdown
  const startTimer = (totalSeconds) => {
    setRemainingTime(totalSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerAlertVisible(true);
          playEndSound();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (soundRef.current) {
        soundRef.current.stopAsync().catch(() => {});
        soundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // Format mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Close the alert and stop the sound
  const handleAlertClose = async () => {
    setTimerAlertVisible(false);
    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch (e) {
        console.warn('Error stopping sound', e);
      }
      soundRef.current = null;
    }
  };

  // What shows in the main button
  const mainContent =
    remainingTime != null ? (
      <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
    ) : (
      mainButtonContent || <Ionicons name="apps-outline" size={28} color="#fff" />
    );

  return (
    <>
      <TimerModal
        visible={timerModalVisible}
        onClose={() => setTimerModalVisible(false)}
        onStart={startTimer}
      />
      <TimerAlert visible={timerAlertVisible} onClose={handleAlertClose} />

      <Animated.View
        style={[styles.floatingButtonContainer, pan.getLayout()]}
        {...panResponder.panHandlers}
      >
        <View style={styles.buttonWrapper}>
          <TouchableOpacity onPress={toggleExpand} style={styles.mainButton}>
            {mainContent}
          </TouchableOpacity>
          {expanded && timerEnabled && (
            <View style={styles.expandedButtonsContainer}>
              <TouchableOpacity
                onPress={() => {
                  setTimerModalVisible(true);
                  setExpanded(false);
                }}
                style={styles.expandedButton}
              >
                <Ionicons name="alarm" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: { position: 'absolute', zIndex: 1000 },
  buttonWrapper: { alignItems: 'center' },
  mainButton: {
    backgroundColor: '#F8D64E',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  timerText: { color: '#fff', fontWeight: 'bold' },
  expandedButtonsContainer: {
    position: 'absolute',
    top: -70,
    alignItems: 'center',
  },
  expandedButton: {
    backgroundColor: '#FFA500',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    elevation: 5,
  },
});
