import React from 'react';
import { motion } from 'motion/react';
import { Tag, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Offers = () => {
  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6">DEALS & <span className="text-orange-600">OFFERS</span></h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Exclusive savings for the Winning Generation. Don't miss out on our limited-time promotions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Easter Promotion */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative bg-orange-600 rounded-[3rem] p-12 text-white overflow-hidden shadow-2xl shadow-orange-200"
          >
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <Sparkles className="h-8 w-8" />
                <span className="font-bold uppercase tracking-widest text-sm">Limited Time</span>
              </div>
              <h2 className="text-5xl font-black mb-6 tracking-tighter">EASTER <br/>PROMOTION</h2>
              <p className="text-orange-100 text-lg mb-12 max-w-sm">
                Celebrate victory with our special Easter price slash. Premium t-shirts now more accessible.
              </p>
              <div className="flex items-center space-x-6 mb-12">
                <div className="flex flex-col">
                  <span className="text-orange-300 line-through text-2xl font-bold">$15.00</span>
                  <span className="text-6xl font-black">$13.00</span>
                </div>
                <div className="h-16 w-px bg-orange-400"></div>
                <div className="flex flex-col">
                  <span className="text-orange-200 text-sm font-bold uppercase">Save</span>
                  <span className="text-4xl font-black">15%</span>
                </div>
              </div>
              <Link 
                to="/shop" 
                className="inline-flex items-center px-10 py-5 bg-white text-orange-600 font-bold rounded-full hover:bg-orange-50 transition-all group"
              >
                Shop the Promo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-500 rounded-full opacity-50 blur-3xl"></div>
          </motion.div>

          {/* Bulk Discount */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative bg-gray-900 rounded-[3rem] p-12 text-white overflow-hidden shadow-2xl shadow-gray-200"
          >
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <Tag className="h-8 w-8 text-orange-500" />
                <span className="font-bold uppercase tracking-widest text-sm">Everyday Deal</span>
              </div>
              <h2 className="text-5xl font-black mb-6 tracking-tighter">BULK <br/>SAVINGS</h2>
              <p className="text-gray-400 text-lg mb-12 max-w-sm">
                The more you wear, the more you save. Perfect for groups, families, or just building your wardrobe.
              </p>
              <div className="flex items-center space-x-6 mb-12">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm font-bold uppercase">Buy 2+ for</span>
                  <span className="text-6xl font-black">$12.00</span>
                </div>
                <div className="h-16 w-px bg-gray-800"></div>
                <div className="flex flex-col">
                  <span className="text-orange-500 text-sm font-bold uppercase">Per Shirt</span>
                  <span className="text-4xl font-black">-$1.00</span>
                </div>
              </div>
              <Link 
                to="/shop" 
                className="inline-flex items-center px-10 py-5 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all group"
              >
                Start Saving
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-orange-600/10 rounded-full opacity-50 blur-3xl"></div>
          </motion.div>
        </div>

        {/* Payment Methods */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="p-12 bg-gray-900 rounded-[3rem] text-white">
            <h3 className="text-4xl font-black tracking-tighter mb-6 uppercase">SECURE <span className="text-orange-500">PAYMENTS</span></h3>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              We've made it easy for you to get your Born Victorious apparel. 
              We accept the most popular mobile payment methods in Zimbabwe.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10 flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs italic">Eco</span>
                </div>
                <span className="font-bold">EcoCash</span>
              </div>
              <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10 flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-xs italic">In</span>
                </div>
                <span className="font-bold">InnBucks</span>
              </div>
            </div>
          </div>

          <div className="p-12 bg-orange-50 rounded-[3rem] border border-orange-100">
            <h3 className="text-3xl font-black tracking-tighter mb-6 uppercase text-orange-900">HOW TO PAY</h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <p className="text-orange-900">Place your order through the website and select your preferred method.</p>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <p className="text-orange-900">Send the total amount to the provided EcoCash or InnBucks number.</p>
              </li>
              <li className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <p className="text-orange-900">Confirm your payment via WhatsApp with your order number.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Delivery Note */}
        <div className="mt-24 p-12 bg-gray-50 rounded-[3rem] border border-gray-100 text-center">
          <Clock className="h-12 w-12 text-orange-600 mx-auto mb-6" />
          <h3 className="text-3xl font-black tracking-tighter mb-4">FAST DELIVERY</h3>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            We deliver straight to your door. Delivery fees are calculated based on your distance from the Harare CBD.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <span className="font-bold text-orange-600">01</span>
              </div>
              <span className="font-bold text-gray-900">Order Online</span>
            </div>
            <div className="hidden sm:block w-12 h-px bg-gray-200"></div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <span className="font-bold text-orange-600">02</span>
              </div>
              <span className="font-bold text-gray-900">Confirm Location</span>
            </div>
            <div className="hidden sm:block w-12 h-px bg-gray-200"></div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <span className="font-bold text-orange-600">03</span>
              </div>
              <span className="font-bold text-gray-900">Receive Victory</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offers;
