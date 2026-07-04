package service

import (
	"slices"
	"testing"

	"danieleambrosino.it/opensettle/internal/types"
)

func u(c types.UnsignedCents) *types.UnsignedCents {
	return &c
}

func TestSplitExpenses_EqualSplit(t *testing.T) {
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 300,
			Participants: []types.Participant{
				{Person: "Alice"},
				{Person: "Bob"},
				{Person: "Charlie"},
			},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 2 {
		t.Fatalf("expected 2 obligations, got %d", len(ob))
	}
	for _, o := range ob {
		if o.To != "Alice" {
			t.Errorf("expected To=Alice, got %s", o.To)
		}
		if o.Amount != 100 {
			t.Errorf("expected Amount=100, got %d", o.Amount)
		}
	}
}

func TestSplitExpenses_FixedAmounts(t *testing.T) {
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 1000,
			Participants: []types.Participant{
				{Person: "Bob", Amount: u(400)},
				{Person: "Charlie", Amount: u(600)},
			},
		},
	}
	ob := SplitExpenses(expenses)
	expected := []types.Obligation{
		{From: "Bob", To: "Alice", Amount: 400},
		{From: "Charlie", To: "Alice", Amount: 600},
	}
	if !slices.Equal(ob, expected) {
		t.Fatalf("expected %v, got %v", expected, ob)
	}
}

func TestSplitExpenses_FixedCappedByRemaining(t *testing.T) {
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 500,
			Participants: []types.Participant{
				{Person: "Bob", Amount: u(1000)},
			},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 1 {
		t.Fatalf("expected 1 obligation, got %d", len(ob))
	}
	if ob[0].Amount != 500 {
		t.Errorf("expected Amount=500 (capped), got %d", ob[0].Amount)
	}
}

func TestSplitExpenses_PayerExcluded(t *testing.T) {
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 100,
			Participants: []types.Participant{
				{Person: "Alice"},
				{Person: "Bob"},
			},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 1 {
		t.Fatalf("expected 1 obligation, got %d", len(ob))
	}
	if ob[0].From != "Bob" {
		t.Errorf("expected From=Bob, got %s", ob[0].From)
	}
}

func TestSplitExpenses_CentsDistribution(t *testing.T) {
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 100,
			Participants: []types.Participant{
				{Person: "Bob"},
				{Person: "Charlie"},
				{Person: "Dave"},
			},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 3 {
		t.Fatalf("expected 3 obligations, got %d", len(ob))
	}
	// 100 / 3 = 33 each, 1 cent remainder → one person pays 34
	totals := map[types.PersonID]int{}
	for _, o := range ob {
		totals[o.From] = int(o.Amount)
	}
	if len(totals) != 3 {
		t.Fatalf("expected 3 debtors, got %d", len(totals))
	}
	sum := 0
	for _, v := range totals {
		sum += v
	}
	if sum != 100 {
		t.Errorf("obligations sum to %d, want 100", sum)
	}
}

func TestSplitExpenses_MixedFixedAndEqual(t *testing.T) {
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 1000,
			Participants: []types.Participant{
				{Person: "Bob", Amount: u(200)},
				{Person: "Charlie"},
				{Person: "Dave"},
				{Person: "Alice"},
			},
		},
	}
	ob := SplitExpenses(expenses)
	// Bob pays 200 fixed. Remaining 800 split equally among Charlie, Dave, and Alice.
	// 800 / 3 = 266 each, remainder 2 → first two (Charlie, Dave) get 267, Alice gets 266.
	// Alice is the payer so her share is skipped.
	expected := []types.Obligation{
		{From: "Bob", To: "Alice", Amount: 200},
		{From: "Charlie", To: "Alice", Amount: 267},
		{From: "Dave", To: "Alice", Amount: 267},
	}
	if !slices.Equal(ob, expected) {
		t.Fatalf("expected %v, got %v", expected, ob)
	}
}

func TestSplitExpenses_ZeroAmountObligationSkipped(t *testing.T) {
	// If a participant with a fixed amount is left with 0 after cap,
	// and the payer is the only other participant, the obligation
	// for amount=0 should be skipped.
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 0,
			Participants: []types.Participant{
				{Person: "Alice"},
				{Person: "Bob", Amount: u(100)},
			},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 0 {
		t.Errorf("expected 0 obligations, got %d", len(ob))
	}
}

func TestSplitExpenses_MultipleExpenses(t *testing.T) {
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 200,
			Participants: []types.Participant{
				{Person: "Alice"},
				{Person: "Bob"},
			},
		},
		{
			Payer:  "Bob",
			Amount: 300,
			Participants: []types.Participant{
				{Person: "Alice"},
				{Person: "Bob"},
				{Person: "Charlie"},
			},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 3 {
		t.Fatalf("expected 3 obligations, got %d", len(ob))
	}
}

func TestSplitExpenses_EmptyParticipants(t *testing.T) {
	expenses := []types.Expense{
		{
			Payer:        "Alice",
			Amount:       100,
			Participants: []types.Participant{},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 0 {
		t.Errorf("expected 0 obligations, got %d", len(ob))
	}
}

func TestSplitExpenses_ManyParticipantsWithFixed(t *testing.T) {
	// 16 people, payer is 4th in list, one person has a fixed lower share
	expenses := []types.Expense{
		{
			Payer:  "P4",
			Amount: 32000,
			Participants: []types.Participant{
				{Person: "P1"}, {Person: "P2"}, {Person: "P3"},
				{Person: "P4"}, {Person: "P5"}, {Person: "P6"},
				{Person: "P7"}, {Person: "P8"}, {Person: "P9"},
				{Person: "P10"}, {Person: "P11", Amount: u(1000)},
				{Person: "P12"}, {Person: "P13"}, {Person: "P14"},
				{Person: "P15"}, {Person: "P16"},
			},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 15 {
		t.Fatalf("expected 15 obligations, got %d", len(ob))
	}
	sum := types.UnsignedCents(0)
	for _, o := range ob {
		sum += o.Amount
	}
	// 31000 / 15 equal parties = 2066 each, remainder 10.
	// P4 (payer, 4th in list) gets 2066+1 = 2067, self-paid and skipped.
	// Obligations total = 32000 - 2067 = 29933.
	if sum != 29933 {
		t.Errorf("obligations sum to %d, want 29933", sum)
	}
}

func TestSplitExpenses_OnlyPayer(t *testing.T) {
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 100,
			Participants: []types.Participant{
				{Person: "Alice"},
			},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 0 {
		t.Errorf("expected 0 obligations, got %d", len(ob))
	}
}

func TestSplitExpenses_NoParticipants(t *testing.T) {
	// This shouldn't happen in practice, but handle gracefully
	expenses := []types.Expense{
		{
			Payer:  "Alice",
			Amount: 1000,
			Participants: []types.Participant{
				{Person: "Bob", Amount: u(500)},
			},
		},
	}
	ob := SplitExpenses(expenses)
	if len(ob) != 1 {
		t.Fatalf("expected 1 obligation, got %d", len(ob))
	}
	if ob[0].Amount != 500 {
		t.Errorf("expected Amount=500, got %d", ob[0].Amount)
	}
}
