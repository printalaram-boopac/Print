import HeroSection from '@/components/landing/HeroSection';
import PromoTicker from '@/components/landing/PromoTicker';
import CategoryCardsSection from '@/components/landing/CategoryCardsSection';
import TrendingDesigns from '@/components/landing/TrendingDesigns';
import OfferSection from '@/components/landing/OfferSection';
import HowItWorks from '@/components/landing/HowItWorks';
import PremiumFeatures from '@/components/landing/PremiumFeatures';
import CustomerReviews from '@/components/landing/CustomerReviews';
// import UrgencyOffers from '@/components/landing/UrgencyOffers'; // Hidden for now
// import OccasionCategories from '@/components/landing/OccasionCategories'; // Hidden for now
import BlogPreview from '@/components/landing/BlogPreview';
import FAQSection from '@/components/landing/FAQSection';

export default function Landing() {
  return (
    <>
      {/* Noise texture overlay for luxury feel */}
      <div className="noise-overlay" />

      {/* 1. Cinematic Hero */}
      <HeroSection />

      {/* Promo Ticker */}
      <PromoTicker />

      {/* 2. Three Main Category Sections (Shagun, Pocket, Acrylic) */}
      <CategoryCardsSection />

      {/* Divider */}
      <div className="gold-divider" />

      {/* Offer Section */}
      <OfferSection />

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

      {/* 7. Urgency Countdown + Offers — HIDDEN */}
      {/* <UrgencyOffers /> */}

      {/* 8. Occasion Categories — HIDDEN */}
      {/* <OccasionCategories /> */}

      {/* 9. Blog Preview */}
      <BlogPreview />

      {/* Divider */}
      <div className="gold-divider" />

      {/* 10. FAQ */}
      <FAQSection />
    </>
  );
}
