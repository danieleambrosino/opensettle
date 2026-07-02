package main

import (
	"encoding/json"
	"io"
	"log"
	"os"

	"danieleambrosino.it/debt-minimizer/internal/obligations"
	"danieleambrosino.it/debt-minimizer/internal/types"
)

func main() {
	expenses, err := readExpenses(os.Stdin)
	if err != nil {
		log.Fatal(err)
	}
	obligations := obligations.SplitExpenses(expenses)
	err = writeObligations(os.Stdout, obligations)
	if err != nil {
		log.Fatal(err)
	}
}

func readExpenses(r io.Reader) ([]types.Expense, error) {
	var expenses []types.Expense
	decoder := json.NewDecoder(r)
	err := decoder.Decode(&expenses)
	return expenses, err
}

func writeObligations(w io.Writer, obligations []types.Obligation) error {
	encoder := json.NewEncoder(w)
	return encoder.Encode(obligations)
}
