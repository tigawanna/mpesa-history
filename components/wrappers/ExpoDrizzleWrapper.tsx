import { DATABASE_NAME, useInitMigrations } from "@/db/client";
import { ActivityIndicator, Surface, Text, useTheme } from "react-native-paper";
import { SQLiteProvider } from "expo-sqlite";
import { Suspense } from "react";

interface ExpoDrizzleWrapperProps {
  children: React.ReactNode;
}

export function ExpoDrizzleWrapper({ children }: ExpoDrizzleWrapperProps) {
  const { success, error } = useInitMigrations();
  const paperTheme = useTheme();
  
  if (error) {
    return (
      <Surface style={{ padding: 16 }}>
        <Text variant="headlineSmall" style={{ color: paperTheme.colors.error }}>
          Migration error: {error.message}
        </Text>
      </Surface>
    );
  }
  if (!success) {
    return (
      <Surface style={{ padding: 16 }}>
        <Text variant="bodyLarge" style={{ color: paperTheme.colors.onSurface }}>
          Migration is in progress...
        </Text>
      </Surface>
    );
  }
  return (
    <Suspense fallback={<ActivityIndicator size={"large"} />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        useSuspense
        options={{ enableChangeListener: true }}>
        {children}
      </SQLiteProvider>
    </Suspense>
  );
}
