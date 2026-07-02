package settlements

import (
	"container/heap"

	"danieleambrosino.it/debt-minimizer/internal/types"
)

type BalanceHeap []types.Balance

func (h BalanceHeap) Len() int           { return len(h) }
func (h BalanceHeap) Less(i, j int) bool { return h[i].Amount > h[j].Amount }
func (h BalanceHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *BalanceHeap) Push(x any)        { *h = append(*h, x.(types.Balance)) }
func (h *BalanceHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func ComputeMinimalSettlementSet(balances []types.Balance) []types.Settlement {
	debtors := &BalanceHeap{}
	creditors := &BalanceHeap{}
	for _, b := range balances {
		if b.Amount < 0 {
			b.Amount = -b.Amount
			heap.Push(debtors, b)
		} else if b.Amount > 0 {
			heap.Push(creditors, b)
		}
	}

	settlements := make([]types.Settlement, 0)

	for debtors.Len() > 0 && creditors.Len() > 0 {
		d := heap.Pop(debtors).(types.Balance)
		c := heap.Pop(creditors).(types.Balance)

		amount := min(d.Amount, c.Amount)
		settlements = append(settlements, types.Settlement{
			From:   d.Person,
			To:     c.Person,
			Amount: types.UnsignedCents(amount),
		})

		d.Amount -= amount
		c.Amount -= amount

		if d.Amount > 0 {
			heap.Push(debtors, d)
		}
		if c.Amount > 0 {
			heap.Push(creditors, c)
		}
	}
	return settlements
}
