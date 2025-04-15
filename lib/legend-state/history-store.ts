import { observable } from "@legendapp/state";
import { use$ } from "@legendapp/state/react";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { parseCSVData, parseJSONData, formatEntryToCSVRow } from "./history-strore-helpers";

export type HistoryEntry = {
  id: string; // Adding id for unique identification
  date: Date;
  name: string;
  number: string;
  note: string;
};

export type HistoryStoreType = {
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

  // Import entries from CSV
  const importFromCSV = (csvContent: string) => {
    const entries = parseCSVData(csvContent);
    const currentHistory = history$.mpesa_history.peek() || [];
    
    // Add each new entry with a unique ID
    const newEntries = entries.map(entry => ({
      ...entry,
      id: `import-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }));
    
    history$.mpesa_history.set([...currentHistory, ...newEntries]);
    return newEntries.length;
  };

  // Import entries from JSON
  const importFromJSON = (jsonContent: string) => {
    const entries = parseJSONData(jsonContent);
    const currentHistory = history$.mpesa_history.peek() || [];
    
    // Add each new entry with a unique ID
    const newEntries = entries.map(entry => ({
      ...entry,
      id: `import-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    }));
    
    history$.mpesa_history.set([...currentHistory, ...newEntries]);
    return newEntries.length;
  };

  // Export entries to CSV
  const exportToCSV = (): string => {
    const currentHistory = history$.mpesa_history.peek() || [];
    if (currentHistory.length === 0) {
      return "date,name,number,note";
    }
    
    const header = "date,name,number,note";
    const rows = currentHistory.map(formatEntryToCSVRow);
    
    return [header, ...rows].join('\n');
  };
  
  // Export entries to JSON
  const exportToJSON = (): string => {
    const currentHistory = history$.mpesa_history.peek() || [];
    
    // Format dates to ISO strings for proper JSON serialization
    const formattedHistory = currentHistory.map(entry => ({
      ...entry,
      date: entry.date instanceof Date 
        ? entry.date.toISOString() 
        : new Date(entry.date).toISOString()
    }));
    
    // You can choose to return just the array or wrap it in an object
    const exportData = {
      mpesa_history: formattedHistory,
      exported_at: new Date().toISOString()
    };
    
    return JSON.stringify(exportData, null, 2); // Pretty printed with 2 spaces
  };

  return {
    createEntry,
    updateEntry,
    deleteEntry,
    importFromCSV,
    importFromJSON,
    exportToCSV,
    exportToJSON
  };
}

export function useLegendHistory() {
  const history = use$(() => history$.get());
  const updatehistory = (value: Partial<HistoryStoreType>) => {
    history$.set({ ...history, ...value });
  };
  return { history, updatehistory };
}


