import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, Checkbox, Chip, List, Searchbar, Surface, useTheme } from "react-native-paper";
// import { useLiveQuery } from "drizzle-orm/expo-sqlite";
// import { useDrizzle } from "@/db/useDrizzle";
// import { formatDate } from "@/utils/date";
// import { getHistory } from "@/db/data/history";
import { HistoryDelete } from "./HistoryDelete";
import { HistoryFormCreate } from "./HistoryFormCreate";
import { HistoryFormUpdate } from "./HistoryFormUpdate";
import {setStringAsync} from "expo-clipboard";
// import { InsertHistoryEntry } from "@/db/validators";

// TODO handle large lists with load more and add indexes to name and number

export function HistoryList(): JSX.Element {
  // const db = useDrizzle();
  // const [searchQuery, setSearchQuery] = React.useState("");
  // const [reaload, setReload] = React.useState(0);
  // const { data, error } = useLiveQuery(getHistory(db,searchQuery), [searchQuery, reaload]);

  const [selected, setSelected] = React.useState<number[] | null>(null);

  const handlelongPress = (id: number) => {
    setSelected([id]);
  };
  const handleAddOrRemoveOnPress = (id: number) => {
    if (!selected || selected?.length === 0) return;
    setSelected((prev) => {
      if (!prev) return [id];
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };
  const handlePressOnce = (item: InsertHistoryEntry) => {
        if (!selected || selected?.length === 0) {
         setStringAsync(item.number);
        }else{
          if(!item.id) return
          handleAddOrRemoveOnPress(item.id);
        }
  };

  const { colors } = useTheme();
  const isAllSelecetd = selected?.length === data.length;
  const isSelecting = selected && selected?.length > 0;
  return (
    <Surface style={styles.container}>
      <Surface style={styles.controlsContaner}>
        <Searchbar placeholder="Search" onChangeText={setSearchQuery} value={searchQuery} />
        {isSelecting && (
          <Surface style={{ flexDirection: "row", justifyContent: "space-between", padding: 8 }}>
            <Chip>{selected?.length} Selected</Chip>
            <HistoryDelete selected={selected} setReload={setReload} setSelected={setSelected} />
            <Checkbox
              status={isAllSelecetd ? "checked" : "unchecked"}
              onPress={() => {
                if (isAllSelecetd) {
                  setSelected([]);
                } else {
                  setSelected(data.map((item) => item.id));
                }
              }}
            />
          </Surface>
        )}
      </Surface>
      <List.Section style={styles.listSection}>
        {data.map((transaction) => {
          const isItemSelected = selected?.includes(transaction.id);
          return (
            <List.Item
              onLongPress={() => handlelongPress(transaction.id)}
              onPress={() => handlePressOnce(transaction)}
              rippleColor={colors.primary}
              key={transaction.id}
              title={transaction.name}
              style={{
                ...styles.listItem,
                backgroundColor: isItemSelected ? colors.inversePrimary : colors.elevation.level4,
              }}
              description={`${transaction.number} ${formatDate(transaction.createdAt)}`}
              left={(props) => <Avatar.Text size={40} label={transaction.name?.[0]} />}
              right={(props) => <HistoryFormUpdate item={transaction} />}
            />
          );
        })}
      </List.Section>
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
  controlsContaner: {
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
  },
});
