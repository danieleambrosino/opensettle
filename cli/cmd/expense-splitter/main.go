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
	err = cli.WriteObligations(os.Stdout, obligations)
	if err != nil {
		log.Fatal(err)
	}
}
