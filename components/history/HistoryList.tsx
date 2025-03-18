import React from "react";
import { StyleSheet } from "react-native";
import { List, Surface } from "react-native-paper";

// Define the transaction type
type Transaction = {
  id: string;
  name: string;
  number: string;
  createdAt: string;
  updatedAt: string;
};

// Dummy data
const dummyTransactions: Transaction[] = [
  {
    id: "1",
    name: "John Doe",
    number: "+254712345678",
    createdAt: "2023-07-20T10:00:00Z",
    updatedAt: "2023-07-20T10:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    number: "+254723456789",
    createdAt: "2023-07-20T09:30:00Z",
    updatedAt: "2023-07-20T09:30:00Z",
  },
  {
    id: "3",
    name: "Mike Johnson",
    number: "+254734567890",
    createdAt: "2023-07-20T09:00:00Z",
    updatedAt: "2023-07-20T09:00:00Z",
  },
];

export function HistoryList(): JSX.Element {
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString();
  }

  return (
    <Surface style={styles.container}>
      <List.Section>
        <List.Subheader>Transaction History</List.Subheader>
        {dummyTransactions.map((transaction) => (
          <List.Item
            key={transaction.id}
            title={transaction.name}
            description={`${transaction.number}\nCreated: ${formatDate(
              transaction.createdAt
            )}\nUpdated: ${formatDate(transaction.updatedAt)}`}
            left={(props) => <List.Icon {...props} icon="history" />}
          />
        ))}
      </List.Section>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    elevation: 1,
  },
});
