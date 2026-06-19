import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Contact = () => {
  const [activeTab, setActiveTab] = useState('info'); // 'info' or 'message'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="bg-brand-creamlight min-h-screen py-16 flex flex-col justify-start">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-sm font-bold text-brand-bronze uppercase tracking-widest">Connect with Us</span>
          <h1 className="text-4xl font-extrabold text-brand-dark mt-2 tracking-tight">We Would Love to Hear from You</h1>
          <p className="text-sm text-gray-500 mt-2">
            Have bulk order inquiries, snack customization requests, or feedback? Choose an option below to connect with our team.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="bg-brand-dark/5 p-1.5 rounded-2xl flex items-center space-x-1 border border-brand-cream/40">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                activeTab === 'info'
                  ? 'bg-brand-dark text-brand-cream shadow-md'
                  : 'text-brand-dark hover:text-brand-bronze hover:bg-brand-dark/5'
              }`}
            >
              <Phone className="h-4 w-4" />
              <span>Contact Information</span>
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer ${
                activeTab === 'message'
                  ? 'bg-brand-dark text-brand-cream shadow-md'
                  : 'text-brand-dark hover:text-brand-bronze hover:bg-brand-dark/5'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Send us a Message</span>
            </button>
          </div>
        </div>

        {/* Dynamic Panel Content */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'info' ? (
              <motion.div
                key="info-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* 2x2 Grid of Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Card 1: Call Support */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream/35 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start space-x-5">
                      <div className="bg-brand-cream/50 p-4 rounded-2xl text-brand-bronze group-hover:scale-105 transition-transform duration-200">
                        <Phone className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-dark">Call Support</h3>
                        <p className="text-xs text-gray-400 mt-1">Available for quick queries, order updates, and support.</p>
                        <p className="text-lg font-extrabold text-brand-dark mt-3">+91 8341462856</p>
                      </div>
                    </div>
                    <a
                      href="tel:+918341462856"
                      className="mt-6 w-full py-3 px-4 bg-brand-creamlight hover:bg-brand-cream text-brand-dark hover:text-brand-bronze font-bold rounded-xl text-center text-xs transition-colors flex items-center justify-center space-x-2 border border-brand-cream"
                    >
                      <span>Call Now</span>
                    </a>
                  </div>

                  {/* Card 2: WhatsApp Orders */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream/35 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start space-x-5">
                      <div className="bg-brand-cream/50 p-4 rounded-2xl text-brand-bronze group-hover:scale-105 transition-transform duration-200">
                        <MessageSquare className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-dark">WhatsApp Orders</h3>
                        <p className="text-xs text-gray-400 mt-1">Send your requirements directly to order on WhatsApp.</p>
                        <p className="text-lg font-extrabold text-brand-dark mt-3">+91 8341462856</p>
                      </div>
                    </div>
                    <a
                      href="https://wa.me/918341462856"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 w-full py-3 px-4 bg-brand-bronze hover:bg-brand-light text-white font-bold rounded-xl text-center text-xs transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Chat on WhatsApp</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Card 3: Email Enquiries */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream/35 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start space-x-5">
                      <div className="bg-brand-cream/50 p-4 rounded-2xl text-brand-bronze group-hover:scale-105 transition-transform duration-200">
                        <Mail className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-dark">Email Enquiries</h3>
                        <p className="text-xs text-gray-400 mt-1">Write to us for partnerships, wholesale, or feedback.</p>
                        <p className="text-lg font-extrabold text-brand-dark mt-3">nambulaakash@gmail.com</p>
                      </div>
                    </div>
                    <a
                      href="mailto:nambulaakash@gmail.com"
                      className="mt-6 w-full py-3 px-4 bg-brand-creamlight hover:bg-brand-cream text-brand-dark hover:text-brand-bronze font-bold rounded-xl text-center text-xs transition-colors flex items-center justify-center space-x-2 border border-brand-cream"
                    >
                      <span>Send Email</span>
                    </a>
                  </div>

                  {/* Card 4: Address */}
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-cream/35 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 group">
                    <div className="flex items-start space-x-5">
                      <div className="bg-brand-cream/50 p-4 rounded-2xl text-brand-bronze group-hover:scale-105 transition-transform duration-200">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-brand-dark">Our Location</h3>
                        <p className="text-xs text-gray-400 mt-1">Authentic home kitchens where the delights are prepared.</p>
                        <p className="text-lg font-extrabold text-brand-dark mt-3">Penugonda, Andhra Pradesh - 534320</p>
                      </div>
                    </div>
                    <a
                      href="https://maps.google.com/?q=Penugonda,+Andhra+Pradesh+534320"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 w-full py-3 px-4 bg-brand-creamlight hover:bg-brand-cream text-brand-dark hover:text-brand-bronze font-bold rounded-xl text-center text-xs transition-colors flex items-center justify-center space-x-2 border border-brand-cream"
                    >
                      <span>View on Google Maps</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                </div>

                {/* Wholesale Banner */}
                <div className="bg-brand-dark text-brand-cream p-6 rounded-3xl border border-brand-dark shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-brand-bronze text-white p-3 rounded-full text-xl shrink-0">💡</div>
                    <div className="text-center sm:text-left">
                      <h4 className="font-extrabold text-sm tracking-wide uppercase text-brand-bronze">Wholesale & Event Catering</h4>
                      <p className="text-xs text-gray-400 mt-1 max-w-xl">We supply premium homemade snacks for festivals, weddings, housewarmings, and corporate gatherings. Please contact us at least 5 days in advance for bulk bookings.</p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/918341462856?text=Hi%20Amigos%20Snacks,%20I%20would%20like%20to%20enquire%20about%20wholesale/bulk%20catering%20orders."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-bronze hover:bg-brand-light text-white px-6 py-3 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 flex items-center space-x-2 shadow-lg shadow-brand-darker/50"
                  >
                    <span>Enquire Bulk Order</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="message-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-brand-cream/35 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-brand-dark mb-6 border-b border-brand-cream/20 pb-4 flex items-center space-x-2">
                  <Mail className="h-6 w-6 text-brand-bronze" />
                  <span>Send us a Message</span>
                </h2>

                {submitted && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-xl text-xs font-semibold mb-6 flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-600 shrink-0" />
                    <span>Thank you! Your message has been sent successfully. We will get back to you soon.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">
                      Message *
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      rows={6}
                      className="w-full bg-brand-creamlight border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-brand-dark focus:outline-none focus:border-brand-bronze focus:ring-1 focus:ring-brand-bronze resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-bronze hover:bg-brand-light text-white px-8 py-4 rounded-xl font-bold shadow-md shadow-brand-bronze/10 hover:shadow-brand-light/10 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Contact;
