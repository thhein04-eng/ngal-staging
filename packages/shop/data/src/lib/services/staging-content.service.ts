import { Service, computed, signal } from '@angular/core';
import {
  CompanyInfo,
  FaqItem,
  ImpactStat,
  PortfolioProject,
  ProcessStep,
  PropertyType,
  ServiceArea,
  ServiceTier,
  StagingService,
  TeamMember,
  Testimonial,
} from '@org/models';

const COMPANY: CompanyInfo = {
  name: 'Northlight',
  legalName: 'Northlight Home Staging LLC',
  tagline: 'Homes that photograph beautifully and sell faster.',
  description:
    'Northlight is a full-service home staging studio in Portland, Oregon. We prepare listings for market with furniture, art, and styling chosen for the room — and for the buyer walking through it.',
  phone: '(503) 555-0147',
  email: 'hello@northlightstaging.com',
  street: '2140 NW Quimby Street, Suite 3',
  city: 'Portland',
  state: 'OR',
  postalCode: '97210',
  foundedYear: 2014,
  hours: 'Monday–Friday, 9am–6pm',
};

const SERVICES: StagingService[] = [
  {
    id: 'consultation',
    name: 'Staging Consultation',
    tagline: 'A room-by-room plan you can act on yourself.',
    description:
      'A two-hour walkthrough with a stager who documents what to keep, store, repair, and replace. You leave with a written plan and a prioritised punch list, ready to execute on your own.',
    priceFrom: 395,
    priceUnit: 'per visit',
    turnaround: 'Booked within 3 days',
    features: [
      'Two-hour on-site walkthrough',
      'Written room-by-room action plan',
      'Prioritised repair and decluttering list',
      'Paint, lighting, and hardware recommendations',
      'Photography prep checklist',
      'Fee credited toward any full staging package',
    ],
    featured: false,
  },
  {
    id: 'occupied',
    name: 'Occupied Staging',
    tagline: 'You keep living there. It still shows like a model home.',
    description:
      'We work with what you already own, edit it down, and fill the gaps with our inventory. Designed for sellers who need the house to stay livable while it is on the market.',
    priceFrom: 1850,
    priceUnit: 'per project',
    turnaround: '2–3 days on site',
    features: [
      'Full walkthrough and staging plan',
      'Editing and restyling of your existing furniture',
      'Supplemental furniture, art, and accessories',
      'Primary living spaces, kitchen, and main bedroom',
      '60-day rental period included',
      'De-staging and pickup after closing',
    ],
    featured: true,
  },
  {
    id: 'vacant',
    name: 'Vacant Staging',
    tagline: 'An empty house is a hard sell. We fix that.',
    description:
      'Complete furnishing of an empty property, from sofas down to the towels. Buyers see scale, flow, and a life they can picture themselves in rather than bare drywall.',
    priceFrom: 3200,
    priceUnit: 'per project',
    turnaround: '3–5 days on site',
    features: [
      'Full furnishing from our 12,000 sq ft warehouse',
      'Living, dining, kitchen, primary bed, and bath',
      'Art, lighting, rugs, and full accessory styling',
      'Curb appeal and entryway treatment',
      '60-day rental period included',
      'Delivery, install, and removal handled by our crew',
    ],
    featured: false,
  },
  {
    id: 'luxury',
    name: 'Luxury Portfolio',
    tagline: 'For listings where every detail is scrutinised.',
    description:
      'Our designer-led tier for premium properties. Custom-sourced pieces, original artwork from Pacific Northwest artists, and a staging plan built alongside your listing photographer.',
    priceFrom: 7500,
    priceUnit: 'per project',
    turnaround: '5–10 days on site',
    features: [
      'Lead designer assigned to your listing',
      'Custom-sourced and rented designer furniture',
      'Original regional artwork',
      'Every room staged, including outdoor spaces',
      'Coordination with your photographer and videographer',
      '90-day rental period included',
    ],
    featured: false,
  },
];

