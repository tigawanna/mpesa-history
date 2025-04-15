import React, { useState } from "react";
import { FAB } from "react-native-paper";
import { HistoryForm } from "./HistoryForm";

type Props = {};

export function HistoryFormCreate({}: Props) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <HistoryForm visible={visible} onDismiss={() => setVisible(false)} />
      <FAB
        icon="plus"
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        onPress={() => setVisible(true)}
      />
    </>
  );
}
