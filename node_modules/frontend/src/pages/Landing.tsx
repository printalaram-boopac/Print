import HeroSection from '@/components/landing/HeroSection';
import TrustStats from '@/components/landing/TrustStats';
import TrendingDesigns from '@/components/landing/TrendingDesigns';
import HowItWorks from '@/components/landing/HowItWorks';
import PremiumFeatures from '@/components/landing/PremiumFeatures';
import CustomerReviews from '@/components/landing/CustomerReviews';
import UrgencyOffers from '@/components/landing/UrgencyOffers';
// import OccasionCategories from '@/components/landing/OccasionCategories'; // Hidden for now
import FAQSection from '@/components/landing/FAQSection';
import FloatingActions from '@/components/landing/FloatingActions';
import Footer from '@/components/landing/Footer';

export default function Landing() {
  return (
    <>
      {/* Noise texture overlay for luxury feel */}
      <div className="noise-overlay" />

      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* 2. Trust Stats */}
      <TrustStats />

      {/* Divider */}
      <div className="gold-divider" />

      {/* 3. Trending Designs Gallery */}
      <TrendingDesigns />

      {/* Divider */}
      <div className="gold-divider" />

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Premium Features */}
      <PremiumFeatures />

      {/* Divider */}
      <div className="gold-divider" />

      {/* 6. Customer Reviews with Photos */}
      <CustomerReviews />

      {/* 7. Urgency Countdown + Offers */}
      <UrgencyOffers />

      {/* 8. Occasion Categories — HIDDEN */}
      {/* <OccasionCategories /> */}

      {/* 9. FAQ */}
      <FAQSection />

      {/* 10. Footer */}
      <Footer />

      {/* Floating WhatsApp / Call / Instagram */}
      <FloatingActions />
    </>
  );
}
