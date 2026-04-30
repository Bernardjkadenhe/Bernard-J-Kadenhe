import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Check, Info, Star, Share2, MessageCircle } from 'lucide-react';
import { PRODUCTS, CONTACT_DETAILS } from '../constants';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import ReviewSection from '../components/ReviewSection';
import { db, collection, query, where, onSnapshot, handleFirestoreError, OperationType, seedProducts } from '../firebase';
import { useEffect } from 'react';

const Shop = () => {
  const { user } = useAuth();
  const isAdmin = user?.email === 'bernardjkadenhe@gmail.com';
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const product = PRODUCTS[0];
  
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[1]);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [currentPrice, setCurrentPrice] = useState(product.price);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    // Update image based on color
    if (product.colorImages && product.colorImages[selectedColor as keyof typeof product.colorImages]) {
      setActiveImage(product.colorImages[selectedColor as keyof typeof product.colorImages]);
    }
  }, [selectedColor, product.colorImages]);

  useEffect(() => {
    // Update price based on size
    if (product.sizePrices && product.sizePrices[selectedSize as keyof typeof product.sizePrices]) {
      setCurrentPrice(product.sizePrices[selectedSize as keyof typeof product.sizePrices]);
    } else {
      setCurrentPrice(product.price);
    }
  }, [selectedSize, product.sizePrices, product.price]);

  useEffect(() => {
    const path = 'reviews';
    const q = query(collection(db, path), where('productId', '==', product.id));
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
  }, [product.id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth');
      return;
    }
    
    try {
      await addToCart(product.id, selectedColor, selectedSize, currentPrice);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: product.name,
      text: `Check out this ${product.name} from Born Victorious!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Error sharing:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    }
  };

  const handleSeed = async () => {
    if (window.confirm('Are you sure you want to re-seed the products? This will clear existing products.')) {
      toast.promise(seedProducts(), {
        loading: 'Seeding products...',
        success: 'Products seeded successfully!',
        error: (err: any) => `Failed to seed: ${err.message}`
      });
    }
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              layoutId="main-image"
              className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-200"
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="grid grid-cols-5 gap-4">
              {product.images.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-orange-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= Math.round(averageRating) ? 'text-orange-500 fill-orange-500' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-gray-400">({reviewCount} Reviews)</span>
              </div>
              <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-4">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-black text-orange-600">${currentPrice.toFixed(2)}</span>
                <span className="text-xl text-gray-400 line-through">${(product.originalPrice + (currentPrice - product.price)).toFixed(2)}</span>
                <span className="bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full">
                  EASTER PROMO
                </span>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-8 mb-12">
              {/* Color Selection */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4">Select Color: <span className="text-gray-900 capitalize">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => {
                    const colorMap: Record<string, string> = {
                      'white': '#FFFFFF',
                      'black': '#000000',
                      'navy blue': '#000080',
                      'maroon': '#800000',
                      'grey': '#808080',
                      'royal blue': '#4169E1',
                      'beige': '#F5F5DC',
                      'brown': '#5C4033',
                      'olive': '#808000'
                    };
                    
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`group relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                          selectedColor === color 
                            ? 'border-orange-600 scale-110 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        title={color}
                      >
                        <span 
                          className="w-8 h-8 rounded-full border border-gray-100"
                          style={{ 
                            background: colorMap[color] || color,
                            boxShadow: color === 'white' ? 'inset 0 0 2px rgba(0,0,0,0.1)' : 'none'
                          }}
                        />
                        {selectedColor === color && (
                          <motion.div 
                            layoutId="color-active"
                            className="absolute -inset-1 rounded-full border-2 border-orange-600"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500">Select Size: <span className="text-gray-900">{selectedSize}</span></h3>
                  <button 
                    onClick={() => navigate('/fitting')}
                    className="text-xs font-bold text-orange-600 hover:underline flex items-center"
                  >
                    <Info className="h-3 w-3 mr-1" />
                    Size Guide / AI Fitting
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center font-bold transition-all ${
                        selectedSize === size 
                          ? 'border-orange-600 bg-orange-600 text-white' 
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-grow py-5 bg-gray-900 text-white rounded-3xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center group"
                >
                  <ShoppingCart className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>
                <button
                  onClick={handleShare}
                  className="px-6 py-5 bg-white border-2 border-gray-200 text-gray-900 rounded-3xl font-bold hover:border-gray-900 transition-all flex items-center justify-center group"
                  title="Share Product"
                >
                  <Share2 className="h-6 w-6 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <a 
                href={CONTACT_DETAILS.whatsapp.catalog}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-green-600 text-white rounded-3xl font-bold text-lg hover:bg-green-700 transition-all flex items-center justify-center"
              >
                <MessageCircle className="mr-3 h-6 w-6" />
                View on WhatsApp Catalog
              </a>
              <div className="p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-start space-x-3">
                <Check className="h-5 w-5 text-orange-600 mt-0.5" />
                <p className="text-sm text-orange-800 font-medium">
                  <span className="font-bold">Bulk Deal:</span> Buy 2 or more shirts and pay only <span className="font-black">$12.00</span> each!
                </p>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection productId={product.id} />

        {isAdmin && (
          <div className="mt-12 pt-12 border-t border-gray-100 flex justify-center">
            <button
              onClick={handleSeed}
              className="px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-all"
            >
              Admin: Reset & Seed Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
