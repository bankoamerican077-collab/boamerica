export interface Account {
	id: string;
	name: string;
	type: "checking" | "savings" | "credit";
	accountNumber: string;
	balance: number;
	availableBalance: number;
}

export interface Transaction {
	id: string;
	accountId: string;
	date: string;
	merchant: string;
	category: string;
	amount: number;
	type: "debit" | "credit";
	status: "completed" | "pending";
	discription?:string
}

export interface User {
	id: string;
	username: string;
	password: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
}

export const mockUser: User = {
	id: "1",
	username: "demo",
	password: "demo123",
	firstName: "John",
	lastName: "Smith",
	email: "john.smith@email.com",
	phone: "(555) 123-4567",
};

export const mockAccounts: Account[] = [
	{
		id: "acc-1",
		name: "Advantage Plus Banking",
		type: "checking",
		accountNumber: "****4521",
		balance: 8742.5,
		availableBalance: 8742.5,
	},
	{
		id: "acc-2",
		name: "Advantage Savings",
		type: "savings",
		accountNumber: "****7893",
		balance: 24567.89,
		availableBalance: 24567.89,
	},
	{
		id: "acc-3",
		name: "BankAmericard Credit Card",
		type: "credit",
		accountNumber: "****3214",
		balance: -1243.76,
		availableBalance: 8756.24,
	},
];

export const mockTransactions: Transaction[] = [
	{
		id: "txn-1",
		accountId: "acc-1",
		date: "2025-11-04",
		merchant: "Amazon.com",
		category: "Shopping",
		amount: -89.99,
		type: "debit",
		status: "completed",
	},
	{
		id: "txn-2",
		accountId: "acc-1",
		date: "2025-11-04",
		merchant: "Starbucks",
		category: "Food & Drink",
		amount: -5.45,
		type: "debit",
		status: "completed",
	},
	{
		id: "txn-3",
		accountId: "acc-1",
		date: "2025-11-03",
		merchant: "Payroll Deposit",
		category: "Income",
		amount: 3200.0,
		type: "credit",
		status: "completed",
	},
	{
		id: "txn-4",
		accountId: "acc-1",
		date: "2025-11-03",
		merchant: "Shell Gas Station",
		category: "Gas & Transportation",
		amount: -52.3,
		type: "debit",
		status: "completed",
	},
	{
		id: "txn-5",
		accountId: "acc-2",
		date: "2025-11-02",
		merchant: "Transfer from Checking",
		category: "Transfer",
		amount: 500.0,
		type: "credit",
		status: "completed",
	},
	{
		id: "txn-6",
		accountId: "acc-1",
		date: "2025-11-02",
		merchant: "Whole Foods",
		category: "Groceries",
		amount: -127.54,
		type: "debit",
		status: "completed",
	},
	{
		id: "txn-7",
		accountId: "acc-3",
		date: "2025-11-01",
		merchant: "Netflix",
		category: "Entertainment",
		amount: -15.99,
		type: "debit",
		status: "completed",
	},
	{
		id: "txn-8",
		accountId: "acc-1",
		date: "2025-11-01",
		merchant: "Target",
		category: "Shopping",
		amount: -43.21,
		type: "debit",
		status: "completed",
	},
	{
		id: "txn-9",
		accountId: "acc-1",
		date: "2025-10-31",
		merchant: "Uber",
		category: "Transportation",
		amount: -18.5,
		type: "debit",
		status: "completed",
	},
	{
		id: "txn-10",
		accountId: "acc-1",
		date: "2025-10-31",
		merchant: "CVS Pharmacy",
		category: "Health",
		amount: -34.67,
		type: "debit",
		status: "completed",
	},
];
