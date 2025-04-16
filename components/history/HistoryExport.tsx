import React, { useState } from "react";
import { View } from "react-native";
import { Button, Text, Dialog, Portal, ActivityIndicator, useTheme, Snackbar } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { useHistoryMutations } from "../../lib/legend-state/history-store";

type ExportResult = {
  success: boolean;
  message: string;
} | null;

export function HistoryExport() {
  const [exportVisible, setExportVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExportResult>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { exportToCSV, exportToJSON } = useHistoryMutations();
  const { colors } = useTheme();

  const showExportDialog = () => setExportVisible(true);
  const hideExportDialog = () => setExportVisible(false);

  const handleExportToCSV = async () => {
    try {
      setLoading(true);
      const csvContent = exportToCSV();
      
      // Check if content is empty
      if (!csvContent || csvContent === "date,name,number,note") {
        setResult({
          success: false,
          message: "No data to export",
        });
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileUri = `${FileSystem.documentDirectory}mpesa_history_${timestamp}.csv`;
      
      await FileSystem.writeAsStringAsync(fileUri, csvContent);
      
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri);
        setResult({
          success: true,
          message: "CSV file shared successfully",
        });
      } else {
        setResult({
          success: false,
          message: "Sharing is not available on this device",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to export CSV",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportToJSON = async () => {
    try {
      setLoading(true);
      const jsonContent = exportToJSON();
      
      // Check if content is empty or just contains empty array
      if (!jsonContent || jsonContent === '{"mpesa_history":[],"exported_at":"' + new Date().toISOString() + '"}') {
        setResult({
          success: false,
          message: "No data to export",
        });
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const fileUri = `${FileSystem.documentDirectory}mpesa_history_${timestamp}.json`;
      
      await FileSystem.writeAsStringAsync(fileUri, jsonContent);
      
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri);
        setResult({
          success: true,
          message: "JSON file shared successfully",
        });
      } else {
        setResult({
          success: false,
          message: "Sharing is not available on this device",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to export JSON",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDismissResult = () => {
    setResult(null);
    hideExportDialog();
  };

  const showSnackbar = () => setSnackbarVisible(true);
  const hideSnackbar = () => setSnackbarVisible(false);

  return (
    <>
      <Button 
        mode="outlined" 
        onPress={showExportDialog} 
        icon="file-export"
      >
        Export
      </Button>

      <Portal>
        {/* Export Options Dialog */}
        <Dialog visible={exportVisible && !result} onDismiss={hideExportDialog}>
          <Dialog.Title>Export M-Pesa History</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 16 }}>
              Choose a file format to export your M-Pesa transaction history
            </Text>

            {loading ? (
              <View style={{ alignItems: "center", padding: 16 }}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 12 }}>Preparing file...</Text>
              </View>
            ) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideExportDialog}>Cancel</Button>
            <Button 
              onPress={handleExportToCSV} 
              disabled={loading} 
              icon="file-delimited"
            >
              CSV
            </Button>
            <Button 
              onPress={handleExportToJSON} 
              disabled={loading} 
              icon="code-json"
            >
              JSON
            </Button>
          </Dialog.Actions>
        </Dialog>

        {/* Result Dialog */}
        <Dialog visible={!!result} onDismiss={handleDismissResult}>
          <Dialog.Title>
            {result?.success ? "Export Successful" : "Export Failed"}
          </Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{result?.message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleDismissResult}>OK</Button>
          </Dialog.Actions>
        </Dialog>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={hideSnackbar}
          duration={3000}
          action={{
            label: "OK",
            onPress: hideSnackbar,
          }}
        >
          {result?.message}
        </Snackbar>
      </Portal>
    </>
  );
}
