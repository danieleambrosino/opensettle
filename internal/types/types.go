package types

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

type Participant struct {
	Person PersonID       `json:"person"`
	Amount *UnsignedCents `json:"amount,omitempty"`
}

type Expense struct {
	Payer        PersonID      `json:"payer"`
	Amount       UnsignedCents `json:"amount"`
	Participants []Participant `json:"participants"`
}
