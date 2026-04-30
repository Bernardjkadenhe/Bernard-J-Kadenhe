import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Upload, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { toast } from 'sonner';

const AIFittingBot = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFitting = async () => {
    if (!image) return;
    
    setLoading(true);
    setResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = 'gemini-3-flash-preview';
      
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              { text: "Analyze this photo of a person and suggest the best t-shirt size from these options: S, M, L, XL, 2XL. Consider their build and height. Provide a brief explanation for your choice. Return the result in a friendly, encouraging tone for a Christian clothing brand called 'Born Victorious'." },
              { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }
            ]
          }
        ]
      });

      setResult(response.text || "I couldn't determine your size. Please try another photo.");
    } catch (error) {
      console.error('AI Fitting Error:', error);
      toast.error('Failed to analyze photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-200"
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter text-gray-900 mb-4">AI FITTING ASSISTANT</h1>
          <p className="text-gray-600 text-lg">
            Upload a photo of yourself and our AI will suggest the perfect size for your Born Victorious t-shirt.
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 md:p-12">
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-4 border-dashed border-gray-100 rounded-[2rem] p-12 text-center cursor-pointer hover:border-orange-200 hover:bg-orange-50 transition-all group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="h-10 w-10 text-gray-400 group-hover:text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Upload your photo</h3>
                <p className="text-gray-500">Click to browse or drag and drop your photo here.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-lg">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-full text-red-600 hover:bg-white shadow-sm"
                  >
                    <Upload className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={analyzeFitting}
                    disabled={loading}
                    className="px-12 py-5 bg-orange-600 text-white rounded-full font-bold text-lg hover:bg-orange-700 transition-all flex items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-orange-200"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-6 w-6" />
                        Get Suggested Size
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {result && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 p-8 bg-green-50 border border-green-100 rounded-[2rem]"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-green-600 rounded-full">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-900 mb-4">Your Suggested Size</h3>
                    <div className="prose prose-green max-w-none text-green-800 leading-relaxed whitespace-pre-wrap">
                      {result}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div className="mt-12 p-6 bg-blue-50 border border-blue-100 rounded-2xl flex items-start space-x-4">
              <AlertCircle className="h-6 w-6 text-blue-600 mt-1" />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-1">Privacy Note:</p>
                <p>Your photo is only used for size analysis and is not stored permanently on our servers. We value your privacy as much as your style.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIFittingBot;
