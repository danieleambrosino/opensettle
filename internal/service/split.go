package service

import (
	"slices"

	"danieleambrosino.it/opensettle/internal/types"
)

func SplitExpenses(expenses []types.Expense) []types.Obligation {
	obligations := make([][]types.Obligation, len(expenses))
	for i, e := range expenses {
		obligations[i] = splitExpense(e)
	}
	return slices.Concat(obligations...)
}

func splitExpense(e types.Expense) []types.Obligation {
	total := int(e.Amount)
	remaining := total

	shares := make(map[types.PersonID]int)
	participantsWithEqualShares := make(map[types.PersonID]struct{})

	for _, p := range e.Participants {
		if p.Amount != nil {
			share := min(int(*p.Amount), remaining)
			shares[p.Person] += share
			remaining -= share
		} else {
			participantsWithEqualShares[p.Person] = struct{}{}
		}
	}

	if m := len(participantsWithEqualShares); m > 0 {
		eq := remaining / m
		rem := remaining % m
		for p := range participantsWithEqualShares {
			extra := 0
			if rem > 0 {
				extra = 1
				rem--
			}
			shares[p] = eq + extra
		}
	}

	obligations := make([]types.Obligation, 0, len(shares))
	for p, s := range shares {
		if p == e.Payer || s == 0 {
			continue
		}
		obligations = append(obligations, types.Obligation{
			From: p, To: e.Payer,
			Amount: types.UnsignedCents(s),
		})
	}
	return obligations
}
