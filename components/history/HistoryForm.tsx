import { View, Text, StyleSheet } from "react-native";
import { useLiveQuery, drizzle } from "drizzle-orm/expo-sqlite";
export default function HistoryForm() {
  return (
    <View style={styles.container}>
      <Text> HistoryForm </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
