import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
      alert('Please fill in all details.');
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

    const whatsappUrl = `https://wa.me/919904544702?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/85 z-[300] backdrop-blur-sm cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-luxury-dark border border-gold-950 p-6 md:p-8 rounded-lg z-[301] space-y-6 shadow-2xl"
            initial={{ scale: 0.9, y: '-40%', opacity: 0 }}
            animate={{ scale: 1, y: '-50%', opacity: 1 }}
            exit={{ scale: 0.9, y: '-40%', opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="flex justify-between items-center border-b border-luxury-gray pb-3">
              <h3 className="text-lg font-display font-semibold text-gold-gradient">
                Customize Shagun Lifafa
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-luxury-accent text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Fill in your customer & shipping details below to send a customization request directly to our lead design consultant on WhatsApp.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-accent/80 font-bold">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. brijesh vasoya"
                  className="w-full bg-luxury-black border border-luxury-accent/20 p-2.5 text-xs text-luxury-accent placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold rounded-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-accent/80 font-bold">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +919904544702"
                  className="w-full bg-luxury-black border border-luxury-accent/20 p-2.5 text-xs text-luxury-accent placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold rounded-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest text-luxury-accent/80 font-bold">Shipping Address</label>
                <textarea
                  required
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 70,maple villa ,kathor ,kamrej, surat, Gujarat, 394150"
                  className="w-full bg-luxury-black border border-luxury-accent/20 p-2.5 text-xs text-luxury-accent placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold resize-none rounded-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-luxury-accent text-white font-bold tracking-wider text-xs gold-glow cursor-pointer uppercase rounded-sm hover:bg-luxury-accent/90 transition-colors"
              >
                Send Request on WhatsApp
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
