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

export function useLegendhistory() {
  const history = use$(() => history$.get());
  const updatehistory = (value: Partial<HistoryStoreType>) => {
    history$.set({ ...history, ...value });
  };
  return { history, updatehistory };
}


// Helper functions for importing data
function parseCSVData(csvContent: string): Omit<HistoryEntry, 'id'>[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',').map(value => value.trim());
    const entry: any = {};
    
    headers.forEach((header, index) => {
      if (header === 'date') {
        entry[header] = new Date(values[index]);
      } else {
        entry[header] = values[index];
      }
    });
    
    return entry as Omit<HistoryEntry, 'id'>;
  });
}

function parseJSONData(jsonContent: string): Omit<HistoryEntry, 'id'>[] {
  try {
    const parsed = JSON.parse(jsonContent);
    
    // Handle array format
    if (Array.isArray(parsed)) {
      return parsed.map(item => ({
        ...item,
        date: new Date(item.date) // Convert date strings to Date objects
      }));
    } 
    // Handle object with array property format
    else if (parsed.mpesa_history && Array.isArray(parsed.mpesa_history)) {
      return parsed.mpesa_history.map((item: any) => ({
        ...item,
        date: new Date(item.date)
      }));
    }
    
    throw new Error('Invalid JSON format');
  } catch (error) {
    console.error('JSON parsing error:', error);
    return [];
  }
}

// Helper functions for exporting data
function formatEntryToCSVRow(entry: HistoryEntry): string {
  // Format date to ISO string
  const dateStr = entry.date instanceof Date 
    ? entry.date.toISOString() 
    : new Date(entry.date).toISOString();
  
  // Escape any commas in the text fields
  const name = `"${entry.name.replace(/"/g, '""')}"`;
  const number = `"${entry.number.replace(/"/g, '""')}"`;
  const note = `"${entry.note.replace(/"/g, '""')}"`;
  
  return `${dateStr},${name},${number},${note}`;
}


//  mutate example usage

// Example usage in a component
// function MyComponent() {
//   const historyEntries = useHistoryList();
//   const { createEntry, updateEntry, deleteEntry } = useHistoryMutations();
  
//   // Creating a new entry
//   const handleAdd = () => {
//     createEntry({
//       date: new Date(),
//       name: "John Doe",
//       number: "+1234567890",
//       note: "Payment for services"
//     });
//   };
  
//   // Updating an entry
//   const handleUpdate = (id) => {
//     updateEntry(id, { note: "Updated note" });
//   };
  
//   // Deleting an entry
//   const handleDelete = (id) => {
//     deleteEntry(id);
//   };
  
//   // Render the component...
// }


//  import data example usage

// function ImportComponent() {
//   const { importFromCSV, importFromJSON } = useHistoryMutations();
  
//   const handleCSVFileUpload = async (file) => {
//     const content = await file.text();
//     const entriesAdded = importFromCSV(content);
//     alert(`Successfully imported ${entriesAdded} entries from CSV`);
//   };
  
//   const handleJSONFileUpload = async (file) => {
//     const content = await file.text();
//     const entriesAdded = importFromJSON(content);
//     alert(`Successfully imported ${entriesAdded} entries from JSON`);
//   };
  
  // Render file input components...
// }

// export data exmaple usage 

// import * as FileSystem from 'expo-file-system';
// import * as Sharing from 'expo-sharing';

// function ExportComponent() {
//   const { exportToCSV, exportToJSON } = useHistoryMutations();
  
//   const handleExportToCSV = async () => {
//     const csvContent = exportToCSV();
//     const fileUri = `${FileSystem.documentDirectory}mpesa_history_${Date.now()}.csv`;
    
//     try {
//       await FileSystem.writeAsStringAsync(fileUri, csvContent);
//       await Sharing.shareAsync(fileUri);
//     } catch (error) {
//       console.error('Error exporting CSV:', error);
//       alert('Failed to export CSV file');
//     }
//   };
  
//   const handleExportToJSON = async () => {
//     const jsonContent = exportToJSON();
//     const fileUri = `${FileSystem.documentDirectory}mpesa_history_${Date.now()}.json`;
    
//     try {
//       await FileSystem.writeAsStringAsync(fileUri, jsonContent);
//       await Sharing.shareAsync(fileUri);
//     } catch (error) {
//       console.error('Error exporting JSON:', error);
//       alert('Failed to export JSON file');
//     }
//   };
  
//   return (
//     <View>
//       <Button title="Export to CSV" onPress={handleExportToCSV} />
//       <Button title="Export to JSON" onPress={handleExportToJSON} />
//     </View>
//   );
// }
