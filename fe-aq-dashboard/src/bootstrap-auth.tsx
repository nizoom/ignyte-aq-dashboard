// AuthBootstrap.tsx
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./auth/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { useAuthStore } from "./store";

export const AuthBootstrap = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    setLoading(true);

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setAuth(null, null);
        return;
      }

      const snap = await getDoc(doc(db, "users", fbUser.uid));
      if (snap.exists()) {
        setAuth(fbUser, {
          uid: fbUser.uid,
          ...(snap.data() as any),
        });
      } else {
        // optional: handle missing user doc
        setAuth(fbUser, null);
      }
    });

    return () => unsub();
  }, []);

  return null;
};
