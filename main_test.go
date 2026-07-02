package main

import "testing"

func TestComputeBalances(t *testing.T) {
	debits := []Obligation{
		{
			From:   "s",
			To:     "d",
			Amount: 20,
		},
		{
			From:   "i",
			To:     "d",
			Amount: 20,
		},
		{
			From:   "d",
			To:     "s",
			Amount: 2,
		},
		{
			From:   "i",
			To:     "s",
			Amount: 2,
		},
	}
	nets := computeBalances(debits)
	for _, n := range nets {
		t.Logf("%s %d", n.Person, n.Amount)
	}
	if len(nets) != 3 {
		t.Error("nets should be 3")
	}
	if nets[0].Person != "i" {
		t.FailNow()
	}
	if nets[0].Amount != -22 {
		t.FailNow()
	}
	if nets[1].Person != "s" {
		t.FailNow()
	}
	if nets[1].Amount != -16 {
		t.FailNow()
	}
	if nets[2].Person != "d" {
		t.FailNow()
	}
	if nets[2].Amount != 38 {
		t.FailNow()
	}
}

func TestComputeMinimalTransactionSet(t *testing.T) {
	nets := []Balance{
		{
			Person: "i",
			Amount: -22,
		},
		{
			Person: "s",
			Amount: -16,
		},
		{
			Person: "d",
			Amount: 38,
		},
	}
	debts := computeMinimalSettlementSet(nets)
	for _, d := range debts {
		t.Logf("%s -> %s: %d", d.From, d.To, d.Amount)
	}
	if len(debts) != 2 {
		t.FailNow()
	}
}
