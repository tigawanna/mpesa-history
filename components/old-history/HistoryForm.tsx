import React, { useState } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Card,
  IconButton,
  Snackbar,
} from "react-native-paper";
import { useDrizzle } from "@/db/useDrizzle";
import { useMutation } from "@/hooks/use-mutation";
import { historyTableInsert, InsertHistoryEntry } from "@/db/validators";
import { handleHistoryTableInsert } from "@/db/data/history";
import { useAppForm } from "@/lib/tanstack/form";

type HistoryForminput = Omit<InsertHistoryEntry,  "createdAt" | "updatedAt">;
type Props = {
  visible: boolean;
  onDismiss: () => void;
  prev?: InsertHistoryEntry;
};


export function HistoryForm({ visible, onDismiss,prev }: Props) {
  const form = useAppForm({
    defaultValues: {
      id:prev?.id,
      name: prev?.name ?? "",
      number: prev?.number ?? "",
      note: prev?.note,
    } as HistoryForminput,
    validators: {
      onChange: historyTableInsert,
    },
    onSubmit: async ({ value, meta }) => {
      mutate(value);
    },
  });

  const [error, setError] = useState<string | null>(null);
  const db = useDrizzle();
  const {mutate} = useMutation<HistoryForminput>({
    mutationFn: (vars) => handleHistoryTableInsert(db, vars),
    onSuccess: () => {
      onDismiss();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const onDismissSnackBar = () => setError(null);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <Card style={styles.card}>
              <Card.Title
                title={prev?"Update Mpesa Contact":"Add M-Pesa Contact"}
                right={(props) => <IconButton {...props} icon="close" onPress={onDismiss} />}
              />
              <Card.Content style={{ gap: 8 }}>
                <form.AppField name="name" children={(field) => <field.TextField label="Name" />} />
                <form.AppField
                  name="number"
                  children={(field) => <field.TextField label="Number" keyboardType="phone-pad" />}
                />
                <form.AppField name="note" children={(field) => <field.TextField label="Note" />} />
              </Card.Content>

              <Card.Actions style={styles.cardActions}>
                <Button onPress={() => form.reset()} disabled={form.state.isSubmitting}>
                  Reset
                </Button>
                <Button
                  mode="contained"
                  onPress={() => form.handleSubmit()}
                  loading={form.state.isSubmitting}
                  disabled={form.state.isSubmitting}>
                  Save
                </Button>
              </Card.Actions>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      {error && (
        <Snackbar
          visible={!!error}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Dismiss",
            onPress: onDismissSnackBar,
          }}>
          {error}
        </Snackbar>
      )}
    </Portal>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    margin: 20,
    width: "90%",
    justifyContent: "flex-end",
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 0.8,
    height: "100%",
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
  card: {
    borderRadius: 8,
  },
  cardContent: {
    gap: 8,
  },
  input: {
    marginVertical: 6,
  },
  cardActions: {
    justifyContent: "flex-end",
    padding: 16,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 8,
  },
});
