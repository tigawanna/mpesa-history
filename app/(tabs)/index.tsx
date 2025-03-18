import { HistoryList } from "@/components/history/HistoryList";
import { Image, StyleSheet, Platform, View } from "react-native";

import { Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <HistoryList />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
