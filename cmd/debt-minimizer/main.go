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
	obligations, err := readObligations(os.Stdin)
	if err != nil {
		log.Fatal(err)
	}
	balances := service.ComputeBalances(obligations)
	settlements := service.ComputeMinimalSettlementSet(balances)
	err = writeSettlements(os.Stdout, settlements)
	if err != nil {
		log.Fatal(err)
	}
}

func readObligations(reader io.Reader) ([]types.Obligation, error) {
	var obligations []types.Obligation
	err := json.NewDecoder(reader).Decode(&obligations)
	return obligations, err
}

func writeSettlements(w io.Writer, settlements []types.Settlement) error {
	return json.NewEncoder(w).Encode(settlements)
}
