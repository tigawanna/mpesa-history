import React, { useState } from "react";
import { StyleSheet} from "react-native";
import { IconButton} from "react-native-paper";
import { HistoryForm } from "./HistoryForm";




type Props = {
  item?: any;
};

export function HistoryFormUpdate({ item }: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <HistoryForm prev={item} visible={visible} onDismiss={() => setVisible(false)} />
      <IconButton
        icon="dots-vertical"
        // style={{
        //   position: "absolute",
        //   margin: 16,
        //   right: 0,
        //   bottom: 0,
        // }}
        onPress={() => setVisible(true)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  // ...existing code...
});
