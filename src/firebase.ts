import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup, signOut, onAuthStateChanged, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, where, onSnapshot, addDoc, deleteDoc, updateDoc, serverTimestamp, getDocFromServer, writeBatch } from 'firebase/firestore';
import { PRODUCTS } from './constants';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Test connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection successful");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Firestore Error: The client is offline. Please check your Firebase configuration or internet connection.");
    } else {
      console.error("Firestore Connection Test Error:", error);
    }
  }
}
testConnection();

export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

export { signInWithPopup, signOut, onAuthStateChanged, collection, doc, setDoc, getDoc, getDocs, query, where, onSnapshot, addDoc, deleteDoc, updateDoc, serverTimestamp, RecaptchaVerifier, signInWithPhoneNumber };

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const seedProducts = async () => {
  try {
    // Clear existing products first
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    const deleteBatch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();

    // Seed new products
    const batch = writeBatch(db);
    for (const product of PRODUCTS) {
      const productRef = doc(db, 'products', product.id);
      batch.set(productRef, {
        ...product,
        updatedAt: new Date().toISOString()
      });
    }
    await batch.commit();
    console.log('Products seeded successfully');
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};
