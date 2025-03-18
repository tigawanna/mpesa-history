import { createMergeableStore } from "tinybase/mergeable-store";
import { useCreateMergeableStore } from "tinybase/ui-react";

export function useTinybaseStore() {
  return useCreateMergeableStore(() =>
    createMergeableStore()
  );
}


