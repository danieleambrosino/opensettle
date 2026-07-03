package main

import (
	"encoding/json"
	"io"
	"log"
	"os"

	"danieleambrosino.it/opensettle/internal/service"
	"danieleambrosino.it/opensettle/internal/types"
)

func main() {
	expenses, err := readExpenses(os.Stdin)
	if err != nil {
		log.Fatal(err)
	}
	obligations := service.SplitExpenses(expenses)
	err = writeObligations(os.Stdout, obligations)
	if err != nil {
		log.Fatal(err)
	}
}

func readExpenses(r io.Reader) ([]types.Expense, error) {
	var expenses []types.Expense
	err := json.NewDecoder(r).Decode(&expenses)
	return expenses, err
}

func writeObligations(w io.Writer, obligations []types.Obligation) error {
	return json.NewEncoder(w).Encode(obligations)
}
