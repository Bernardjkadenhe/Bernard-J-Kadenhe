import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Send, User, Trash2 } from 'lucide-react';
import { db, auth, collection, addDoc, query, where, onSnapshot, serverTimestamp, deleteDoc, doc, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../AuthContext';
import { toast } from 'sonner';

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  rating: number;
  comment: string;
  createdAt: any;
}

interface ReviewSectionProps {
  productId: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const path = 'reviews';
    const q = query(collection(db, path), where('productId', '==', productId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, [productId]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to leave a review');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        rating,
        comment,
        createdAt: serverTimestamp()
      });
      setComment('');
      setRating(5);
      toast.success('Review submitted! Thank you for your feedback.');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      toast.success('Review deleted');
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="mt-24 border-t border-gray-100 pt-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 mb-2 uppercase">REVIEWS & <span className="text-orange-600">RATINGS</span></h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-5 w-5 ${star <= Math.round(averageRating) ? 'text-orange-500 fill-orange-500' : 'text-gray-200'}`} 
                />
              ))}
            </div>
            <span className="text-gray-500 font-bold">{reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}</span>
            {averageRating > 0 && (
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-black">
                {averageRating.toFixed(1)} AVG
              </span>
            )}
          </div>
        </div>

        {user && (
          <button 
            onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all"
          >
            Write a Review
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Review List */}
        <div className="lg:col-span-2 space-y-8">
          {reviews.length === 0 ? (
            <div className="p-12 bg-gray-50 rounded-[2.5rem] text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium italic">No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {reviews.map((review) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                          {review.userPhoto ? (
                            <img src={review.userPhoto} alt={review.userName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <User className="h-6 w-6 text-orange-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-black text-gray-900 leading-none mb-1">{review.userName}</h4>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${star <= review.rating ? 'text-orange-500 fill-orange-500' : 'text-gray-200'}`} 
                                />
                              ))}
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                              {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString() : 'Just now'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {user?.uid === review.userId && (
                        <button 
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Review Form */}
        <div id="review-form" className="lg:col-span-1">
          {user ? (
            <div className="p-10 bg-gray-900 rounded-[3rem] text-white sticky top-24">
              <h3 className="text-2xl font-black tracking-tighter mb-8 uppercase">LEAVE A <span className="text-orange-500">REVIEW</span></h3>
              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Your Rating</label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-125"
                      >
                        <Star 
                          className={`h-8 w-8 ${star <= (hoveredRating || rating) ? 'text-orange-500 fill-orange-500' : 'text-gray-700'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Your Experience</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about the quality, fit, and feel..."
                    className="w-full px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors min-h-[150px] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-5 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Submit Review
                      <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="p-10 bg-orange-50 border border-orange-100 rounded-[3rem] text-center">
              <User className="h-12 w-12 text-orange-600 mx-auto mb-6" />
              <h3 className="text-2xl font-black tracking-tighter text-orange-900 mb-4 uppercase">JOIN THE CONVERSATION</h3>
              <p className="text-orange-800 mb-8 font-medium">Please sign in to share your thoughts with the Born Victorious community.</p>
              <button 
                onClick={() => window.location.href = '/auth'}
                className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all"
              >
                Sign In to Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
