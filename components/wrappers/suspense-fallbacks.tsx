import React from 'react';
import { StyleSheet,View } from 'react-native';
import { Avatar, List, Surface, useTheme } from 'react-native-paper';
import { useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";



export function HistoryListSuspenseFallback() {
const items = Array.from({ length: 10 }, (_, i) => i.toString());
  return (
    <Surface style={styles.container}>
      <View style={styles.listSection}>
        {items.map((id) => (
          <ShimmerItem key={id} />
        ))}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 1,
    paddingHorizontal: 16,
  },
  listSection: {
    paddingVertical: 8,
    gap: 4,
  },
  listItem: {
    paddingVertical: 8,
  },
});



/**
 * Shimmer effect component for loading states
 */
function ShimmerItem(): JSX.Element {
  const { colors } = useTheme();
  const translateY = useSharedValue(-100);

  const gradientColors = [colors.background, colors.surfaceVariant, colors.background] as const;

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(100, {
        duration: 3000,
        easing: Easing.bezier(0.25, 1, 0.25, 1),
      }),
      -1, // infinite repeat
      false // don't reverse
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={[shimmerStyles.shimmerItem, { backgroundColor: colors.surfaceDisabled }]}>
      {/* Avatar circle */}
      <View style={[shimmerStyles.shimmerAvatar, { backgroundColor: colors.surfaceVariant }]} />

      <View style={shimmerStyles.shimmerContent}>
        {/* Title line */}
        <View style={[shimmerStyles.shimmerTitle, { backgroundColor: colors.surfaceVariant }]} />

        {/* Subtitle line */}
        <View style={[shimmerStyles.shimmerSubtitle, { backgroundColor: colors.surfaceVariant }]} />
      </View>

      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }} // Changed to vertical direction
        />
      </Animated.View>
    </View>
  );
}

const shimmerStyles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 1,
    paddingHorizontal: 16,
  },
  listSection: {
    paddingVertical: 8,
    gap: 8,
  },
  shimmerItem: {
    height: 150,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  shimmerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  shimmerContent: {
    flex: 1,
    gap: 8,
  },
  shimmerTitle: {
    height: 16,
    borderRadius: 4,
    width: "70%",
  },
  shimmerSubtitle: {
    height: 14,
    borderRadius: 4,
    width: "50%",
  },
});
