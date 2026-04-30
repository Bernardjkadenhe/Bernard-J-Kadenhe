import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, ShoppingCart, Star, MessageCircle } from 'lucide-react';
import { PRODUCTS, CONTACT_DETAILS } from '../constants';
import { db, collection, query, where, onSnapshot, handleFirestoreError, OperationType } from '../firebase';

const Home = () => {
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const path = 'reviews';
    const q = query(collection(db, path), where('productId', '==', PRODUCTS[0].id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviews = snapshot.docs.map(doc => doc.data());
      if (reviews.length > 0) {
        const avg = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
        setAverageRating(avg);
        setReviewCount(reviews.length);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-gray-900">
        <img 
          src="https://picsum.photos/seed/bv-hero/1920/1080" 
          alt="Born Victorious Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6"
          >
            BORN <span className="text-orange-500">VICTORIOUS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
          >
            The Winning Generation. Premium Christian apparel designed to inspire and empower your faith journey.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link 
              to="/shop" 
              className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all flex items-center group"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a 
              href={CONTACT_DETAILS.whatsapp.catalog}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all flex items-center"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              WhatsApp Catalog
            </a>
            <Link 
              to="/fitting" 
              className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full hover:bg-white/20 transition-all border border-white/20"
            >
              Try AI Fitting
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 rounded-3xl bg-orange-50 border border-orange-100">
              <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <p className="text-gray-600">Durable, comfortable t-shirts that stand the test of time and faith.</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-blue-50 border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Faith Focused</h3>
              <h3 className="text-xl font-bold mb-4">Faith Focused</h3>
              <p className="text-gray-600">Designs that reflect your Christian values and the Winning Generation.</p>
            </div>
            <div className="text-center p-8 rounded-3xl bg-green-50 border border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Fast Delivery</h3>
              <p className="text-gray-600">Reliable delivery services across Zimbabwe, calculated from CBD.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-4">NEW ARRIVALS</h2>
              <p className="text-gray-600">Check out our latest collection of t-shirts.</p>
            </div>
            <Link to="/shop" className="text-orange-600 font-bold hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS[0].images.slice(1, 5).map((img, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img 
                    src={img} 
                    alt={`Product ${idx}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    NEW
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-3 w-3 ${star <= Math.round(averageRating) ? 'text-orange-500 fill-orange-500' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">({reviewCount})</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">Born Victorious T-Shirt</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-gray-900">$13.00</span>
                    <Link 
                      to="/shop" 
                      className="p-2 bg-gray-100 rounded-full hover:bg-orange-600 hover:text-white transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
