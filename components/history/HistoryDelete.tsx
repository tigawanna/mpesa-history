import { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Surface, Portal, Button, useTheme, Dialog, ActivityIndicator } from "react-native-paper";
import { MaterialIcon } from "../ui/IconSymbol";
import { useHistoryMutations } from "../../lib/legend-state/history-store";

interface HistoryDeleteProps {
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[] | null>>;
}

export function HistoryDelete({ selected, setSelected }: HistoryDeleteProps) {
  const [visible, setVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteEntry } = useHistoryMutations();
  const { colors } = useTheme();

  const showModal = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete each selected entry
      for (const id of selected) {
        deleteEntry(id);
      }
      
      // Reset selection
      setSelected(null);
      hideDialog();
    } catch (error) {
      console.error("Error deleting entries:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Surface style={{ ...styles.container }}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Confirm deletion</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{selected.length} items will be deleted</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            {isDeleting ? 
              <ActivityIndicator /> : 
              <Button 
                onPress={handleDelete} 
                textColor={colors.error}
              >
                Confirm
              </Button>
            }
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Button style={{}} onPress={showModal}>
        <MaterialIcon name="delete-forever" color={colors.error} />
      </Button>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {},
  modalContainer: {
    margin: 20,
    width: "90%",
    padding: 20,
    justifyContent: "flex-end",
  },
});
