import { useLegendTheme } from "@/lib/legend-state/settings-store";
import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { List, Switch, useTheme, Divider } from "react-native-paper";


interface SettingsScreenProps {

}

export function SettingsScreen({}: SettingsScreenProps){
  const { setTheme, theme,isDarkMode,toggleTheme } = useLegendTheme();

  return (
    <ScrollView style={[styles.container]}>
      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>Appearance</List.Subheader>
        <List.Item
          title="Dark Mode"
          left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => <Switch value={isDarkMode} onValueChange={toggleTheme} />}
        />
        <Divider />
      </List.Section>

      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>Notifications</List.Subheader>
        <List.Item
          title="Push Notifications"
          description="Get notified about new transactions"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={() => <Switch disabled value={false} />}
        />
        <Divider />
      </List.Section>

      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>Security</List.Subheader>
        <List.Item
          title="Biometric Authentication"
          description="Use fingerprint or face ID"
          left={(props) => <List.Icon {...props} icon="fingerprint" />}
          right={() => <Switch disabled value={false} />}
        />
        <List.Item
          title="PIN Lock"
          description="Require PIN to open app"
          left={(props) => <List.Icon {...props} icon="lock" />}
          right={() => <Switch disabled value={false} />}
        />
        <Divider />
      </List.Section>

      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>Data</List.Subheader>
        <List.Item
          title="Auto-Sync"
          description="Keep transactions up to date"
          left={(props) => <List.Icon {...props} icon="sync" />}
          right={() => <Switch disabled value={false} />}
        />
        <List.Item
          title="Clear Cache"
          description="Free up space on your device"
          left={(props) => <List.Icon {...props} icon="trash-can" />}
          onPress={() => {}}
        />
      </List.Section>

      <List.Section>
        <List.Subheader style={[styles.listSubHeader]}>About</List.Subheader>
        <List.Item
          title="Version"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="Terms of Service"
          left={(props) => <List.Icon {...props} icon="file-document" />}
          onPress={() => {}}
        />
        <List.Item
          title="Privacy Policy"
          left={(props) => <List.Icon {...props} icon="shield-account" />}
          onPress={() => {}}
        />
      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listSubHeader:{
    fontSize: 16,
    fontWeight: "bold",
  }
});


