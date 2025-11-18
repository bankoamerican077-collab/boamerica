// lib/firebaseUtils/getUserDoc.ts
import {
	doc,
	getDoc,
	addDoc,
	serverTimestamp,
	updateDoc,
	increment,
	arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase"; // adjust the import based on your setup
import { collection, getDocs, query, where } from "firebase/firestore";


export interface Transaction {
	id: string;
	accountId: string;
	date: string;
	merchant: string;
	category: string;
	amount: number;
	type: "debit" | "credit";
	status: "completed" | "pending";
    discription?: string
}

export const getAllTransactionHistory = async (): Promise<Transaction[]> => {
	try {
		const nftsRef = collection(db, "transaction");
		const querySnapshot = await getDocs(nftsRef);
		const nfts: Transaction[] = [];

		querySnapshot.forEach((doc) => {
			nfts.push({ id: doc.id, ...doc.data() } as Transaction);
		});

		return nfts;
	} catch (error) {
		console.error("Error fetching all NFTs:", error);
		return [];
	}
};