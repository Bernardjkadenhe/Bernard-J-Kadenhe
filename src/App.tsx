import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Offers from './pages/Offers';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import AIFittingBot from './pages/AIFittingBot';
import { seedProducts } from './firebase';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ErrorBoundary>
          <Router>
            <div className="flex flex-col min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-900">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/offers" element={<Offers />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/fitting" element={<AIFittingBot />} />
                </Routes>
              </main>
              <Footer />
              <Toaster position="top-center" richColors closeButton />
            </div>
          </Router>
        </ErrorBoundary>
      </CartProvider>
    </AuthProvider>
  );
}
