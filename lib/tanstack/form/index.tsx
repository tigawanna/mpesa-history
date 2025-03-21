import { AnyFieldMeta, createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { CheckboxField, SelectField, TextField } from "./form-field-components";
import { SubmitButton } from "./form-components";

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    TextField,
    CheckboxField,
    SelectField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});

export function isError(meta: AnyFieldMeta) {
  if (meta.isTouched && meta.errors) {
    return true;
  }
  return false;
}
