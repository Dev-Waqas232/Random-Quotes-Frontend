import { useQuote } from "@/hooks/use-quote";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const { loading, quote } = useQuote();

  return (
    <View style={styles.container}>
      <Text style={styles.quote}>{quote?.quote}</Text>
      <Text style={styles.author}>{quote?.author && `~ ${quote.author}`}</Text>
    </View>
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
  },
});
