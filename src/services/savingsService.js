import { db } from "../firebase/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export const SavingsService = {
    // Get savings settings (income, target)
    getSavingsSettings: async (userId) => {
        try {
            const savingsRef = doc(db, "users", userId, "savings", "settings");
            const docSnap = await getDoc(savingsRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                return { income: 0, targetSavings: 0 };
            }
        } catch (error) {
            console.error("Error fetching savings settings:", error);
            throw error;
        }
    },

    // Update savings settings
    updateSavingsSettings: async (userId, settings) => {
        try {
            const savingsRef = doc(db, "users", userId, "savings", "settings");
            await setDoc(savingsRef, settings, { merge: true });
            return settings;
        } catch (error) {
            console.error("Error updating savings settings:", error);
            throw error;
        }
    }
};
