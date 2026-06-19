import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-darker text-brand-cream border-t border-brand-dark pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-wider text-brand-cream">
              AMIGOS <span className="text-brand-bronze">SNACKS</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Bringing you the authentic taste of traditional Andhra homemade snacks. Made with 100% natural ingredients, fresh oil, and age-old family recipes.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-brand-bronze transition-colors text-gray-400">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/hey_amigossss?igsh=ZHRsN3ZsZG14dGF2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-brand-bronze transition-colors text-gray-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a 
                href="https://youtube.com/@hey_amigosss?si=wb1wvOCHJvrRKOyR" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-brand-bronze transition-colors text-gray-400"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-md font-bold uppercase tracking-wider text-brand-bronze mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-brand-cream transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-brand-cream transition-colors">Buy Snacks</Link></li>
              <li><Link to="/about" className="hover:text-brand-cream transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-brand-cream transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Traditional Promise */}
          <div>
            <h4 className="text-md font-bold uppercase tracking-wider text-brand-bronze mb-4">Our Promise</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>✓ Traditional Recipes</li>
              <li>✓ Homemade Preparation</li>
              <li>✓ No Preservatives</li>
              <li>✓ Hygienically Packed</li>
              <li>✓ Clean Sunflower Oil</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-md font-bold uppercase tracking-wider text-brand-bronze mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-brand-bronze shrink-0 mt-0.5" />
                <a 
                  href="https://maps.google.com/?q=Penugonda,+Andhra+Pradesh+534320" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-cream transition-colors"
                >
                  Penugonda, Andhra Pradesh - 534320
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-brand-bronze" />
                <span>+91 8341462856</span>
              </li>
              <li className="flex items-center space-x-3">
                <MessageSquare className="h-4 w-4 text-brand-bronze" />
                <a 
                  href="https://wa.me/918341462856" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-cream transition-colors"
                >
                  WhatsApp Support
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-brand-bronze" />
                <a 
                  href="mailto:nambulaakash@gmail.com" 
                  className="hover:text-brand-cream transition-colors"
                >
                  nambulaakash@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-brand-dark my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Amigos Snacks. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-brand-cream transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-cream transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-cream transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
