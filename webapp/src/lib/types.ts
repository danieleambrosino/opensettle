export type PersonID = string;
export type UnsignedCents = number;
export type Cents = number;

interface Transaction {
  amount: UnsignedCents;
  from: PersonID;
  to: PersonID;
}

export type Obligation = Transaction;
export type Settlement = Transaction;

export interface Balance {
  amount: Cents;
  person: PersonID;
}

interface Participant {
  amount: UnsignedCents | null;
  person: PersonID;
}

export interface Expense {
  amount: UnsignedCents;
  participants: Participant[];
  payer: PersonID;
}