const PROJECTS: PortfolioProject[] = [
  {
    id: 'p1',
    slug: 'alberta-arts-craftsman',
    title: 'Alberta Arts Craftsman',
    propertyType: 'single-family',
    neighborhood: 'Alberta Arts',
    squareFeet: 2180,
    beforeImage: '/images/projects/alberta-before.svg',
    afterImage: '/images/projects/alberta-after.svg',
    summary:
      'A 1912 craftsman with beautiful bones buried under thirty years of accumulated furniture. We cleared the sightlines, lightened the palette, and let the original millwork carry the room.',
    daysOnMarket: 6,
    listPrice: 785000,
    salePrice: 842000,
    year: 2025,
    service: 'occupied',
  },
  {
    id: 'p2',
    slug: 'pearl-district-loft',
    title: 'Pearl District Loft',
    propertyType: 'loft',
    neighborhood: 'Pearl District',
    squareFeet: 1340,
    beforeImage: '/images/projects/pearl-before.svg',
    afterImage: '/images/projects/pearl-after.svg',
    summary:
      'An empty concrete shell that photographed cold and felt smaller than it was. Warm textiles and a defined dining zone gave the open plan a sense of scale.',
    daysOnMarket: 9,
    listPrice: 615000,
    salePrice: 638000,
    year: 2025,
    service: 'vacant',
  },
  {
    id: 'p3',
    slug: 'irvington-foursquare',
    title: 'Irvington Foursquare',
    propertyType: 'single-family',
    neighborhood: 'Irvington',
    squareFeet: 3050,
    beforeImage: '/images/projects/irvington-before.svg',
    afterImage: '/images/projects/irvington-after.svg',
    summary:
      'Six bedrooms of mismatched furniture reading as clutter in photos. A restrained neutral base with a single accent colour per floor brought the whole listing together.',
    daysOnMarket: 4,
    listPrice: 1150000,
    salePrice: 1245000,
    year: 2024,
    service: 'occupied',
  },
  {
    id: 'p4',
    slug: 'west-hills-estate',
    title: 'West Hills Estate',
    propertyType: 'luxury-estate',
    neighborhood: 'West Hills',
    squareFeet: 5400,
    beforeImage: '/images/projects/west-hills-before.svg',
    afterImage: '/images/projects/west-hills-after.svg',
    summary:
      'A newly built estate that felt like a showroom rather than a home. Layered textures, commissioned landscape paintings, and softened lighting made the scale feel welcoming.',
    daysOnMarket: 21,
    listPrice: 2850000,
    salePrice: 2790000,
    year: 2025,
    service: 'luxury',
  },
  {
    id: 'p5',
    slug: 'sellwood-townhouse',
    title: 'Sellwood Townhouse',
    propertyType: 'townhouse',
    neighborhood: 'Sellwood-Moreland',
    squareFeet: 1620,
    beforeImage: '/images/projects/sellwood-before.svg',
    afterImage: '/images/projects/sellwood-after.svg',
    summary:
      'A narrow three-storey plan where every room fought the staircase. Slim-profile furniture and vertical art gave each floor a clear purpose.',
    daysOnMarket: 11,
    listPrice: 549000,
    salePrice: 561000,
    year: 2024,
    service: 'vacant',
  },
  {
    id: 'p6',
    slug: 'south-waterfront-condo',
    title: 'South Waterfront Condo',
    propertyType: 'condo',
    neighborhood: 'South Waterfront',
    squareFeet: 1105,
    beforeImage: '/images/projects/waterfront-before.svg',
    afterImage: '/images/projects/waterfront-after.svg',
    summary:
      'A high-floor unit whose river view was competing with a dark accent wall. We repainted, lowered the furniture profile, and put the window back in charge of the room.',
    daysOnMarket: 8,
    listPrice: 720000,
    salePrice: 749000,
    year: 2025,
    service: 'vacant',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    quote:
      'I have used four staging companies in twelve years of listing homes. Northlight is the only one my sellers thank me for. The Alberta craftsman had three offers before the second open house.',
    author: 'Deborah Ellsworth',
    role: 'Principal Broker',
    company: 'Ellsworth & Vance Realty',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'We were sceptical about spending money on a house we were leaving. It came back to us many times over, and honestly the house looked better staged than it did in the six years we lived in it.',
    author: 'Marcus Oyelaran',
    role: 'Seller',
    company: 'Irvington',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'The consultation alone was worth it. They gave us a list, we worked through it over two weekends, and the listing photos looked like a different property.',
    author: 'Priya Raghunathan',
    role: 'Seller',
    company: 'Sellwood-Moreland',
    rating: 5,
  },
  {
    id: 't4',
    quote:
      'Their crew works clean and they hit their install dates, which matters more than people realise when you are coordinating photography and a listing launch.',
    author: 'Tomasz Wieczorek',
    role: 'Listing Agent',
    company: 'Cascade Property Group',
    rating: 4,
  },
];

