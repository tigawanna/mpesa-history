import React from "react";

import { Button, Text, Surface } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export function HistoryItemNotFound() {
  const navigation = useNavigation();

  const handleImportPress = () => {
    navigation.navigate("Import" as never);
  };

  return (
    <Surface style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 8, textAlign: "center" }}>
        No Transaction History
      </Text>

      <Text variant="bodyLarge" style={{ marginBottom: 24, textAlign: "center" }}>
        Start by importing your M-Pesa transaction history from a CSV or JSON file
      </Text>

      <Button mode="contained" onPress={handleImportPress} icon="file-import">
        Import History
      </Button>
    </Surface>
  );
}
