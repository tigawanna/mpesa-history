import { useLegendTheme } from "@/lib/legend-state/settings-store";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";

export default function TabTwoScreen() {
  // const { setTheme, theme } = useContext(ThemeContext);
  const { setTheme, theme } = useLegendTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 8 }}>
      <Button mode="outlined" onPress={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme {theme}
      </Button>
      <Button icon="camera" mode="contained" onPress={() => console.log("Pressed")}>
        Press me
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
