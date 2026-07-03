export interface Transaction {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  co2: number;
}

// Type for creating a new transaction (omits the database-generated ID)
export type NewTransactionInput = Omit<Transaction, 'id'>;