package service

import (
	"cmp"
	"slices"

	"danieleambrosino.it/opensettle/internal/types"
)

func ComputeBalances(obligations []types.Obligation) []types.Balance {
	balancesMap := make(map[types.PersonID]types.Cents)
	for _, o := range obligations {
		balancesMap[o.To] += types.Cents(o.Amount)
		balancesMap[o.From] -= types.Cents(o.Amount)
	}
	balances := make([]types.Balance, 0, len(balancesMap))
	for id, amt := range balancesMap {
		balances = append(balances, types.Balance{
			Person: id,
			Amount: amt,
		})
	}
	slices.SortFunc(balances, func(a, b types.Balance) int {
		comparison := cmp.Compare(a.Amount, b.Amount)
		if comparison != 0 {
			return comparison
		}
		return cmp.Compare(a.Person, b.Person)
	})
	return balances
}
