import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, provider } from "./firebase-config";
import { useAuthStore } from "../store";

export const authenticateWithGoogle = async (role: string) => {
  try {
    console.log("🚀 Starting popup sign in...");
    const result = await signInWithPopup(auth, provider);

    console.log("✅ Sign in successful:", result.user.email);

    const userRef = doc(db, "users", result.user.uid);
    let userData: any;

    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.log("📝 Creating user doc with role:", role);

      userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        role,
        createdAt: serverTimestamp(),
      };

      await setDoc(userRef, userData);
      console.log("✅ User doc created successfully");
    } else {
      userData = snap.data();
      console.log("✅ User doc already exists:", userData);
    }

    // ✅ NEW: write user into Zustand immediately
    useAuthStore.getState().setAuth(result.user, {
      uid: result.user.uid,
      role: userData.role,
    });

    return {
      firebaseUser: result.user,
      user: userData,
    };
  } catch (error: any) {
    console.error("❌ Sign in error:", error.code, error.message);
    throw error;
  }
};

export const checkCurrentUser = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.log("❌ No user is currently signed in");
    return null;
  }

  console.log("👤 Current user:", {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  });

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.log("❌ User document does NOT exist in Firestore");
      return null;
    }

    const userData = snap.data();
    console.log("✅ User document found in Firestore:", userData);
    console.log(userData);
    return userData;
  } catch (error) {
    console.error("❌ Error checking Firestore:", error);
    return null;
  }
};
