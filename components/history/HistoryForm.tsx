import React, { useState } from "react";
import { StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import {
  Button,
  TextInput,
  Modal,
  Portal,
  Card,
  Text,
  IconButton,
  AnimatedFAB,
  Snackbar,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { historyTable } from "@/db/schema";
import { useDrizzle } from "@/db/useDrizzle";

type NewHistoryEntry = {
  number: string;
  name: string;
  note?: string | null | undefined;
};

export function HistoryForm() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const db = useDrizzle();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewHistoryEntry>({
    defaultValues: {
      name: "",
      number: "",
      note: "",
    },
  });

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const onDismissSnackBar = () => setError(null);

  const onSubmit = async (data: NewHistoryEntry) => {
    try {
      setLoading(true);
      await db.insert(historyTable).values({
        name: data.name,
        number: data.number,
        note: data.note || null,
      });

      reset();
      hideModal();
    } catch (error) {
      console.error("Error saving entry:", error);
      setError("An error occurred while saving the entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatedFAB
        label="new"
        extended={false}
        icon="plus"
        animateFrom={"right"}
        onPress={showModal}
        style={styles.fab}
      />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <Card style={styles.card}>
                <Card.Title
                  title="Add M-Pesa Contact"
                  right={(props) => <IconButton {...props} icon="close" onPress={hideModal} />}
                />
                <Card.Content style={styles.cardContent}>
                  <Controller
                    control={control}
                    rules={{
                      required: "Name is required",
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Name"
                        mode="outlined"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        error={!!errors.name}
                        style={styles.input}
                      />
                    )}
                    name="name"
                  />
                  {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

                  <Controller
                    control={control}
                    rules={{
                      required: "Phone number is required",
                      pattern: {
                        value: /^(\+?\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/,
                        message: "Invalid phone number format",
                      },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Phone Number"
                        mode="outlined"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                        error={!!errors.number}
                        style={styles.input}
                      />
                    )}
                    name="number"
                  />
                  {errors.number && <Text style={styles.errorText}>{errors.number.message}</Text>}

                  <Controller
                    control={control}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Note (Optional)"
                        mode="outlined"
                        value={value || ""}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        multiline
                        numberOfLines={3}
                        style={styles.input}
                      />
                    )}
                    name="note"
                  />
                </Card.Content>

                <Card.Actions style={styles.cardActions}>
                  <Button onPress={() => reset()} disabled={loading}>
                    Reset
                  </Button>
                  <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    loading={loading}
                    disabled={loading}>
                    Save
                  </Button>
                </Card.Actions>
              </Card>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
        {error && (
          <Snackbar
            visible={visible}
            onDismiss={onDismissSnackBar}
            action={{
              label: "Something went wrong",
              onPress: () => {
                // Do something
              },
            }}
            children={null}
          />
        )}
      </Portal>
    </>
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
