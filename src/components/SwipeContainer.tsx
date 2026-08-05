// components/SwipeContainer.tsx - Swipe Navigation Container
import React, { useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const SWIPE_VELOCITY = 0.5;

interface SwipeContainerProps {
  children: React.ReactNode;
  currentIndex: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  enabled?: boolean;
}

const SwipeContainer: React.FC<SwipeContainerProps> = ({
  children,
  currentIndex,
  onSwipeLeft,
  onSwipeRight,
  enabled = true,
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const isSwiping = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => enabled,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return (
          enabled &&
          Math.abs(gestureState.dx) > 10 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2
        );
      },
      onPanResponderGrant: () => {
        isSwiping.current = true;
        translateX.setOffset(0);
        translateX.setValue(0);
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isSwiping.current) return;
        
        // Add resistance to swipe
        const resistance = 0.5;
        translateX.setValue(gestureState.dx * resistance);
      },
      onPanResponderRelease: (_, gestureState) => {
        isSwiping.current = false;
        
        const { dx, vx } = gestureState;
        const shouldSwipe =
          Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(vx) > SWIPE_VELOCITY;

        if (shouldSwipe) {
          if (dx < 0 && onSwipeLeft) {
            // Swipe left - go to next screen
            Animated.timing(translateX, {
              toValue: -SCREEN_WIDTH,
              duration: 250,
              useNativeDriver: true,
            }).start(() => {
              translateX.setValue(0);
              onSwipeLeft();
            });
          } else if (dx > 0 && onSwipeRight) {
            // Swipe right - go to previous screen
            Animated.timing(translateX, {
              toValue: SCREEN_WIDTH,
              duration: 250,
              useNativeDriver: true,
            }).start(() => {
              translateX.setValue(0);
              onSwipeRight();
            });
          } else {
            // Reset position
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        } else {
          // Spring back to original position
          Animated.spring(translateX, {
            toValue: 0,
            tension: 100,
            friction: 10,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        isSwiping.current = false;
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Animated.View
        style={[
          styles.content,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {children}
      </Animated.View>
      
      {/* Swipe indicators */}
      {enabled && (
        <View style={styles.indicators}>
          <View style={[styles.dot, currentIndex === 0 && styles.activeDot]} />
          <View style={[styles.dot, currentIndex === 1 && styles.activeDot]} />
          <View style={[styles.dot, currentIndex === 2 && styles.activeDot]} />
          <View style={[styles.dot, currentIndex === 3 && styles.activeDot]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  indicators: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  activeDot: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
});

export default SwipeContainer;
