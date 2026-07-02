package service

import (
	"testing"

	"danieleambrosino.it/opensettle/internal/types"
)

func TestComputeBalances(t *testing.T) {
	debits := []types.Obligation{
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
	balances := ComputeBalances(debits)
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
