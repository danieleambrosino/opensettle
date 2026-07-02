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
	balances := computeBalances(debits)
	t.Logf("%v", balances)
	if len(balances) != 3 {
		t.Error("balances should be 3")
	}
	if balances[0].Person != "i" {
		t.FailNow()
	}
	if balances[0].Amount != -22 {
		t.FailNow()
	}
	if balances[1].Person != "s" {
		t.FailNow()
	}
	if balances[1].Amount != -16 {
		t.FailNow()
	}
	if balances[2].Person != "d" {
		t.FailNow()
	}
	if balances[2].Amount != 38 {
		t.FailNow()
	}
}

func TestComputeMinimalSettlementSet(t *testing.T) {
	balances := []Balance{
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
	settlements := computeMinimalSettlementSet(balances)
	for _, s := range settlements {
		t.Logf("%s -> %s: %d", s.From, s.To, s.Amount)
	}
	if len(settlements) != 2 {
		t.FailNow()
	}
}
