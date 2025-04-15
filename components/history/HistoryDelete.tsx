
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Text, Surface, Portal, Button, useTheme, Dialog, ActivityIndicator } from "react-native-paper";
import { MaterialIcon } from "../ui/IconSymbol";

interface HistoryDeleteProps {
  selected: number[];
  setReload: React.Dispatch<React.SetStateAction<number>>;
  setSelected: React.Dispatch<React.SetStateAction<number[] | null>>;
}
export function HistoryDelete({ selected,setReload,setSelected }: HistoryDeleteProps) {
  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideDialog = () => setVisible(false);


  // const db = useDrizzle();
  // const { data, isPending,mutate } = useMutation({
  //   mutationFn: () => deleteHistory(db, selected),
  //   onSuccess: () => {
  //       setReload((prev) => prev + 1);
  //       setSelected([]);
  //       hideDialog()
  //   },
  // });
  const {colors} = useTheme()
  return (
    <Surface style={{ ...styles.container }}>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Confirm deletion</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{selected.length} items will be deleted</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>cancel</Button>
            {/* {isPending?<ActivityIndicator/>:<Button onPress={()=>mutate(selected)}>confirm </Button>} */}
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
