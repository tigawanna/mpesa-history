import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, Button, IconButton, ProgressBar, useTheme } from 'react-native-paper';
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { useLegendSettings } from '@/lib/legend-state/settings-store';
import { defaultDatabaseDirectory } from "expo-sqlite";
import { DATABASE_NAME } from '@/db/client';

export function BackupLocally(): JSX.Element {
  const { settings, updateSettings } = useLegendSettings();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const { colors } = useTheme();
  
  // Format date for display
  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };
  
  // Select a backup directory
  const selectBackupLocation = async (): Promise<void> => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: false,
        multiple: false,
      });
      
      if (result.canceled) return;
      
      // Get the directory path by removing the file name from the URI
      const uri = result.assets[0].uri;
      const dirPath = uri.substring(0, uri.lastIndexOf('/'));
      
      updateSettings({ 
        localBackupPath: dirPath,
      });
    } catch (error) {
      console.error("Error selecting backup location:", error);
    }
  };
  
  // Perform the backup
  const performBackup = async (): Promise<void> => {
    if (!settings.localBackupPath) {
      await selectBackupLocation();
      return;
    }
    
    try {
      setIsBackingUp(true);
      setProgress(0.1);
      
      // Get the database file path
      const dbPath = `${defaultDatabaseDirectory}/${DATABASE_NAME}`;
      
      // Create a backup filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFilename = `${DATABASE_NAME}-${timestamp}.db`;
      const backupPath = `${settings.localBackupPath}/${backupFilename}`;
      
      // Simulate progress (in a real app, you'd use FileSystem.createDownloadResumable for proper progress)
      setProgress(0.3);
      
      // Copy the database file
      await FileSystem.copyAsync({
        from: dbPath,
        to: backupPath,
      });
      
      setProgress(0.9);
      
      // Update last backup timestamp
      updateSettings({
        lastBackup: new Date(),
      });
      
      setProgress(1);
      
      // Reset progress after a short delay
      setTimeout(() => {
        setIsBackingUp(false);
        setProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error("Error during backup:", error);
      setIsBackingUp(false);
      setProgress(0);
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Title
        title="Database Backup"
        subtitle="Save a copy of your M-Pesa contacts"
        left={(props) => <IconButton {...props} icon="database" />}
      />
      
      <Card.Content style={styles.content}>
        <View style={styles.infoRow}>
          <Text variant="bodyMedium">Backup location:</Text>
          <Text variant="bodyMedium" style={{ flex: 1, marginLeft: 8 }} numberOfLines={1} ellipsizeMode="middle">
            {settings.localBackupPath || 'Not set'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text variant="bodyMedium">Last backup:</Text>
          <Text variant="bodyMedium" style={{ marginLeft: 8 }}>
            {formatDate(settings.lastBackup)}
          </Text>
        </View>
        
        {isBackingUp && (
          <ProgressBar progress={progress} color={colors.primary} style={styles.progressBar} />
        )}
      </Card.Content>
      
      <Card.Actions>
        <Button 
          mode="outlined" 
          icon="folder" 
          onPress={selectBackupLocation}
          disabled={isBackingUp}
        >
          Set Location
        </Button>
        <Button 
          mode="contained" 
          icon="content-save" 
          onPress={performBackup}
          loading={isBackingUp}
          disabled={isBackingUp}
        >
          Backup Now
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
  },
  content: {
    gap: 12,
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    marginTop: 12,
    height: 6,
    borderRadius: 4,
  }
});
