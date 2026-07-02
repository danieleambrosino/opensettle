package main

import (
	"cmp"
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
	nets := make(map[PersonID]int)
	for _, o := range obligations {
		nets[o.To] += int(o.Amount)
		nets[o.From] -= int(o.Amount)
	}
	res := make([]Balance, 0, len(nets))
	for id, amt := range nets {
		res = append(res, Balance{
			Person: id,
			Amount: Cents(amt),
		})
	}
	slices.SortFunc(res, func(n, m Balance) int {
		return cmp.Compare(n.Amount, m.Amount)
	})
	return res
}

// nets is assumed to be sorted by amount
func computeMinimalSettlementSet(balances []Balance) []Settlement {
	debitorIndex := 0
	creditorIndex := len(balances) - 1
	settlements := make([]Settlement, 0)
	for debitorIndex < creditorIndex {
		log.Printf("%v", balances)
		amount := min(-balances[debitorIndex].Amount, balances[creditorIndex].Amount)
		settlements = append(settlements, Settlement{
			From:   balances[debitorIndex].Person,
			To:     balances[creditorIndex].Person,
			Amount: UnsignedCents(amount),
		})
		balances[debitorIndex].Amount += amount
		balances[creditorIndex].Amount -= amount
		if balances[debitorIndex].Amount == 0 {
			debitorIndex++
		}
		if balances[creditorIndex].Amount == 0 {
			creditorIndex--
		}
	}
	return settlements
}

func encodeSettlements(w io.Writer, settlements []Settlement) error {
	encoder := json.NewEncoder(w)
	return encoder.Encode(settlements)
}
