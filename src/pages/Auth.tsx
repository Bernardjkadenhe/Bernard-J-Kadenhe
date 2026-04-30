import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, ShieldCheck, Apple, Phone, ArrowRight } from 'lucide-react';
import { signInWithPopup, googleProvider, appleProvider, auth, RecaptchaVerifier, signInWithPhoneNumber } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Auth = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!(window as any).recaptchaVerifier) {
      try {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            // reCAPTCHA solved
          }
        });
      } catch (error) {
        console.error('Recaptcha init error:', error);
      }
    }
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Successfully signed in with Google!');
      navigate('/');
    } catch (error: any) {
      console.error('Google sign in error:', error);
      handleSignInError(error);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      toast.success('Successfully signed in with Apple!');
      navigate('/');
    } catch (error: any) {
      console.error('Apple sign in error:', error);
      handleSignInError(error);
    }
  };

  const handlePhoneSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error('Please enter a valid phone number (e.g., +1234567890)');
      return;
    }
    setLoading(true);
    try {
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      toast.success('Verification code sent to your phone!');
    } catch (error: any) {
      console.error('Phone sign in error:', error);
      handleSignInError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode || !confirmationResult) return;
    setLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      toast.success('Successfully signed in with Phone!');
      navigate('/');
    } catch (error: any) {
      console.error('Verification code error:', error);
      toast.error('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInError = (error: any) => {
    if (error.code === 'auth/network-request-failed') {
      toast.error('Network error. Please check your connection or ensure the app domain is authorized in Firebase Console.');
    } else if (error.code === 'auth/popup-blocked') {
      toast.error('Sign-in popup was blocked by your browser. Please allow popups for this site.');
    } else if (error.code === 'auth/operation-not-allowed') {
      toast.error('This sign-in method is not enabled in your Firebase project. Please go to the Firebase Console > Authentication > Sign-in method and enable the provider (Apple, Phone, etc.).', {
        duration: 10000,
      });
    } else if (error.code === 'auth/invalid-phone-number') {
      toast.error('Invalid phone number. Please use international format (e.g., +1234567890).');
    } else if (error.code === 'auth/too-many-requests') {
      toast.error('Too many requests. Please try again later.');
    } else {
      toast.error(`Sign in failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4 py-12">
      <div id="recaptcha-container"></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
      >
        <div className="p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <ShieldCheck className="h-10 w-10 text-orange-600" />
          </div>
          
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-4 uppercase">Join the Generation</h1>
          <p className="text-gray-500 mb-8">
            Sign in to access your shopping cart, track orders, and use our AI fitting assistant.
          </p>

          <div className="space-y-6">
            {!confirmationResult ? (
              <form onSubmit={handlePhoneSignIn} className="space-y-4">
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-medium"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Continue with Phone'}
                  {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyCode} className="space-y-4">
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-2xl outline-none transition-all font-medium tracking-[0.5em] text-center"
                    maxLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                <button 
                  type="button"
                  onClick={() => setConfirmationResult(null)}
                  className="text-sm text-gray-500 hover:text-orange-600 font-bold"
                >
                  Change Phone Number
                </button>
              </form>
            )}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400 uppercase tracking-widest font-bold text-[10px]">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleGoogleSignIn}
                className="py-4 px-4 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:border-orange-200 hover:bg-orange-50 transition-all flex items-center justify-center group"
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="h-5 w-5 mr-2"
                />
                Google
              </button>

              <button
                onClick={handleAppleSignIn}
                className="py-4 px-4 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 transition-all flex items-center justify-center group"
              >
                <Apple className="h-5 w-5 mr-2" />
                Apple
              </button>
            </div>
            
            <p className="text-[10px] text-gray-400 leading-relaxed pt-4">
              By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>. 
              We use secure user verification to protect your data.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
