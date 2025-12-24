/**
 * Strapi Types - Manually Defined Types for Frontend Use
 *
 * This file contains runtime-friendly TypeScript types for use in the frontend.
 * These types represent the actual data shape returned by Strapi v5 APIs.
 *
 * For the raw Strapi schema types (useful for type checking against the backend),
 * see: ./generated/index.ts
 *
 * To sync types from backend, run: npm run types:sync
 */

// =============================================================================
// BASE TYPES
// =============================================================================

/** Base fields present in all Strapi entities */
export interface StrapiBaseEntity {
  id: number;
  documentId: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

/** Base fields for media files */
export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  caption?: string | null;
  name?: string;
  width?: number;
  height?: number;
}

// =============================================================================
// LINK COMPONENTS
// =============================================================================

export interface Link {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
}

export interface Button {
  id: number;
  text: string;
  type: 'primary' | 'secondary';
}

export interface ButtonLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  type: 'primary' | 'secondary';
}

export interface SocialLink extends Link {
  social: 'YOUTUBE' | 'TWITTER' | 'DISCORD' | 'WEBSITE';
}

// =============================================================================
// CONTENT TYPES
// =============================================================================

export interface Category extends StrapiBaseEntity {
  name: string;
  slug: string;
  description?: string;
  articles: Article[];
}

export interface Author extends StrapiBaseEntity {
  name: string;
  email?: string;
  avatar: StrapiMedia;
  articles?: Article[];
}

export interface Article extends StrapiBaseEntity {
  title: string;
  description: string;
  slug: string;
  cover: StrapiMedia;
  category: Category;
  authorsBio: Author;
  blocks: ArticleBlock[];
  seo?: Seo;
}

export interface ProductFeature extends StrapiBaseEntity {
  name: string;
}

export interface Page extends StrapiBaseEntity {
  shortName?: string;
  slug: string;
  heading?: string;
  description?: string;
  contentSections: PageSection[];
  seo?: Seo;
}

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

export interface Seo {
  metaTitle: string;
  metaDescription: string;
  shareImage?: StrapiMedia;
}

export interface Metadata {
  metaTitle: string;
  metaDescription: string;
}

// =============================================================================
// ELEMENT COMPONENTS
// =============================================================================

export interface Feature {
  id: number;
  title: string;
  description: string;
  showLink?: boolean;
  newTab?: boolean;
  url?: string;
  text?: string;
  media?: StrapiMedia;
}

export interface FeatureColumn {
  id: number;
  title: string;
  description: string;
  icon: StrapiMedia;
}

export interface FeatureRow {
  id: number;
  title: string;
  description: string;
  media: StrapiMedia;
  link?: Link;
}

export interface Plan {
  id: number;
  name: string;
  description: string;
  price: number;
  pricePeriod: string;
  isRecommended: boolean;
  product_features: ProductFeature[];
}

export interface Testimonial {
  id: number;
  text: string;
  authorName: string;
  picture: StrapiMedia;
}

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

export interface Logo {
  logoImg: StrapiMedia;
  logoText?: string;
}

export interface Navbar {
  navbarLogo: Logo;
  links: Link[];
  button?: ButtonLink;
}

export interface Footer {
  footerLogo: Logo;
  menuLinks: Link[];
  legalLinks: Link[];
  socialLinks: SocialLink[];
  categories: Category[];
}

export interface NotificationBanner {
  id: number;
  heading: string;
  text: string;
  show: boolean;
  type: 'alert' | 'info' | 'warning';
  link: Link;
}

// =============================================================================
// GLOBAL CONTENT TYPE
// =============================================================================

export interface Global extends StrapiBaseEntity {
  metadata: Metadata;
  favicon: StrapiMedia;
  notificationBanner: NotificationBanner;
  navbar: Navbar;
  footer: Footer;
}

// =============================================================================
// PAGE SECTIONS (Dynamic Zone Components)
// =============================================================================

interface BaseSectionComponent {
  id: number;
  __component: string;
}

export interface HeroSection extends BaseSectionComponent {
  __component: 'sections.hero';
  title: string;
  description: string;
  picture: StrapiMedia;
  buttons: ButtonLink[];
}

export interface BottomActionsSection extends BaseSectionComponent {
  __component: 'sections.bottom-actions';
  title: string;
  description: string;
  buttons: ButtonLink[];
}

export interface FeatureColumnsGroupSection extends BaseSectionComponent {
  __component: 'sections.feature-columns-group';
  features: FeatureColumn[];
}

export interface FeatureRowsGroupSection extends BaseSectionComponent {
  __component: 'sections.feature-rows-group';
  features: FeatureRow[];
}

export interface TestimonialsGroupSection extends BaseSectionComponent {
  __component: 'sections.testimonials-group';
  title: string;
  description: string;
  testimonials: Testimonial[];
}

export interface LargeVideoSection extends BaseSectionComponent {
  __component: 'sections.large-video';
  title: string;
  description: string;
  video: StrapiMedia;
  poster?: StrapiMedia;
}

export interface RichTextSection extends BaseSectionComponent {
  __component: 'sections.rich-text';
  content: string;
}

export interface PricingSection extends BaseSectionComponent {
  __component: 'sections.pricing';
  title: string;
  plans: Plan[];
}

export interface LeadFormSection extends BaseSectionComponent {
  __component: 'sections.lead-form';
  title: string;
  description: string;
  emailPlaceholder: string;
  location?: string;
  submitButton: Button;
}

export interface FeaturesSection extends BaseSectionComponent {
  __component: 'sections.features';
  heading: string;
  description: string;
  feature: Feature[];
}

export interface HeadingSection extends BaseSectionComponent {
  __component: 'sections.heading';
  heading: string;
  description?: string;
}

/** Union type for all page sections */
export type PageSection =
  | HeroSection
  | BottomActionsSection
  | FeatureColumnsGroupSection
  | FeatureRowsGroupSection
  | TestimonialsGroupSection
  | LargeVideoSection
  | RichTextSection
  | PricingSection
  | LeadFormSection
  | FeaturesSection
  | HeadingSection;

// =============================================================================
// ARTICLE BLOCKS (Dynamic Zone Components)
// =============================================================================

export interface MediaBlock extends BaseSectionComponent {
  __component: 'shared.media';
  file: StrapiMedia;
}

export interface QuoteBlock extends BaseSectionComponent {
  __component: 'shared.quote';
  title?: string;
  body: string;
  author?: string;
}

export interface RichTextBlock extends BaseSectionComponent {
  __component: 'shared.rich-text';
  body: string;
}

export interface SliderBlock extends BaseSectionComponent {
  __component: 'shared.slider' | 'shared.image-slider';
  files: StrapiMedia[];
}

export interface VideoEmbedBlock extends BaseSectionComponent {
  __component: 'shared.video-embed';
  url: string;
}

/** Union type for all article blocks */
export type ArticleBlock =
  | MediaBlock
  | QuoteBlock
  | RichTextBlock
  | SliderBlock
  | VideoEmbedBlock;

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiListResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
