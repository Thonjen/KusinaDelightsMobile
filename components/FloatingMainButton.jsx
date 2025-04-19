// components/FloatingMainButton.jsx

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
import TimerModal from './TimerModal';
import TimerAlert from './alerts/TimerAlert';

const FloatingMainButton = ({ timerEnabled = true, mainButtonContent }) => {
  const { width, height } = Dimensions.get('window');
  const pan = useRef(
    new Animated.ValueXY({ x: width - 80, y: height - 160 })
  ).current;

  const [expanded, setExpanded] = useState(false);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [timerAlertVisible, setTimerAlertVisible] = useState(false);
  const timerRef = useRef(null);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 10 || Math.abs(g.dy) > 10,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, g) => {
        pan.setValue({ x: g.dx, y: g.dy });
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  const toggleExpand = () => setExpanded((v) => !v);

  const startTimer = (totalSeconds) => {
    setRemainingTime(totalSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimerAlertVisible(true);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => () => timerRef.current && clearInterval(timerRef.current), []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const mainContent =
    remainingTime !== null
      ? <Text style={styles.timerText}>{formatTime(remainingTime)}</Text>
      : mainButtonContent || <Ionicons name="apps-outline" size={28} color="#fff" />;

  return (
    <>
      <TimerModal
        visible={timerModalVisible}
        onClose={() => setTimerModalVisible(false)}
        onStart={startTimer}
      />
      <TimerAlert
        visible={timerAlertVisible}
        onClose={() => setTimerAlertVisible(false)}
      />

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
};

export default FloatingMainButton;

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: 'absolute', zIndex: 1000,
  },
  buttonWrapper: { position: 'relative', alignItems: 'center' },
  mainButton: {
    backgroundColor: '#F8D64E',
    width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    elevation: 5,
  },
  timerText: { color: '#fff', fontWeight: 'bold' },
  expandedButtonsContainer: {
    position: 'absolute', top: -70, alignItems: 'center',
  },
  expandedButton: {
    backgroundColor: '#FFA500',
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 10, elevation: 5,
  },
});
