import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/api';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalAmount, isCartOpen, setCartOpen } = useCart();
  const { dbUser } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state — auto-fill from user profile
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  // Auto-fill when checkout starts
  const startCheckout = () => {
    if (dbUser) {
      setShippingName(dbUser.shippingName || dbUser.name || '');
      setShippingPhone(dbUser.shippingPhone || dbUser.phone || '');
      setShippingAddress(dbUser.address || '');
    }
    setIsCheckingOut(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!shippingName || !shippingPhone || !shippingAddress) {
      alert('Please fill in all shipping details.');
      return;
    }

    setIsSaving(true);

    // Save each cart item as an order in Supabase
    for (const item of items) {
      try {
        await createOrder({
          templateId: String(item.templateId),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          shippingAddress,
          phone: shippingPhone,
          customerName: shippingName,
          coupleName: item.coupleName || undefined,
          familyName: item.familyName || undefined,
          greetingText: item.greetingText || undefined,
          theme: item.theme,
          occasion: item.occasion,
          designTitle: item.title,
          shippingName,
        });
      } catch (err) {
        console.error('Failed to save order for item:', item.title, err);
        // Continue saving other items even if one fails
      }
    }

    // Format WhatsApp message
    const productListText = items.map((item) => {
      return [
        `Product: ${item.title}`,
        `Quantity: ${item.quantity} pcs`,
        `Order Total: ₹${(item.quantity * item.unitPrice).toLocaleString('en-IN')}.00`,
        ``,
        `Personalization`,
        `Name: ${item.coupleName || 'Default'}`,
        `Family/Surname: ${item.familyName || 'Default'}`,
        `Wish/Message: ${item.greetingText || 'Default'}`,
        `Theme: ${item.theme}`,
        `Occasion: ${item.occasion}`,
      ].join('\n');
    }).join('\n\n');

    const message = [
      `New Order - Printalaram`,
      ``,
      productListText,
      ``,
      `Customer & Shipping`,
      `Name: ${shippingName}`,
      `Phone: ${shippingPhone}`,
      `Address: ${shippingAddress}`,
      ``,
      `Please confirm my order.`,
      ``,
      `Razorpay Payment Link: https://rzp.io/l/printalarm`
    ].join('\n');

    const whatsappUrl = `https://wa.me/919904544702?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Reset and clear
    setIsSaving(false);
    clearCart();
    setIsCheckingOut(false);
    setCartOpen(false);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setCartOpen(false);
              setIsCheckingOut(false);
            }}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-md bg-luxury-dark border-l border-gold-200 z-[201] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gold-200">
              <h3 className="text-lg font-display font-semibold text-gold-gradient">
                {isCheckingOut ? 'Checkout & Shipping' : `Your Cart (${totalItems})`}
              </h3>
              <button
                onClick={() => {
                  setCartOpen(false);
                  setIsCheckingOut(false);
                }}
                className="text-gray-500 hover:text-luxury-accent text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-5">
              {!isCheckingOut ? (
                // Step 1: Cart Items List
                <div className="space-y-4">
                  {items.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <span className="text-4xl">🛒</span>
                      <p className="text-gray-500 text-sm">Your cart is empty</p>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="text-luxury-gold text-xs underline cursor-pointer"
                      >
                        Continue shopping
                      </button>
                    </div>
                  ) : (
                    items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 p-3 glass-card rounded-lg"
                      >
                        {/* Thumbnail */}
                        <div className="w-20 h-20 rounded overflow-hidden flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-sm font-semibold text-luxury-accent truncate">{item.title}</h4>
                          <p className="text-[10px] text-gray-500">Theme: {item.theme} • {item.occasion}</p>
                          {item.coupleName && <p className="text-[10px] text-gray-500">Names: {item.coupleName}</p>}
                          <p className="text-sm font-bold text-luxury-gold">₹{item.unitPrice} × {item.quantity}</p>

                          {/* Quantity controls */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 border border-gold-200 text-xs text-luxury-accent flex items-center justify-center hover:bg-gold-50 cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              −
                            </button>
                            <span className="text-xs text-luxury-accent w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 border border-gold-200 text-xs text-luxury-accent flex items-center justify-center hover:bg-gold-50 cursor-pointer"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="ml-auto text-red-500 text-[10px] hover:text-red-400 cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              ) : (
                // Step 2: Shipping Form
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400">Full Name</label>
                    <input
                      type="text"
                      required
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      placeholder="e.g. brijesh vasoya"
                      className="w-full bg-luxury-dark border border-gold-200 p-2.5 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold placeholder:text-gray-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      placeholder="e.g. +919904544702"
                      className="w-full bg-luxury-dark border border-gold-200 p-2.5 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold placeholder:text-gray-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-widest text-gray-400">Shipping Address</label>
                    <textarea
                      required
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="e.g. 70,maple villa ,kathor ,kamrej, surat, Gujarat, 394150"
                      className="w-full bg-luxury-dark border border-gold-200 p-2.5 text-sm text-luxury-accent focus:outline-none focus:border-luxury-gold resize-none placeholder:text-gray-300"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 bg-luxury-gold text-luxury-accent font-bold tracking-wider text-xs gold-glow cursor-pointer uppercase disabled:opacity-50"
                  >
                    {isSaving ? 'Saving Order...' : 'Confirm Order & Pay via WhatsApp'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="w-full text-center text-xs text-gray-500 hover:text-luxury-accent cursor-pointer mt-2"
                  >
                    ← Back to Cart Items
                  </button>
                </form>
              )}
            </div>

            {/* Footer */}
            {!isCheckingOut && items.length > 0 && (
              <div className="border-t border-gold-200 p-5 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-luxury-accent font-bold">₹{totalAmount.toLocaleString('en-IN')}.00</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-bold">{totalAmount >= 999 ? 'FREE' : '₹50'}</span>
                </div>

                <button
                  onClick={startCheckout}
                  className="btn-primary w-full text-center block gold-glow cursor-pointer"
                >
                  🟢 Proceed to Checkout — ₹{(totalAmount + (totalAmount >= 999 ? 0 : 50)).toLocaleString('en-IN')}.00
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-[11px] text-gray-500 hover:text-red-400 cursor-pointer"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
