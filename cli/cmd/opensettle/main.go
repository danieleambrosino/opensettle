package main

import (
	"bytes"
	"io"
	"log"
	"os"

	"danieleambrosino.it/opensettle/internal/cli"
	"danieleambrosino.it/opensettle/internal/service"
)

func main() {
	args := os.Args[1:]

	if len(args) >= 1 && args[0] == "split" {
		runSplit(os.Stdin, os.Stdout)
		return
	}

	if len(args) >= 1 && args[0] == "minimize" {
		runMinimize(os.Stdin, os.Stdout)
		return
	}

	if len(args) >= 1 {
		log.Fatalf("unknown subcommand: %s\n", args[0])
	}

	runSettle(os.Stdin, os.Stdout)
}

func runSettle(r io.Reader, w io.Writer) {
	var buf bytes.Buffer
	runSplit(r, &buf)
	runMinimize(&buf, w)
}

func runSplit(r io.Reader, w io.Writer) {
	expenses, err := cli.ReadExpenses(r)
	if err != nil {
		log.Fatal(err)
	}
	err = cli.WriteObligations(w, service.SplitExpenses(expenses))
	if err != nil {
		log.Fatal(err)
	}
}

func runMinimize(r io.Reader, w io.Writer) {
	obligations, err := cli.ReadObligations(r)
	if err != nil {
		log.Fatal(err)
	}
	balances := service.ComputeBalances(obligations)
	err = cli.WriteSettlements(w, service.ComputeMinimalSettlementSet(balances))
	if err != nil {
		log.Fatal(err)
	}
}
