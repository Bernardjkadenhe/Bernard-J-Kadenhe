import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db, collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, where, handleFirestoreError, OperationType } from './firebase';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  color: string;
  size: string;
  price: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, color: string, size: string, price: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  total: number;
  subtotal: number;
  discount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!user) {
      setItems([]);
      return;
    }

    const path = `carts/${user.uid}/items`;
    const q = query(collection(db, path));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cartItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
      setItems(cartItems);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [user]);

  const addToCart = async (productId: string, color: string, size: string, price: number) => {
    if (!user) return;
    await addDoc(collection(db, `carts/${user.uid}/items`), {
      productId,
      color,
      size,
      quantity: 1,
      price
    });
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;
    await deleteDoc(doc(db, `carts/${user.uid}/items`, itemId));
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || quantity < 1) return;
    await updateDoc(doc(db, `carts/${user.uid}/items`, itemId), { quantity });
  };

  const clearCart = async () => {
    if (!user) return;
    const promises = items.map(item => deleteDoc(doc(db, `carts/${user.uid}/items`, item.id)));
    await Promise.all(promises);
  };

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Bulk discount: $1 discount per item if 2 or more items total
  const discountPerItem = totalQuantity >= 2 ? 1 : 0;
  const discount = totalQuantity * discountPerItem;
  const total = subtotal - discount;

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, subtotal, discount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
