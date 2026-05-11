import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS } from '../theme';

const { width } = Dimensions.get('window');

// Pre-compute petal positions so they don't change on re-render
const PETALS = Array.from({ length: 12 }, () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() * 14 + 6,
  rotation: `${Math.random() * 360}deg`,
}));

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  // useRef so these survive re-renders — this was the bug
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const textSlide = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // 1. Logo entrance — fade + scale + bounce
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(textSlide, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Gentle floating loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 3. Progress bar
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2.5;
      });
    }, 35);

    // 4. Finish after 3.5 seconds
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative saffron petals */}
      {PETALS.map((petal, i) => (
        <Animated.View
          key={i}
          style={[
            styles.petal,
            {
              left: petal.left,
              top: petal.top,
              width: petal.size,
              height: petal.size,
              opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.25],
              }),
              transform: [{ rotate: petal.rotation }],
            },
          ]}
        />
      ))}

      {/* Logo with glow */}
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: floatAnim },
            ],
          },
        ]}
      >
        <View style={styles.logoGlow} />
        <Image
          source={require('../../assets/logo.jpg')}
          style={styles.logo}
          resizeMode="cover"
        />
      </Animated.View>

      {/* App name */}
      <Animated.Text
        style={[
          styles.appName,
          {
            opacity: fadeAnim,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        Mkisans
      </Animated.Text>

      {/* Progress bar */}
      <Animated.View style={[styles.progressContainer, { opacity: fadeAnim }]}>
        <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} />
      </Animated.View>

      {/* Cultural text */}
      <Animated.View
        style={[
          styles.textGroup,
          {
            opacity: fadeAnim,
            transform: [{ translateY: textSlide }],
          },
        ]}
      >
        <Text style={styles.badge}>Jai Jawan • Jai Kisan</Text>
        <Text style={styles.loadingText}>Honoring the Anndevta...</Text>
        <Text style={styles.tagline}>भारत के किसानों का अपना डिजिटल प्लेटफॉर्म</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  petal: {
    position: 'absolute',
    backgroundColor: COLORS.saffron,
    borderTopLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  logoWrapper: {
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255, 153, 51, 0.12)',
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  appName: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.indiaGreen,
    letterSpacing: 2,
    marginBottom: 32,
  },
  progressContainer: {
    width: width * 0.55,
    height: 6,
    backgroundColor: 'rgba(19, 136, 8, 0.08)',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(19, 136, 8, 0.1)',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
    backgroundColor: COLORS.indiaGreen,
  },
  textGroup: {
    alignItems: 'center',
    marginTop: 28,
  },
  badge: {
    backgroundColor: 'rgba(19, 136, 8, 0.1)',
    color: COLORS.indiaGreen,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    borderWidth: 1,
    borderColor: 'rgba(19, 136, 8, 0.2)',
    marginBottom: 8,
    overflow: 'hidden',
  },
  loadingText: {
    fontSize: 20,
    color: COLORS.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});

export default SplashScreen;
