import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    deleteDoc,
    doc,
    orderBy,
    serverTimestamp,
    updateDoc
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// Collection reference helper
const getTransactionsCollection = (userId) => collection(db, "users", userId, "transactions");

export const TransactionService = {
    // Add a new transaction
    addTransaction: async (userId, transaction) => {
        try {
            console.log("Adding transaction for user:", userId);
            console.log("Transaction data:", transaction);

            if (!userId) throw new Error("User ID is missing");
            if (!transaction) throw new Error("Transaction data is missing");

            const amount = Number(transaction.amount);
            if (isNaN(amount)) throw new Error("Invalid amount: " + transaction.amount);

            const docRef = await addDoc(getTransactionsCollection(userId), {
                ...transaction,
                amount: amount,
                createdAt: serverTimestamp()
            });
            console.log("Transaction added with ID:", docRef.id);
            return { id: docRef.id, ...transaction };
        } catch (error) {
            console.error("Error adding transaction: ", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            throw error;
        }
    },

    // Get all transactions for a user
    getTransactions: async (userId) => {
        try {
            const q = query(
                getTransactionsCollection(userId),
                orderBy("date", "desc")
            );

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Error getting transactions: ", error);
            throw error;
        }
    },

    // Delete a transaction
    deleteTransaction: async (userId, transactionId) => {
        try {
            const transactionRef = doc(db, "users", userId, "transactions", transactionId);
            await deleteDoc(transactionRef);
        } catch (error) {
            console.error("Error deleting transaction: ", error);
            throw error;
        }
    },

    // Update a transaction
    updateTransaction: async (userId, transactionId, updatedData) => {
        try {
            const transactionRef = doc(db, "users", userId, "transactions", transactionId);
            await updateDoc(transactionRef, updatedData);
            return { id: transactionId, ...updatedData };
        } catch (error) {
            console.error("Error updating transaction: ", error);
            throw error;
        }
    }
};
