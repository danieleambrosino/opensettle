package cli

import (
	"encoding/json"
	"io"

	"danieleambrosino.it/opensettle/internal/types"
)

func ReadExpenses(r io.Reader) ([]types.Expense, error) {
	var expenses []types.Expense
	err := json.NewDecoder(r).Decode(&expenses)
	return expenses, err
}

func ReadObligations(r io.Reader) ([]types.Obligation, error) {
	var obligations []types.Obligation
	err := json.NewDecoder(r).Decode(&obligations)
	return obligations, err
}

func WriteObligations(w io.Writer, obligations []types.Obligation) error {
	return json.NewEncoder(w).Encode(obligations)
}

func WriteSettlements(w io.Writer, settlements []types.Settlement) error {
	return json.NewEncoder(w).Encode(settlements)
}
