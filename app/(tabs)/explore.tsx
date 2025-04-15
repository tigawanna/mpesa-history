// import { BackupLocally } from "@/components/BackupLocally";
// import { defaultDatabaseDirectory } from "expo-sqlite";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Surface,
  Text,
  Chip,
  Card,
  useTheme,
  Avatar,
  IconButton,
} from "react-native-paper";

export default function TabTwoScreen() {
  const { colors } = useTheme();

  return (
    <Surface
      style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 16, padding: 16 }}>
      {/* <Text variant="bodyLarge">{defaultDatabaseDirectory}</Text> */}
      {/* <BackupLocally /> */}
      <Card style={{ ...styles.importCard, backgroundColor: colors.elevation.level3 }}>
        <Card.Title
          title="Import Options"
          subtitle="Add contacts to your M-Pesa history"
          left={(props) => <Avatar.Icon {...props} icon="import" color={colors.primary} />}
          right={(props) => <IconButton {...props} icon="information" onPress={() => {}} />}
        />
        <Card.Content style={{ gap: 12 }}>
          <View style={styles.importRow}>
            <Button mode="outlined" icon="message-text" disabled style={{ flex: 1 }}>
              Import from SMS
            </Button>
            <Chip mode="outlined" style={{ marginLeft: 8 }}>
              Coming Soon
            </Chip>
          </View>
          <View style={styles.importRow}>
            <Button mode="outlined" icon="file-document" disabled style={{ flex: 1 }}>
              Import from Statement
            </Button>
            <Chip mode="outlined" style={{ marginLeft: 8 }}>
              Coming Soon
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* <Text variant="bodyMedium" style={{ textAlign: "center", marginTop: 16 }}>
        We're working on making it easier to import your M-Pesa contacts. These features will be
        available in a future update.
      </Text> */}
    </Surface>
  );
}

const styles = StyleSheet.create({
  importCard: {
    width: "100%",
    marginBottom: 8,
    gap: 8,
  },
  importRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
