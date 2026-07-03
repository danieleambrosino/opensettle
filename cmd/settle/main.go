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
	balances := service.ComputeBalances(obligations)
	settlements := service.ComputeMinimalSettlementSet(balances)
	err = writeSettlements(os.Stdout, settlements)
	if err != nil {
		log.Fatal(err)
	}
}

func readExpenses(r io.Reader) ([]types.Expense, error) {
	var expenses []types.Expense
	err := json.NewDecoder(r).Decode(&expenses)
	return expenses, err
}

func writeSettlements(w io.Writer, settlements []types.Settlement) error {
	return json.NewEncoder(w).Encode(settlements)
}
