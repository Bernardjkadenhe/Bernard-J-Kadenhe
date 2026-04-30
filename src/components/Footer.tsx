import React from 'react';
import { Instagram, Facebook, Phone, Truck, MessageCircle } from 'lucide-react';
import { CONTACT_DETAILS } from '../constants';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <h3 className="text-2xl font-bold tracking-tighter">BORN VICTORIOUS</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Christian clothing brand for the winning generation. 
              Empowering believers through style and faith.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-orange-500" />
                <span>{CONTACT_DETAILS.sales.phone} - {CONTACT_DETAILS.sales.name} (Sales)</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Truck className="h-5 w-5 text-orange-500" />
                <span>{CONTACT_DETAILS.deliveries.phone} - {CONTACT_DETAILS.deliveries.name} (Deliveries)</span>
              </div>
              <a 
                href={CONTACT_DETAILS.whatsapp.catalog}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-gray-400 hover:text-green-500 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-green-500" />
                <span>View WhatsApp Catalog</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-6">Follow Us</h4>
            <div className="space-y-4">
              <a 
                href="#" 
                className="flex items-center space-x-3 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span>{CONTACT_DETAILS.instagram}</span>
              </a>
              <a 
                href="#" 
                className="flex items-center space-x-3 text-gray-400 hover:text-orange-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span>{CONTACT_DETAILS.facebook}</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Born Victorious Christian Clothing. All rights reserved.</p>
          <p className="mt-2">Delivery available based on distance from CBD.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
