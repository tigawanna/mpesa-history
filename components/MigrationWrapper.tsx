import { useInitMigrations } from "@/db/client";
import { useThemeSetup } from "@/hooks/use-theme-setup";
import { Surface,Text, useTheme } from "react-native-paper";

interface MigrationWrapperProps {
children: React.ReactNode;
}

export function MigrationWrapper({children}:MigrationWrapperProps){
  const { success, error } = useInitMigrations();
  const paperTheme = useTheme()
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
return children
}
