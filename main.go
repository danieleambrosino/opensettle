package main

import (
	"cmp"
	"container/heap"
	"encoding/json"
	"io"
	"log"
	"os"
	"slices"
)

type PersonID string
type UnsignedCents uint
type Cents int

type Transaction struct {
	From   PersonID      `json:"from"`
	To     PersonID      `json:"to"`
	Amount UnsignedCents `json:"amount"`
}

type Obligation Transaction
type Settlement Transaction

type Balance struct {
	Person PersonID
	Amount Cents
}

type BalanceHeap []Balance

func (h BalanceHeap) Len() int           { return len(h) }
func (h BalanceHeap) Less(i, j int) bool { return h[i].Amount > h[j].Amount } // Max-heap
func (h BalanceHeap) Swap(i, j int)      { h[i], h[j] = h[j], h[i] }
func (h *BalanceHeap) Push(x any)        { *h = append(*h, x.(Balance)) }
func (h *BalanceHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func main() {
	obligations, err := loadObligations(os.Stdin)
	if err != nil {
		log.Fatal(err)
	}
	balances := computeBalances(obligations)
	settlements := computeMinimalSettlementSet(balances)
	err = encodeSettlements(os.Stdout, settlements)
	if err != nil {
		log.Fatal(err)
	}
}

func loadObligations(reader io.Reader) ([]Obligation, error) {
	var obligations []Obligation
	decoder := json.NewDecoder(reader)
	err := decoder.Decode(&obligations)
	return obligations, err
}

func computeBalances(obligations []Obligation) []Balance {
	balancesMap := make(map[PersonID]int)
	for _, o := range obligations {
		balancesMap[o.To] += int(o.Amount)
		balancesMap[o.From] -= int(o.Amount)
	}
	balances := make([]Balance, 0, len(balancesMap))
	for id, amt := range balancesMap {
		balances = append(balances, Balance{
			Person: id,
			Amount: Cents(amt),
		})
	}
	slices.SortFunc(balances, func(a, b Balance) int {
		equals := cmp.Compare(a.Amount, b.Amount)
		if equals != 0 {
			return equals
		}
		return cmp.Compare(a.Person, b.Person)
	})
	return balances
}

// nets is assumed to be sorted by amount
func computeMinimalSettlementSet(balances []Balance) []Settlement {
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

	settlements := make([]Settlement, 0)

	for debtors.Len() > 0 && creditors.Len() > 0 {
		d := heap.Pop(debtors).(Balance)
		c := heap.Pop(creditors).(Balance)

		amount := min(d.Amount, c.Amount)
		settlements = append(settlements, Settlement{
			From:   d.Person,
			To:     c.Person,
			Amount: UnsignedCents(amount),
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

func encodeSettlements(w io.Writer, settlements []Settlement) error {
	encoder := json.NewEncoder(w)
	return encoder.Encode(settlements)
}
