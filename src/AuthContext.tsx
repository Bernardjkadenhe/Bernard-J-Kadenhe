import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, db, doc, getDoc, setDoc, handleFirestoreError, OperationType } from './firebase';
import { User } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const path = `users/${user.uid}`;
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              createdAt: new Date().toISOString(),
              role: 'user'
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, path);
        }
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
