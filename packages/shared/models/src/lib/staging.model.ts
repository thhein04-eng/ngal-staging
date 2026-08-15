/**
 * Domain models for the Northlight Home Staging marketing site.
 */

export type PropertyType =
  | 'single-family'
  | 'condo'
  | 'townhouse'
  | 'loft'
  | 'luxury-estate';

export type ServiceTier = 'consultation' | 'occupied' | 'vacant' | 'luxury';

/** A staging package offered to sellers and their agents. */
export interface StagingService {
  id: ServiceTier;
  name: string;
  tagline: string;
  description: string;
  /** Starting price in USD. */
  priceFrom: number;
  /** How the starting price is billed, e.g. "per project". */
  priceUnit: string;
  /** Typical turnaround, e.g. "2-3 days". */
  turnaround: string;
  features: string[];
  /** Whether to highlight this package as the most popular choice. */
  featured: boolean;
}

/** A completed staging project shown in the portfolio. */
export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  propertyType: PropertyType;
  neighborhood: string;
  squareFeet: number;
  /** Path to the "before" photograph. */
  beforeImage: string;
  /** Path to the "after" photograph. */
  afterImage: string;
  summary: string;
  /** Days the listing sat on market after staging. */
  daysOnMarket: number;
  listPrice: number;
  salePrice: number;
  year: number;
  service: ServiceTier;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
  /** Whole-star rating from 1 to 5. */
  rating: number;
}

/** One step in the "how it works" sequence. */
export interface ProcessStep {
  order: number;
  title: string;
  description: string;
  duration: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  credentials: string[];
}

/** A headline metric shown in the stat band. */
export interface ImpactStat {
  label: string;
  value: string;
  detail: string;
}

export interface ServiceArea {
  city: string;
  state: string;
  neighborhoods: string[];
}

export interface CompanyInfo {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  foundedYear: number;
  hours: string;
}

export type ProjectTimeline =
  | 'asap'
  | 'two-weeks'
  | 'one-month'
  | 'just-exploring';

/** Payload captured by the quote request form. */
export interface QuoteRequest {
  name: string;
  email: string;
  phone: string;
  propertyAddress: string;
  propertyType: PropertyType;
  service: ServiceTier;
  squareFeet: number | null;
  timeline: ProjectTimeline;
  message: string;
  consent: boolean;
}

/** Result of submitting a quote request. */
export interface QuoteRequestResult {
  reference: string;
  receivedAt: string;
}
