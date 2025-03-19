import { useLegendTheme } from "@/lib/legend-state/settings-store";
import { Colors } from "@/constants/Colors";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

import {
  adaptNavigationTheme,
  MD3DarkTheme,
  MD3LightTheme,
} from "react-native-paper";

import merge from "deepmerge";

  
  export function useThemeSetup() {
    const customDefaultTheme = { ...MD3LightTheme, colors: Colors.light };
    const customDarkTheme = { ...MD3DarkTheme, colors: Colors.dark };
    
    const { DarkTheme, LightTheme } = adaptNavigationTheme({
      reactNavigationLight: NavigationDefaultTheme,
      reactNavigationDark: NavigationDarkTheme,
    });
    
    const CombinedDefaultTheme = merge(LightTheme, customDefaultTheme);
    const CombinedDarkTheme = merge(DarkTheme, customDarkTheme);
  const themeStore = useLegendTheme();
  const colorScheme = themeStore.theme

  const paperTheme = colorScheme === "dark" ? CombinedDarkTheme : CombinedDefaultTheme;
  return {paperTheme, colorScheme};
  }
