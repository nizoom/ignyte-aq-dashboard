// auth/signin-form.ts
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, provider, db } from "./firebase-config";

export const authenticateWithGoogle = async (role: string) => {
  try {
    console.log("🚀 Starting popup sign in...");
    const result = await signInWithPopup(auth, provider);

    console.log("✅ Sign in successful:", result.user.email);

    // Save user to Firestore
    const userRef = doc(db, "users", result.user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      console.log("📝 Creating user doc with role:", role);
      await setDoc(userRef, {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        role,
        createdAt: serverTimestamp(),
      });
      console.log("✅ User doc created successfully");
    } else {
      console.log("✅ User doc already exists:", snap.data());
    }

    return result.user;
  } catch (error: any) {
    console.error("❌ Sign in error:", error.code, error.message);

    // The COOP error appears but auth might still work
    // Check if user was actually signed in despite the error
    setTimeout(async () => {
      if (auth.currentUser) {
        console.log("✅ User signed in despite error!");
        const userRef = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(userRef);

        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: auth.currentUser.uid,
            email: auth.currentUser.email,
            displayName: auth.currentUser.displayName,
            role,
            createdAt: serverTimestamp(),
          });
        }
      }
    }, 1000);

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
