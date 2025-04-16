import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import { Avatar, Checkbox, Chip, List, Searchbar, Surface, useTheme } from "react-native-paper";
import { useHistoryList } from "../../lib/legend-state/history-store";
import { setStringAsync } from "expo-clipboard";
import { HistoryDelete } from "./HistoryDelete";
import { HistoryFormCreate } from "./HistoryFormCreate";
import { HistoryFormUpdate } from "./HistoryFormUpdate";
import { HistoryImportEmptyState } from "./HistpryImport";
import { formatDate } from "@/lib/date";




export function HistoryList(): JSX.Element {
  const historyEntries = useHistoryList();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selected, setSelected] = React.useState<string[] | null>(null);
  
  // Filter entries based on search query
  const filteredEntries = React.useMemo(() => {
    if (!searchQuery.trim()) return historyEntries;
    
    const query = searchQuery.toLowerCase();
    return historyEntries.filter(entry => 
      entry?.name?.toLowerCase().includes(query) || 
      entry?.number?.toLowerCase().includes(query) ||
      entry?.note?.toLowerCase().includes(query)
    );
  }, [historyEntries, searchQuery]);

  const handlelongPress = (id: string) => {
    setSelected([id]);
  };
  
  const handleAddOrRemoveOnPress = (id: string) => {
    if (!selected || selected?.length === 0) return;
    setSelected((prev) => {
      if (!prev) return [id];
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };
  
  const handlePressOnce = (item: typeof historyEntries[0]) => {
    if (!selected || selected?.length === 0) {
      setStringAsync(item.number);
    } else {
      if(!item.id) return;
      handleAddOrRemoveOnPress(item.id);
    }
  };

  const { colors } = useTheme();
  const isAllSelected = selected?.length === filteredEntries.length;
  const isSelecting = selected && selected?.length > 0;

  if(!historyEntries || historyEntries.length === 0) {
    return (
      <Surface style={styles.container}>
        <HistoryImportEmptyState />
      </Surface>
    );
  }
  
  return (
    <Surface style={styles.container}>
      <Surface style={styles.controlsContainer}>
        <Searchbar placeholder="Search" onChangeText={setSearchQuery} value={searchQuery} />
        {isSelecting && (
          <Surface style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
            <Chip>{selected?.length} Selected</Chip>
            <HistoryDelete selected={selected} setSelected={setSelected} />
            <Checkbox
              status={isAllSelected ? "checked" : "unchecked"}
              onPress={() => {
                if (isAllSelected) {
                  setSelected([]);
                } else {
                  setSelected(filteredEntries.map((item) => item.id));
                }
              }}
            />
          </Surface>
        )}
      </Surface>
      
      {/* Wrap the list in a ScrollView to make it scrollable */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 80 }}>
        <List.Section style={styles.listSection}>
          {filteredEntries.length === 0 ? (
            <Surface style={styles.emptyState}>
              <List.Item 
                title="No history entries found" 
                description="Try adding a new entry or changing your search"
              />
            </Surface>
          ) : (
            filteredEntries.map((entry) => {
              const isItemSelected = selected?.includes(entry.id);
              return (
                <List.Item
                  onLongPress={() => handlelongPress(entry.id)}
                  onPress={() => handlePressOnce(entry)}
                  rippleColor={colors.primary}
                  key={entry.id}
                  title={entry.name}
                  style={{
                    ...styles.listItem,
                    backgroundColor: isItemSelected ? colors.inversePrimary : colors.elevation.level4,
                  }}
                  description={`${entry.number} ${formatDate(entry.date)}`}
                  left={(props) => <Avatar.Text size={40} label={entry.name?.[0]} />}
                  right={(props) => <HistoryFormUpdate item={entry} />}
                />
              );
            })
          )}
        </List.Section>
      </ScrollView>
      
      <HistoryFormCreate />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 1,
    paddingHorizontal: 4,
  },
  controlsContainer: {
    elevation: 1,
  },
  listSection: {
    paddingVertical: 8,
    gap: 4,
  },
  listItem: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  }
});
