"use client";

import * as React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { NewTransactionInput, Transaction } from "@/app/types/transaction";
import { formatTransactionDate } from "@/app/utils/dateFormatter";
import NewTransactionModal from "../components/transactions/NewTransactionModal";

export default function TransactionsPage() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("All");

  // Strictly typed state array matching our core Transaction schema
  const [transactions, setTransactions] = React.useState<Transaction[]>([
    {
      id: 1,
      date: "2026-07-03",
      description: "Grocery Store Purchase",
      category: "Food",
      amount: -65.4,
      co2: 12.4,
    },
    {
      id: 2,
      date: "2026-07-02",
      description: "Monthly Train Pass",
      category: "Transport",
      amount: -45.0,
      co2: 1.2,
    },
    {
      id: 3,
      date: "2026-06-30",
      description: "Freelance Design Payment",
      category: "Income",
      amount: 850.0,
      co2: 0.0,
    },
    {
      id: 4,
      date: "2026-06-28",
      description: "Electric Utility Bill",
      category: "Utilities",
      amount: -82.1,
      co2: 24.5,
    },
    {
      id: 5,
      date: "2026-06-25",
      description: "Dinner with friends",
      category: "Leisure",
      amount: -35.0,
      co2: 5.8,
    },
  ]);

  const handleAddTransaction = (newTx: NewTransactionInput) => {
    const transactionWithId: Transaction = {
      ...newTx,
      id:
        transactions.length > 0
          ? Math.max(...transactions.map((t) => t.id)) + 1
          : 1,
    };
    setTransactions([transactionWithId, ...transactions]);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            Transactions Ledger
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage, filter, and track your financial logs alongside their
            environmental impacts.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          Add Transaction
        </Button>
      </Box>

      <Card
        sx={{
          border: "none",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
          mb: 4,
        }}
      >
        <CardContent>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Search by description..."
                variant="outlined"
                fullWidth
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Category Filter"
                select
                fullWidth
                size="small"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {[
                  "All",
                  "Food",
                  "Transport",
                  "Utilities",
                  "Income",
                  "Leisure",
                ].map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer
        component={Paper}
        sx={{
          border: "none",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Table
          aria-label="all transactions ledger table"
          sx={{ minWidth: 700 }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Amount
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                CO2 Impact
              </TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTransactions.map((tx) => (
              <TableRow
                key={tx.id}
                hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell sx={{ color: "text.secondary", fontWeight: 500 }}>
                  {formatTransactionDate(tx.date)}
                </TableCell>
                <TableCell sx={{ fontWeight: 500 }}>{tx.description}</TableCell>
                <TableCell>
                  <Chip
                    label={tx.category}
                    size="small"
                    color={tx.category === "Income" ? "success" : "default"}
                    variant="outlined"
                    sx={{ fontWeight: 500 }}
                  />
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: "bold",
                    color: tx.amount > 0 ? "success.main" : "text.primary",
                  }}
                >
                  {tx.amount > 0
                    ? `+€ ${tx.amount.toFixed(2)}`
                    : `-€ ${Math.abs(tx.amount).toFixed(2)}`}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 500,
                    color: tx.co2 > 15 ? "error.main" : "text.secondary",
                  }}
                >
                  {tx.co2 > 0 ? `${tx.co2} kg` : "0 kg"}
                </TableCell>
                <TableCell align="center">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteTransaction(tx.id)}
                    aria-label="delete transaction"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredTransactions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{ py: 4, color: "text.secondary" }}
                >
                  No transactions found matching the filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <NewTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleAddTransaction}
      />
    </Box>
  );
}
