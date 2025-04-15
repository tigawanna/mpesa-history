import React, { useEffect } from "react";
import { StyleSheet, KeyboardAvoidingView, Platform, View } from "react-native";
import {
  Button,
  Modal,
  Portal,
  Card,
  IconButton,
  Snackbar,
  TextInput,
  HelperText,
  useTheme,
} from "react-native-paper";
import { useHistoryMutations } from "../../lib/legend-state/history-store";
import { useForm, Controller } from "react-hook-form";

type FormData = {
  name: string;
  number: string;
  note: string;
};

type Props = {
  visible: boolean;
  onDismiss: () => void;
  initialValues?: {
    id: string;
    name: string;
    number: string;
    note: string;
    date: Date;
  };
};

export function HistoryForm({ visible, onDismiss, initialValues }: Props) {
  const { createEntry, updateEntry } = useHistoryMutations();
  const [error, setError] = React.useState<string | null>(null);
  const { colors } = useTheme();
  
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: {
      name: initialValues?.name || '',
      number: initialValues?.number || '',
      note: initialValues?.note || '',
    }
  });

  // Reset form when modal becomes visible with new initialValues
  useEffect(() => {
    if (visible) {
      reset({
        name: initialValues?.name || '',
        number: initialValues?.number || '',
        note: initialValues?.note || '',
      });
      setError(null);
    }
  }, [visible, initialValues, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (initialValues?.id) {
        // Update existing entry
        updateEntry(initialValues.id, {
          name: data.name,
          number: data.number,
          note: data.note,
        });
      } else {
        // Create new entry
        createEntry({
          name: data.name,
          number: data.number,
          note: data.note,
          date: new Date(),
        });
      }
      onDismiss();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const handleReset = () => {
    reset({
      name: initialValues?.name || '',
      number: initialValues?.number || '',
      note: initialValues?.note || '',
    });
  };

  const onDismissSnackBar = () => setError(null);

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onDismiss} 
        contentContainerStyle={styles.modalContainer}
        dismissable={!isSubmitting}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <Card style={styles.card}>
            <Card.Title
              title={initialValues ? "Update M-Pesa Contact" : "Add M-Pesa Contact"}
              right={(props) => (
                <IconButton 
                  {...props} 
                  icon="close" 
                  onPress={onDismiss}
                  disabled={isSubmitting} 
                />
              )}
            />
            <Card.Content>
              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  name="name"
                  rules={{ 
                    required: "Name is required" 
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      mode="outlined"
                      label="Name"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.name}
                      style={styles.input}
                      autoFocus
                      returnKeyType="next"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.name && <HelperText type="error">{errors.name.message}</HelperText>}
              </View>

              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  name="number"
                  rules={{ 
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+\s-]{9,15}$/,
                      message: "Please enter a valid phone number"
                    }
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      mode="outlined"
                      label="Number"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={!!errors.number}
                      style={styles.input}
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      disabled={isSubmitting}
                    />
                  )}
                />
                {errors.number && <HelperText type="error">{errors.number.message}</HelperText>}
              </View>

              <View style={styles.inputContainer}>
                <Controller
                  control={control}
                  name="note"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      mode="outlined"
                      label="Note"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      style={styles.input}
                      multiline
                      numberOfLines={3}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              <Button 
                onPress={handleReset} 
                disabled={isSubmitting} 
                mode="text"
              >
                Reset
              </Button>
              <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {initialValues ? "Update" : "Save"}
              </Button>
            </Card.Actions>
          </Card>
        </KeyboardAvoidingView>
      </Modal>
      <Snackbar
        visible={!!error}
        onDismiss={onDismissSnackBar}
        action={{
          label: "Dismiss",
          onPress: onDismissSnackBar,
        }}
      >
        {error}
      </Snackbar>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    marginHorizontal: 16,
  },
  keyboardAvoidingView: {
    justifyContent: "center",
  },
  card: {
    borderRadius: 12,
    elevation: 5,
  },
  inputContainer: {
    marginVertical: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  cardActions: {
    justifyContent: "space-between",
    padding: 16,
  },
});
