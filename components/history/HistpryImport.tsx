import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, Dialog, Portal, ActivityIndicator, useTheme } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { useHistoryMutations } from "../../lib/legend-state/history-store";

type ImportResult = {
  success: boolean;
  message: string;
} | null;

export function HistoryImport({ onClose }: { onClose?: () => void }) {
  const [importVisible, setImportVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult>(null);
  const { importFromCSV, importFromJSON } = useHistoryMutations();
  const { colors } = useTheme();

  const showImportDialog = () => setImportVisible(true);
  const hideImportDialog = () => setImportVisible(false);

  const handlePickCSV = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const file = result.assets[0];
      const fileContent = await fetch(file.uri).then((response) => response.text());
      const entriesAdded = importFromCSV(fileContent);

      setResult({
        success: true,
        message: `Successfully imported ${entriesAdded} entries from CSV`,
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to import CSV",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePickJSON = async () => {
    try {
      setLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const file = result.assets[0];
      const fileContent = await fetch(file.uri).then((response) => response.text());
      const entriesAdded = importFromJSON(fileContent);

      setResult({
        success: true,
        message: `Successfully imported ${entriesAdded} entries from JSON`,
      });
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to import JSON",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismissResult = () => {
    setResult(null);
    hideImportDialog();
    if (onClose) onClose();
  };

  return (
    <>
      <Button 
        mode="outlined" 
        onPress={showImportDialog} 
        icon="file-import"
      >
        Import
      </Button>

      <Portal>
        {/* Import Options Dialog */}
        <Dialog visible={importVisible && !result} onDismiss={hideImportDialog}>
          <Dialog.Title>Import M-Pesa History</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              Choose a file format to import your M-Pesa transaction history
            </Text>

            {loading ? (
              <View style={{ alignItems: "center", padding: 16 }}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 12 }}>Processing file...</Text>
              </View>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideImportDialog}>Cancel</Button>
            <Button onPress={handlePickCSV} disabled={loading} icon="file-delimited">
              CSV
            </Button>
            <Button onPress={handlePickJSON} disabled={loading} icon="code-json">
              JSON
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Result Dialog */}
        <Dialog visible={!!result} onDismiss={handleDismissResult}>
          <Dialog.Title>
            {result?.success ? "Import Successful" : "Import Failed"}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{result?.message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDismissResult}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

// This component is specifically for when there's no data
export function HistoryImportEmptyState() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 8, textAlign: "center" }}>
        No Transaction History
      </Text>

      <Text variant="bodyLarge" style={{ marginBottom: 24, textAlign: "center" }}>
        Start by importing your M-Pesa transaction history from a CSV or JSON file
      </Text>

      <HistoryImport />
    </View>
  );
}
