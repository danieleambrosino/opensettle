package settlements

import (
	"testing"

	"danieleambrosino.it/debt-minimizer/internal/types"
)

func TestComputeMinimalSettlementSet(t *testing.T) {
	balances := []types.Balance{
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
	settlements := ComputeMinimalSettlementSet(balances)
	if len(settlements) != 2 {
		t.FailNow()
	}
}
