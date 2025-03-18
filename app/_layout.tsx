import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import merge from "deepmerge";
import { Colors } from "@/constants/Colors";
import { Provider as TinybaseProvider, useCreateMergeableStore } from "tinybase/ui-react";
import { useTinybaseStore } from "@/lib/tinybase/main-store";
import { useLegendTheme } from "@/lib/legend-state/settings-store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const customDefaultTheme = { ...MD3LightTheme, colors: Colors.light };
const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };

const { DarkTheme, LightTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(LightTheme, customDefaultTheme);
const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const store = useTinybaseStore();
  const themeStore = useLegendTheme();
  const colorScheme = themeStore.theme;

  const paperTheme = colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <TinybaseProvider store={store}>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider value={paperTheme as any}>
              <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false, }} />
                <Stack.Screen name="+not-found" />
              </Stack>
            </ThemeProvider>
          </PaperProvider>
        </TinybaseProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
