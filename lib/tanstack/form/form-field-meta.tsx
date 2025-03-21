import { AnyFieldMeta } from "@tanstack/react-form";
import { Text, useTheme } from "react-native-paper";

type FieldMeta = {
  meta: AnyFieldMeta;
};

export function FieldError({ meta }: FieldMeta) {
  const { colors } = useTheme();
  if (!meta.isTouched) return;
  if (meta.errors) {
    return (
      <Text style={{ color: colors.error }} variant="labelSmall">
        {meta.errors.join(",\n")}
      </Text>
    );
  }
}
