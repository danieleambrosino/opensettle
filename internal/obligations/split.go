package obligations

import "danieleambrosino.it/debt-minimizer/internal/types"

func SplitExpenses(expenses []types.Expense) []types.Obligation {
	var out []types.Obligation
	for _, e := range expenses {
		n := len(e.Participants)
		share := int(e.Amount) / n
		rem := int(e.Amount) % n

		for _, participant := range e.Participants {
			if participant == e.Payer {
				continue
			}

			extra := 0
			if rem > 0 {
				extra = 1
				rem--
			}

			out = append(out, types.Obligation{
				From:   participant,
				To:     e.Payer,
				Amount: types.UnsignedCents(share + extra),
			})
		}
	}
	return out
}
