import React from "react";
import { StyleSheet } from "react-native";
import { Avatar, List, Searchbar, Surface, useTheme } from "react-native-paper";
import { HistoryForm } from "./HistoryForm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { useDrizzle } from "@/db/useDrizzle";
import { formatDate } from "@/utils/date";


// TODO handle large lists with load more and add indexes to name and number

export function HistoryList(): JSX.Element {
  const db = useDrizzle();
  const [searchQuery, setSearchQuery] = React.useState("dennis");
  const { data, error } = useLiveQuery(
    db.query.historyTable.findMany({
      where(fields, { like, or }) {
        return or(like(fields.name, `%${searchQuery}%`), like(fields.number, `%${searchQuery}%`));
      },
    }),
    [searchQuery]
  );


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

  const { colors } = useTheme();
  return (
    <Surface style={styles.container}>
      <Surface style={styles.controlsContaner}>
        <Searchbar placeholder="Search" onChangeText={setSearchQuery} value={searchQuery} />
      </Surface>
      <List.Section style={styles.listSection}>
        {data.map((transaction) => {
          // console.log(" == transaction == ", transaction);
          const isItemSelected = selected?.includes(transaction.id);
          return (
            <List.Item
              onLongPress={() => handlelongPress(transaction.id)}
              onPress={() => handleAddOrRemoveOnPress(transaction.id)}
              rippleColor={colors.primary}
              key={transaction.id}
              title={transaction.name}
              style={{
                ...styles.listItem,
                backgroundColor: isItemSelected ? colors.inversePrimary : colors.elevation.level4,
              }}
              description={`${transaction.number} ${formatDate(transaction.createdAt)}`}
              left={(props) => <Avatar.Text size={40} label={transaction.name?.[0]} />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
            />
          );
        })}
      </List.Section>
      <HistoryForm />
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 1,
    paddingHorizontal: 16,
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
  },
});
