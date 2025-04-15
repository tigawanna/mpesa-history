import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { useColorScheme } from "react-native";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";

type HistoryEntry = {
  id: string; // Adding id for unique identification
  date: Date;
  name: string;
  number: string;
  note: string;
};

type HistoryStoreType = {
  mpesa_history: HistoryEntry[] | null;
};

// Observables can be primitives or deep objects
export const history$ = observable<HistoryStoreType>({
  mpesa_history: null,
});

syncObservable(history$, {
  persist: {
    name: "history",
    plugin: ObservablePersistLocalStorage,
  },
});

// Hook to get the full history list
export function useHistoryList() {
  return use$(() => history$.mpesa_history.get()) || [];
}

// Combined hook for all mutations (create, update, delete)
export function useHistoryMutations() {
  // Create a new history entry
  const createEntry = (entry: Omit<HistoryEntry, 'id'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now().toString(), // Simple ID generation
    };
    
    const currentHistory = history$.mpesa_history.peek() || [];
    history$.mpesa_history.set([...currentHistory, newEntry]);
    
    return newEntry;
  };

  // Update an existing history entry
  const updateEntry = (id: string, updates: Partial<Omit<HistoryEntry, 'id'>>) => {
    const currentHistory = history$.mpesa_history.peek() || [];
    const updatedHistory = currentHistory.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    );
    
    history$.mpesa_history.set(updatedHistory);
  };

  // Delete a history entry
  const deleteEntry = (id: string) => {
    const currentHistory = history$.mpesa_history.peek() || [];
    const filteredHistory = currentHistory.filter(entry => entry.id !== id);
    
    history$.mpesa_history.set(filteredHistory);
  };

  return {
    createEntry,
    updateEntry,
    deleteEntry,
  };
}

export function useLegendhistory() {
  const history = use$(() => history$.get());
  const updatehistory = (value: Partial<HistoryStoreType>) => {
    history$.set({ ...history, ...value });
  };
  return { history, updatehistory };
}


