import { useQuote } from "@/hooks/use-quote";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const { width } = Dimensions.get("window");

export default function Index() {
  const { loading, quote, getQuote } = useQuote();

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  // Reset animation state when loading starts
  useEffect(() => {
    if (loading) {
      translateX.value = 0;
      opacity.value = 1;
    }
  }, [loading]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow swiping to the left, if it would be greater then 0, it would go to right 
      if (event.translationX < 0) {
        translateX.value = event.translationX;
        // Adding fading out effect ( copied the formula )
        opacity.value = 1 - Math.abs(event.translationX) / (width / 2);
      }
    })
    .onEnd(() => {
      if (translateX.value < -100) {
        // Swiped enough to trigger new quote
        translateX.value = withTiming(-width, {}, () => {
            // Reset position instantly after animation
            scheduleOnRN(getQuote);
        });
      } else {
        // Didn't swipe enough, spring back
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#0a7eb8ff", "#3a1477ff"]}
        style={styles.container}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ffffff" />
          </View>
        ) : (
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.quoteContainer, animatedStyle]}>
              <Text style={styles.quote}>"{quote?.quote}"</Text>
              <Text style={styles.author}>
                {quote?.author && `- ${quote.author}`}
              </Text>
              <Text style={styles.hint}>Swipe left for new quote</Text>
            </Animated.View>
          </GestureDetector>
        )}
      </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 30,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  quote: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 20,
    lineHeight: 32,
  },
  author: {
    fontStyle: "italic",
    textAlign: "center",
    color: "#e0e0e0",
    fontSize: 18,
    marginBottom: 30,
  },
  hint: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 12,
    marginTop: 10,
  },
});
