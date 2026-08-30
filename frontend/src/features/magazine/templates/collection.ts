import type { PageDraft } from './builders';

import streetStyle from './street-style';
import startupPitch from './startup-pitch';
import islandEscape from './island-escape';
import bakeryJournal from './bakery-journal';
import weddingAlbum from './wedding-album';
import wanderlogMono from './wanderlog-mono';
import concreteMinimal from './concrete-minimal';
import aiWeekly from './ai-weekly';
import slowLiving from './slow-living';
import urbanLoft from './urban-loft';
import skincareCatalogue from './skincare-catalogue';
import illustrationAnnual from './illustration-annual';
import communityGazette from './community-gazette';
import alumniReview from './alumni-review';
import portraitPortfolio from './portrait-portfolio';
import sustainabilityReport from './sustainability-report';
import paperInkJournal from './paper-ink-journal';
import coastalFashion from './coastal-fashion';

import architectureReview from './architecture-review';
import boldTypography from './bold-typography';
import corporateReport from './corporate-report';
import creativeStudio from './creative-studio';
import designerPortfolio from './designer-portfolio';
import educationMagazine from './education-magazine';
import foodRestaurant from './food-restaurant';
import lifestyleMagazine from './lifestyle-magazine';
import luxuryFashion from './luxury-fashion';
import luxuryProduct from './luxury-product';
import minimalEditorial from './minimal-editorial';
import modernBusiness from './modern-business';
import modernGrid from './modern-grid';
import monoNoir from './mono-noir';
import newsEditorial from './news-editorial';
import photographyPortfolio from './photography-portfolio';
import productCatalogue from './product-catalogue';
import realEstateShowcase from './real-estate-showcase';
import scandinavianClean from './scandinavian-clean';
import technologyEditorial from './technology-editorial';
import travelJournal from './travel-journal';

/**
 * Page data for every template, keyed by slug.
 *
 * This module is only ever reached through a dynamic import (see
 * `templates/index.ts`) so the template library route can render its filters,
 * search and card skeletons from static metadata before any page data is
 * downloaded.
 */
export const TEMPLATE_PAGES: Record<string, PageDraft[]> = {
  'minimal-editorial': minimalEditorial,
  'luxury-fashion': luxuryFashion,
  'modern-business': modernBusiness,
  'corporate-report': corporateReport,
  'travel-journal': travelJournal,
  'food-restaurant': foodRestaurant,
  'photography-portfolio': photographyPortfolio,
  'architecture-review': architectureReview,
  'technology-editorial': technologyEditorial,
  'lifestyle-magazine': lifestyleMagazine,
  'real-estate-showcase': realEstateShowcase,
  'product-catalogue': productCatalogue,
  'creative-studio': creativeStudio,
  'news-editorial': newsEditorial,
  'education-magazine': educationMagazine,
  'bold-typography': boldTypography,
  'mono-noir': monoNoir,
  'scandinavian-clean': scandinavianClean,
  'modern-grid': modernGrid,
  'luxury-product': luxuryProduct,
  'designer-portfolio': designerPortfolio,
  'street-style': streetStyle,
  'startup-pitch': startupPitch,
  'island-escape': islandEscape,
  'bakery-journal': bakeryJournal,
  'wedding-album': weddingAlbum,
  'concrete-minimal': concreteMinimal,
  'ai-weekly': aiWeekly,
  'slow-living': slowLiving,
  'urban-loft': urbanLoft,
  'skincare-catalogue': skincareCatalogue,
  'illustration-annual': illustrationAnnual,
  'community-gazette': communityGazette,
  'alumni-review': alumniReview,
  'portrait-portfolio': portraitPortfolio,
  'sustainability-report': sustainabilityReport,
  'paper-ink-journal': paperInkJournal,
  'coastal-fashion': coastalFashion,
  'wanderlog-mono': wanderlogMono,
};
