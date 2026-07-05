package main

import (
	"log"
	"os"

	"danieleambrosino.it/opensettle/internal/cli"
	"danieleambrosino.it/opensettle/internal/service"
)

func main() {
	args := os.Args[1:]

	if len(args) == 1 && args[0] == "split" {
		expenses, err := cli.ReadExpenses(os.Stdin)
		if err != nil {
			log.Fatal(err)
		}
		obligations := service.SplitExpenses(expenses)
		err = cli.WriteObligations(os.Stdout, obligations)
		if err != nil {
			log.Fatal(err)
		}
		return
	}

	if len(args) == 1 && args[0] == "minimize" {
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
		return
	}

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
