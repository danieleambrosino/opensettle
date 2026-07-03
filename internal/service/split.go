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

	type share struct {
		person types.PersonID
		amount int
	}
	shares := make([]share, 0, len(e.Participants))
	var equalParties []types.PersonID

	for _, p := range e.Participants {
		if p.Amount != nil {
			s := min(int(*p.Amount), remaining)
			shares = append(shares, share{person: p.Person, amount: s})
			remaining -= s
		} else {
			equalParties = append(equalParties, p.Person)
		}
	}

	if m := len(equalParties); m > 0 {
		eq := remaining / m
		rem := remaining % m
		for _, p := range equalParties {
			extra := 0
			if rem > 0 {
				extra = 1
				rem--
			}
			shares = append(shares, share{person: p, amount: eq + extra})
		}
	}

	obligations := make([]types.Obligation, 0, len(shares))
	for _, s := range shares {
		if s.person == e.Payer || s.amount == 0 {
			continue
		}
		obligations = append(obligations, types.Obligation{
			From: s.person, To: e.Payer,
			Amount: types.UnsignedCents(s.amount),
		})
	}
	return obligations
}
