import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { signOut, auth } from '../firebase';
import { cn } from '../lib/utils';

const Navbar = () => {
  const { user } = useAuth();
  const { items } = useCart();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Offers', path: '/offers' },
    { name: 'Fitting Bot', path: '/fitting' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tighter text-white">
                BORN VICTORIOUS
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-orange-500",
                  location.pathname === link.path ? "text-orange-500" : "text-gray-300"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-300 hover:text-orange-500 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-orange-600 rounded-full">
                  {items.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <img 
                  src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`} 
                  alt={user.displayName || ''} 
                  className="h-8 w-8 rounded-full border border-white/10"
                />
                <button 
                  onClick={() => signOut(auth)}
                  className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link to="/auth" className="p-2 text-gray-300 hover:text-orange-500 transition-colors">
                <User className="h-6 w-6" />
              </Link>
            )}

            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-300"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path ? "bg-white/10 text-orange-500" : "text-gray-300 hover:bg-white/5"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
