import { useQuote } from "@/hooks/use-quote";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export default function Index() {
  const { loading, quote, getQuote } = useQuote();

  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = Math.min(event.translationY, 100); // restricting the swipe down to 100px only
      }
    })
    .onEnd(() => {
      if (translateY.value > 50) {
        translateY.value = withSpring(0);
        scheduleOnRN(getQuote); // Our gesture callback runs on reanimated worklet thread and we can't run normal JS function from there

        // getQuote() => It would crash the app because we are on reanimated thread while the gesture function is running so we have to schedule it to run on react native thread
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {loading ? (
          <View>
            <ActivityIndicator size="large" color="#231c1cff" />
          </View>
        ) : (
          <GestureDetector gesture={panGesture}>
            <Animated.View style={animatedStyle}>
              <Text style={styles.quote}>{quote?.quote}</Text>
              <Text style={styles.author}>
                {quote?.author && `~ ${quote.author}`}
              </Text>
            </Animated.View>
          </GestureDetector>
        )}
      </View>
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
  quote: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 20,
  },
  author: {
    fontStyle: "italic",
    textAlign: "center",
  },
});
