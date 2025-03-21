import { isError, useFieldContext } from "@/lib/tanstack/form/index";
import { KeyboardTypeOptions, View } from "react-native";
import { TextInput, Text, Divider, List, Menu, Surface, TouchableRipple, Checkbox } from "react-native-paper";
import { FieldError } from "./form-field-meta";
import React, { useState } from "react";

type FieldProps = {
  label: string;
  keyboardType?: KeyboardTypeOptions;
};

export function TextField({ label, keyboardType }: FieldProps) {
  const field = useFieldContext<string>();
  const is_error = isError(field.state.meta);
  return (
    <View>
      <TextInput
        label={label}
        mode="outlined"
        style={{ borderColor: is_error ? "red" : "" }}
        value={field.state.value}
        onBlur={field.handleBlur}
        onChangeText={(e) => field.handleChange(e)}
        keyboardType={keyboardType}
      />
      <FieldError meta={field.state.meta} />
    </View>
  );
}

type SelectFieldProps = {
  label: string;
  options: { label: string; value: string }[];
  placeholder?: string;
};

export function SelectField({
  label,
  options,
  placeholder = "Select an option",
}: SelectFieldProps) {
  const field = useFieldContext<string>();
  const [visible, setVisible] = useState(false);
  const is_error = isError(field.state.meta);

  // Find the selected option's label to display
  const selectedOption = options.find((option) => option.value === field.state.value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (value: string) => {
    field.handleChange(value);
    field.handleBlur();
    closeMenu();
  };

  return (
    <View>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <TouchableRipple onPress={openMenu}>
            <View>
              <TextInput
                label={label}
                mode="outlined"
                style={{ borderColor: is_error ? "red" : "" }}
                value={displayValue}
                editable={false}
                right={<TextInput.Icon icon="menu-down" />}
              />
            </View>
          </TouchableRipple>
        }
        contentStyle={{ marginTop: 8 }}>
        <Surface
          style={{
            elevation: 4,
            maxHeight: 300,
          }}>
          {options.map((option, index) => (
            <React.Fragment key={option.value}>
              <List.Item
                title={option.label}
                onPress={() => handleSelect(option.value)}
                right={(props) =>
                  field.state.value === option.value ? <List.Icon {...props} icon="check" /> : null
                }
              />
              {index < options.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Surface>
      </Menu>
      <FieldError meta={field.state.meta} />
    </View>
  );
}



type CheckboxFieldProps = {
  label: string;
  helperText?: string;
};

export function CheckboxField({ label, helperText }: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const is_error = isError(field.state.meta);

  const handleToggle = () => {
    const newValue = !field.state.value;
    field.handleChange(newValue);
    field.handleBlur();
  };

  return (
    <View>
      <TouchableRipple onPress={handleToggle} style={{ borderRadius: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
          <Checkbox status={field.state.value ? "checked" : "unchecked"} onPress={handleToggle} />
          <View style={{ marginLeft: 8, flex: 1 }}>
            <Text style={[{ fontSize: 16 }, is_error ? { color: "red" } : null]}>{label}</Text>
            {helperText && <Text style={{ fontSize: 12, opacity: 0.7 }}>{helperText}</Text>}
          </View>
        </View>
      </TouchableRipple>
      <FieldError meta={field.state.meta} />
    </View>
  );
}
