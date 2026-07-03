package main

import (
	"log"
	"os"

	"danieleambrosino.it/opensettle/internal/cli"
	"danieleambrosino.it/opensettle/internal/service"
)

func main() {
	obligations, err := cli.ReadObligations(os.Stdin)
	if err != nil {
		log.Fatal(err)
	}
	balances := service.ComputeBalances(obligations)
	settlements := service.ComputeMinimalSettlementSet(balances)
	err = cli.WriteSettlements(os.Stdout, settlements)
	if err != nil {
		log.Fatal(err)
	}
}