const PROCESS: ProcessStep[] = [
  {
    order: 1,
    title: 'Walkthrough',
    description:
      'We visit the property, photograph every room, and talk through your timeline, your listing price, and who is likely to buy the house.',
    duration: '90 minutes',
  },
  {
    order: 2,
    title: 'Staging plan',
    description:
      'You receive a written plan with a room-by-room scope, the inventory we intend to bring, and a fixed quote. Nothing gets ordered until you approve it.',
    duration: '2–3 days',
  },
  {
    order: 3,
    title: 'Install',
    description:
      'Our crew delivers and styles everything in a single visit. You come back to a finished house, ready for the photographer the following morning.',
    duration: '1 day on site',
  },
  {
    order: 4,
    title: 'Market and de-stage',
    description:
      'The staging stays through your rental period. Once you close, we schedule a pickup and remove everything without a mark on the walls.',
    duration: '60 days included',
  },
];

const FAQS: FaqItem[] = [
  {
    id: 'f1',
    question: 'Does staging actually change what the house sells for?',
    answer:
      'It reliably changes how quickly a house sells, and on our own projects it has usually moved the final number too. Across the listings we staged in 2024 and 2025, homes went pending in an average of nine days against a regional average of thirty-one. We are careful not to promise a specific dollar figure — too much of that depends on price, location, and the market that month.',
  },
  {
    id: 'f2',
    question: 'How far ahead should I book?',
    answer:
      'Two to three weeks before your listing date is comfortable. Spring and early summer fill up faster, so if you are listing between March and July, get on the calendar earlier. We do hold slots for rush jobs and can sometimes turn a vacant property around in under a week.',
  },
  {
    id: 'f3',
    question: 'Can I stay in the house while it is staged?',
    answer:
      'Yes — that is exactly what our occupied staging package is for. We work around your furniture and your life, and we will tell you honestly which of your pieces are helping and which are working against the listing photos.',
  },
  {
    id: 'f4',
    question: 'What happens if the house does not sell in 60 days?',
    answer:
      'The rental period extends month to month at a reduced rate, typically around fifteen percent of the original staging fee. We will also come back and refresh the styling at no charge if the listing is going stale and you want new photos.',
  },
  {
    id: 'f5',
    question: 'Do you work with agents directly?',
    answer:
      'Constantly. Roughly seventy percent of our work comes through listing agents, and we are comfortable billing at closing through escrow when the brokerage prefers that arrangement.',
  },
  {
    id: 'f6',
    question: 'What areas do you cover?',
    answer:
      'The Portland metro area and immediate suburbs. We travel to Salem, Hood River, and the coast for luxury portfolio projects, with a travel fee quoted up front.',
  },
];

const TEAM: TeamMember[] = [
  {
    id: 'm1',
    name: 'Ingrid Halvorsen',
    role: 'Founder & Lead Designer',
    bio: 'Ingrid spent nine years in residential interior design before founding Northlight in 2014, after watching too many good houses photograph badly. She still leads every luxury portfolio project personally.',
    image: '/images/team/ingrid.svg',
    credentials: ['ASP Master Stager', 'IAHSP Member', 'B.F.A. Interior Design'],
  },
  {
    id: 'm2',
    name: 'Devon Marchetti',
    role: 'Studio Director',
    bio: 'Devon runs the warehouse, the crews, and the install calendar. If your staging arrives on the day it was promised, that is Devon.',
    image: '/images/team/devon.svg',
    credentials: ['ASP Certified Stager', 'Licensed General Contractor'],
  },
  {
    id: 'm3',
    name: 'Alethea Nakamura',
    role: 'Senior Stager',
    bio: 'Alethea specialises in occupied staging and has an unusual talent for finding the one piece a homeowner already owns that will anchor the whole room.',
    image: '/images/team/alethea.svg',
    credentials: ['ASP Certified Stager', 'RESA Member'],
  },
];

