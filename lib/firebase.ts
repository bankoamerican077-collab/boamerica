// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { enableIndexedDbPersistence, getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtPAjqhZbQLjDhpLzZ87FsQ4wXmpl6m2M",
    authDomain: "boamerica-632fe.firebaseapp.com",
    projectId: "boamerica-632fe",
    storageBucket: "boamerica-632fe.firebasestorage.app",
    messagingSenderId: "941726368240",
    appId: "1:941726368240:web:57b7a60a1dbf91ee531d35"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


enableIndexedDbPersistence(db)
	.then(() => console.log("offline persistance enabled"))
	.catch((err) => {
		if (err.code === "failed-precondition" || err.code === "unimplimented")
			console.log("error while caching");
	});