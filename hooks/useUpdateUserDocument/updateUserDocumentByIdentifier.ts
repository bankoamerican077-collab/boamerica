// lib/firestoreUtils.ts
import {
	collection,
	getDocs,
	query,
	where,
	updateDoc,
	doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type IdentifierField = "email" | "id" | "uid";

export const updateUserDocumentByIdentifier = async (
	collectionName: string,
	field: IdentifierField, // 👈 user specifies which field to query
	identifier: string, // value of the identifier
	updateData: Record<string, any>
): Promise<boolean> => {
	try {
		// Build the query based on the chosen field
		const q = query(
			collection(db, collectionName),
			where(field, "==", identifier)
		);
		const snapshot = await getDocs(q);

		if (snapshot.empty) {
			console.log(`No matching document found for ${field}:`, identifier);
			throw new Error(`No matching document found for ${field}: ${identifier}`);
		}

		const docSnapshot = snapshot.docs[0];
		const docRef = doc(db, collectionName, docSnapshot.id);

		await updateDoc(docRef, updateData);
		return true;
	} catch (error) {
		console.error("Error updating document:", error);
		return false;
	}
};