const STATS: ImpactStat[] = [
  {
    value: '9 days',
    label: 'Average time to pending',
    detail: 'Across 128 listings staged in 2024–2025, against a regional average of 31 days.',
  },
  {
    value: '412',
    label: 'Homes staged since 2014',
    detail: 'From 900 sq ft condos to 5,400 sq ft estates across the Portland metro.',
  },
  {
    value: '12,000',
    label: 'Sq ft of inventory',
    detail: 'Our own warehouse, so we are never waiting on a rental house to deliver.',
  },
  {
    value: '70%',
    label: 'Work from agent referrals',
    detail: 'Most of our projects come from listing agents we have worked with before.',
  },
];

const SERVICE_AREAS: ServiceArea[] = [
  {
    city: 'Portland',
    state: 'OR',
    neighborhoods: [
      'Alberta Arts',
      'Irvington',
      'Pearl District',
      'Sellwood-Moreland',
      'South Waterfront',
      'West Hills',
      'Laurelhurst',
      'Hawthorne',
    ],
  },
  {
    city: 'Lake Oswego',
    state: 'OR',
    neighborhoods: ['First Addition', 'Lake Grove', 'Forest Highlands'],
  },
  {
    city: 'Beaverton',
    state: 'OR',
    neighborhoods: ['Central Beaverton', 'Cedar Hills', 'Raleigh Hills'],
  },
  {
    city: 'Vancouver',
    state: 'WA',
    neighborhoods: ['Felida', 'Uptown Village', 'Salmon Creek'],
  },
];

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  'single-family': 'Single family',
  condo: 'Condo',
  townhouse: 'Townhouse',
  loft: 'Loft',
  'luxury-estate': 'Luxury estate',
};

/**
 * Serves the static marketing content for the site.
 *
 * Content is held in memory rather than fetched — this is a brochure site, and
 * keeping it local means every page renders on the server without a round trip.
 */
@Service()
export class StagingContentService {
  private readonly projectFilter = signal<ServiceTier | 'all'>('all');

  readonly company: CompanyInfo = COMPANY;
  readonly services: readonly StagingService[] = SERVICES;
  readonly projects: readonly PortfolioProject[] = PROJECTS;
  readonly testimonials: readonly Testimonial[] = TESTIMONIALS;
  readonly process: readonly ProcessStep[] = PROCESS;
  readonly faqs: readonly FaqItem[] = FAQS;
  readonly team: readonly TeamMember[] = TEAM;
  readonly stats: readonly ImpactStat[] = STATS;
  readonly serviceAreas: readonly ServiceArea[] = SERVICE_AREAS;

  /** The currently selected portfolio filter. */
  readonly activeFilter = this.projectFilter.asReadonly();

  /** Projects matching the active filter, newest first. */
  readonly filteredProjects = computed(() => {
    const filter = this.projectFilter();
    const projects =
      filter === 'all'
        ? this.projects
        : this.projects.filter((project) => project.service === filter);

    return [...projects].sort((a, b) => b.year - a.year);
  });

  /** The three most recent projects, for the home page preview. */
  readonly featuredProjects = computed(() =>
    [...this.projects].sort((a, b) => a.daysOnMarket - b.daysOnMarket).slice(0, 3)
  );

  /** The package we lead with on the home page. */
  readonly featuredService = computed(
    () => this.services.find((service) => service.featured) ?? this.services[0]
  );

  setFilter(filter: ServiceTier | 'all'): void {
    this.projectFilter.set(filter);
  }

  getServiceById(id: ServiceTier): StagingService | undefined {
    return this.services.find((service) => service.id === id);
  }

  getProjectBySlug(slug: string): PortfolioProject | undefined {
    return this.projects.find((project) => project.slug === slug);
  }

  propertyTypeLabel(type: PropertyType): string {
    return PROPERTY_TYPE_LABELS[type];
  }
}
