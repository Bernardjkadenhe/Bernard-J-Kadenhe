import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck, CreditCard, MapPin, CheckCircle2, Phone } from 'lucide-react';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { db, collection, addDoc, serverTimestamp } from '../firebase';
import { CONTACT_DETAILS, PRODUCTS } from '../constants';

const Cart = () => {
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, clearCart, total, subtotal, discount } = useCart();
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'cart' | 'delivery' | 'payment' | 'confirmation'>('cart');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'ecocash' | 'innbucks' | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!user || !paymentMethod || !address) return;
    
    setIsPlacingOrder(true);
    try {
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
          price: item.price
        })),
        subtotal,
        discount,
        total,
        deliveryAddress: address,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      setOrderId(docRef.id);
      await clearCart();
      setStep('confirmation');
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-16 w-16 text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign in to view your cart</h2>
        <Link to="/auth" className="px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all">
          Sign In
        </Link>
      </div>
    );
  }

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-16 w-16 text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/shop" className="px-8 py-3 bg-orange-600 text-white font-bold rounded-full hover:bg-orange-700 transition-all">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 uppercase">
            {step === 'cart' && 'Your Cart'}
            {step === 'delivery' && 'Delivery Details'}
            {step === 'payment' && 'Payment Method'}
            {step === 'confirmation' && 'Order Confirmed'}
          </h1>
          
          {step !== 'cart' && step !== 'confirmation' && (
            <button 
              onClick={() => setStep(step === 'payment' ? 'delivery' : 'cart')}
              className="text-gray-500 hover:text-gray-900 font-bold"
            >
              Back
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === 'cart' && (
                <motion.div 
                  key="cart"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center space-x-6"
                    >
                      <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                        {(() => {
                          const product = PRODUCTS.find(p => p.id === item.productId) || PRODUCTS[0];
                          const itemImage = (product.colorImages as any)[item.color] || product.images[0];
                          return (
                            <img 
                              src={itemImage} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          );
                        })()}
                      </div>
                      
                      <div className="flex-grow">
                        <h3 className="font-bold text-lg text-gray-900">Born Victorious T-Shirt</h3>
                        <p className="text-sm text-gray-500 mb-4">Color: {item.color} | Size: {item.size}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 bg-gray-50 rounded-xl p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-white rounded-lg transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-white rounded-lg transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <span className="font-black text-lg">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {step === 'delivery' && (
                <motion.div 
                  key="delivery"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Where should we deliver?</h2>
                      <p className="text-sm text-gray-500">Delivery fee calculated based on distance from CBD.</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-widest">Delivery Address</label>
                      <textarea 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your full delivery address..."
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-3xl focus:border-orange-600 focus:bg-white transition-all outline-none min-h-[150px]"
                      />
                    </div>
                    
                    <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start space-x-3">
                      <Truck className="h-5 w-5 text-orange-600 mt-0.5" />
                      <p className="text-sm text-orange-900">
                        <strong>Note:</strong> Our delivery team (Mulenga: 0780962572) will contact you to confirm the exact delivery fee once your order is processed.
                      </p>
                    </div>

                    <button 
                      disabled={!address}
                      onClick={() => setStep('payment')}
                      className="w-full py-5 bg-orange-600 text-white rounded-3xl font-bold text-lg hover:bg-orange-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div 
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100"
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Select Payment Method</h2>
                      <p className="text-sm text-gray-500">Choose your preferred mobile payment option.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    <button 
                      onClick={() => setPaymentMethod('ecocash')}
                      className={`p-8 rounded-[2rem] border-2 transition-all text-left flex flex-col items-center justify-center space-y-4 ${
                        paymentMethod === 'ecocash' 
                          ? 'border-orange-600 bg-orange-50' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-black text-xl italic">Eco</span>
                      </div>
                      <span className="font-bold text-lg">EcoCash</span>
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('innbucks')}
                      className={`p-8 rounded-[2rem] border-2 transition-all text-left flex flex-col items-center justify-center space-y-4 ${
                        paymentMethod === 'innbucks' 
                          ? 'border-orange-600 bg-orange-50' 
                          : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center">
                        <span className="text-white font-black text-xl italic">In</span>
                      </div>
                      <span className="font-bold text-lg">InnBucks</span>
                    </button>
                  </div>

                  {paymentMethod && (
                    <div className="p-6 bg-gray-50 rounded-3xl mb-8">
                      <h4 className="font-bold mb-2 uppercase text-xs text-gray-500 tracking-widest">Payment Instructions</h4>
                      <p className="text-sm text-gray-700">
                        After placing your order, please send <strong>${total.toFixed(2)}</strong> to:
                        <br />
                        <strong className="text-lg block mt-2">
                          {paymentMethod === 'ecocash' ? 'EcoCash: ' : 'InnBucks: '}
                          {CONTACT_DETAILS.payments[paymentMethod].number}
                        </strong>
                        <span className="text-gray-500">({CONTACT_DETAILS.payments[paymentMethod].name})</span>
                      </p>
                    </div>
                  )}

                  <button 
                    disabled={!paymentMethod || isPlacingOrder}
                    onClick={handlePlaceOrder}
                    className="w-full py-5 bg-orange-600 text-white rounded-3xl font-bold text-lg hover:bg-orange-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPlacingOrder ? 'Placing Order...' : 'Place Order Now'}
                    <CheckCircle2 className="ml-2 h-5 w-5" />
                  </button>
                </motion.div>
              )}

              {step === 'confirmation' && (
                <motion.div 
                  key="confirmation"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 text-center"
                >
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter mb-4">ORDER PLACED!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Your order <strong>#{orderId?.slice(-6).toUpperCase()}</strong> has been received. 
                    Please complete your payment to start processing.
                  </p>

                  <div className="bg-orange-50 p-8 rounded-3xl text-left mb-8 max-w-md mx-auto">
                    <h4 className="font-bold text-orange-900 mb-4 flex items-center">
                      <CreditCard className="h-5 w-5 mr-2" />
                      Payment Required
                    </h4>
                    <p className="text-orange-800 text-sm mb-4">
                      Send <strong>${total.toFixed(2)}</strong> via {paymentMethod === 'ecocash' ? 'EcoCash' : 'InnBucks'} to:
                    </p>
                    <div className="bg-white p-4 rounded-2xl border border-orange-200">
                      <p className="font-black text-xl text-orange-600">
                        {paymentMethod && CONTACT_DETAILS.payments[paymentMethod].number}
                      </p>
                      <p className="text-xs text-gray-500 uppercase font-bold">
                        {paymentMethod && CONTACT_DETAILS.payments[paymentMethod].name}
                      </p>
                    </div>
                    <p className="mt-4 text-xs text-orange-700 italic">
                      * Please use your order number as reference if possible.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      to="/shop" 
                      className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-black transition-all"
                    >
                      Continue Shopping
                    </Link>
                    <a 
                      href={`https://wa.me/${CONTACT_DETAILS.sales.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-4 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-all flex items-center justify-center"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Confirm on WhatsApp
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Summary Sidebar */}
          {step !== 'confirmation' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <h2 className="text-2xl font-bold mb-8">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Bulk Discount (2+ items)</span>
                      <span className="font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <div className="flex items-center">
                      <span>Delivery</span>
                      <Truck className="h-4 w-4 ml-2 text-gray-400" />
                    </div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Calculated from CBD</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-end">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-3xl font-black text-orange-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {step === 'cart' && (
                  <button 
                    onClick={() => setStep('delivery')}
                    className="w-full py-5 bg-orange-600 text-white rounded-3xl font-bold text-lg hover:bg-orange-700 transition-all flex items-center justify-center group shadow-lg shadow-orange-100"
                  >
                    Proceed to Delivery
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
                
                <p className="mt-6 text-xs text-center text-gray-400">
                  Secure payments via EcoCash & InnBucks.
                </p>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl">
                <h4 className="font-bold text-blue-900 mb-2">Need Help?</h4>
                <p className="text-sm text-blue-800">
                  Contact Primrose at {CONTACT_DETAILS.sales.phone} for sales or Mulenga at {CONTACT_DETAILS.deliveries.phone} for delivery updates.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
