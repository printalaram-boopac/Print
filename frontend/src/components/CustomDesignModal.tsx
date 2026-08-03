import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { logUserEvent } from '@/lib/analytics';

interface CustomDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomDesignModal({ isOpen, onClose }: CustomDesignModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !phone || !address) {
      toast.warn('Please fill in all required contact details.');
      return;
    }

    const message = [
      `I want to customize a Shagun Lifafa`,
      ``,
      `Customer & Shipping`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      `Address: ${address}`
    ].join('\n');

    logUserEvent('SUBMIT_CUSTOM_DESIGN_REQUEST');
    toast.success('Custom design inquiry created! Opening WhatsApp...');
    const whatsappUrl = `https://wa.me/919904544702?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/75 z-[9999] backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Modal Box */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="custom-modal-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-gold-200/60 p-6 md:p-8 rounded-xl z-[10000] space-y-6 shadow-2xl my-auto"
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <div className="flex justify-between items-center border-b border-gold-200/40 pb-3">
              <h3 id="custom-modal-title" className="text-lg font-display font-semibold text-luxury-accent">
                Customize Shagun Lifafa
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1 rounded-full text-gray-400 hover:text-luxury-accent hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed">
              Fill in your customer & shipping details below to send a customization request directly to our lead design consultant on WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="custom-full-name" className="text-[10px] uppercase tracking-widest text-luxury-accent font-bold">
                  Full Name
                </label>
                <input
                  id="custom-full-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Brijesh Vasoya"
                  className="w-full bg-luxury-gray/40 border border-gold-200/60 p-3 text-xs text-luxury-accent placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus-visible:ring-2 focus-visible:ring-luxury-gold rounded-lg transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="custom-phone-number" className="text-[10px] uppercase tracking-widest text-luxury-accent font-bold">
                  Phone Number
                </label>
                <input
                  id="custom-phone-number"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 99045 44702"
                  className="w-full bg-luxury-gray/40 border border-gold-200/60 p-3 text-xs text-luxury-accent placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus-visible:ring-2 focus-visible:ring-luxury-gold rounded-lg transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="custom-shipping-address" className="text-[10px] uppercase tracking-widest text-luxury-accent font-bold">
                  Shipping Address
                </label>
                <textarea
                  id="custom-shipping-address"
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 70, Maple Villa, Kathor, Kamrej, Surat, Gujarat - 394150"
                  className="w-full bg-luxury-gray/40 border border-gold-200/60 p-3 text-xs text-luxury-accent placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus-visible:ring-2 focus-visible:ring-luxury-gold resize-none rounded-lg transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-luxury-accent text-white font-bold tracking-wider text-xs cursor-pointer uppercase rounded-lg hover:bg-luxury-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold shadow-md"
              >
                Send Request on WhatsApp
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
