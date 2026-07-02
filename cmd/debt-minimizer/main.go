package main

import (
	"encoding/json"
	"io"
	"log"
	"os"

	"danieleambrosino.it/debt-minimizer/internal/service"
	"danieleambrosino.it/debt-minimizer/internal/types"
)

func main() {
	obligationsList, err := readObligations(os.Stdin)
	if err != nil {
		log.Fatal(err)
	}
	balances := service.ComputeBalances(obligationsList)
	settlementsList := service.ComputeMinimalSettlementSet(balances)
	err = writeSettlements(os.Stdout, settlementsList)
	if err != nil {
		log.Fatal(err)
	}
}

func readObligations(reader io.Reader) ([]types.Obligation, error) {
	var obligations []types.Obligation
	decoder := json.NewDecoder(reader)
	err := decoder.Decode(&obligations)
	return obligations, err
}

func writeSettlements(w io.Writer, settlements []types.Settlement) error {
	encoder := json.NewEncoder(w)
	return encoder.Encode(settlements)
}
