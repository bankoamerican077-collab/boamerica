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


export interface TransactionType {
	refId: string;
	accountId: string;
	transactionId:number;
	date: string;
	merchant: string;
	description?: string
	category: string;
	amount: number;
	type: "debit" | "credit" | string;
	status: "completed" | "pending" | string;
}

export const getAllTransactionHistory = async (): Promise<TransactionType[]> => {
	try {
		const nftsRef = collection(db, "transaction");
		const querySnapshot = await getDocs(nftsRef);
		const nfts: TransactionType[] = [];

		querySnapshot.forEach((doc) => {
			nfts.push(doc.data()  as TransactionType);
		});

		return nfts;
	} catch (error) {
		console.error("Error fetching all transactions:", error);
		return [];
	}
};

export async function updateDocumentByRefId(
  collectionName: string,
  refId: string,
  updatedData: Record<string, any>
): Promise<boolean> {
  try {
    const q = query(
      collection(db, collectionName),
      where("refId", "==", refId)
    );

	console.log(refId);
	

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.error(`⚠ No document found with refId: ${refId}`);   
    }

    // Only take the first match
    const firstDoc = snapshot.docs[0];
    const docRef = doc(db, collectionName, firstDoc.id);

    await updateDoc(docRef, updatedData);

    return true;

  } catch (error) {
    console.error("Firestore update error:", error);
    throw error; // preserve actual error
  }
}

export async function storeTransactionDocumentData(data: TransactionType) {
	try {
		const docRef = await addDoc(collection(db, "transactions"), {
			...data,
			createdAt: serverTimestamp(),
		});
		console.log("Survey submitted with ID: ", docRef.id);
		return docRef.id;
	} catch (error) {
		console.error("Error adding survey: ", error);
		throw error;
	}
}