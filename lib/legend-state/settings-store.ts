import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { useColorScheme } from "react-native";

type SettingsStroreType = {
  theme: "dark" | "light" | null;
  localBackupPath: string | null;
  lastBackup: Date | null;
};

// Observables can be primitives or deep objects
export const settings$ = observable<SettingsStroreType>({
  theme: null,
  localBackupPath: null,
  lastBackup: null,
});

export function useLegendSettings() {
  const settings = use$(() => settings$.get());
  const updateSettings = (value: Partial<SettingsStroreType>) => {
    settings$.set({ ...settings, ...value });
  }
  return { settings, updateSettings };
}

export function useLegendTheme() {
  const colorScheme = useColorScheme();
  const theme = use$(() => settings$.theme.get()) ?? colorScheme;
  const setTheme = (value: SettingsStroreType["theme"]) => {
    settings$.theme.set(value);
  };
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  const isDarkMode = theme === "dark";
  return { theme, setTheme, toggleTheme, isDarkMode };
}
