import { HistoryEntry } from "./history-store";

// Helper functions for importing data
export function parseCSVData(csvContent: string): Omit<HistoryEntry, 'id'>[] {
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

export function parseJSONData(jsonContent: string): Omit<HistoryEntry, 'id'>[] {
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

// Helper functions for exporting dataexpo r
export function formatEntryToCSVRow(entry: HistoryEntry): string {
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
