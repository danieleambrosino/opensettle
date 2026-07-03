package main

import (
	"log"
	"os"

	"danieleambrosino.it/opensettle/internal/cli"
	"danieleambrosino.it/opensettle/internal/service"
)

func main() {
	expenses, err := cli.ReadExpenses(os.Stdin)
	if err != nil {
		log.Fatal(err)
	}
	obligations := service.SplitExpenses(expenses)
	balances := service.ComputeBalances(obligations)
	settlements := service.ComputeMinimalSettlementSet(balances)
	err = cli.WriteSettlements(os.Stdout, settlements)
	if err != nil {
		log.Fatal(err)
	}
}
