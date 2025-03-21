import { useStore } from "@tanstack/react-form";
import { useFormContext } from "@/lib/tanstack/form/index";
import { Button } from "react-native-paper";

type SubmitButtonProps = {
  label: string;  
  isPending?: boolean;
  disabled?: boolean;}

export function SubmitButton({disabled,label,isPending}:SubmitButtonProps){
    const form = useFormContext()
    const [isSubmitting,canSubmit] = useStore(form.store,(state)=>[
        state.isSubmitting,
        state.canSubmit,
    ]
);
    return (
      <Button
        mode="contained"
        onPress={() => form.handleSubmit()}
        loading={isPending || isSubmitting}
        disabled={disabled || !canSubmit || isSubmitting}>
        {label}
      </Button>
    );
}
