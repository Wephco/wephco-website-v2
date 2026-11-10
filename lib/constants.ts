// import { PropertyCardProps } from "@/components/PropertyCard"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPercent } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6";
import wellahealth from '@/images/wellahealth.svg'
import aldar from '@/images/aldar.png'
import damac from '@/images/damac.svg'
import sober from '@/images/sober.png'
import aarano from '@/images/aarano.png'
import { MdDashboard, MdChatBubble, MdAttachMoney, MdVerifiedUser, MdNotifications, MdAnalytics, MdEvent, MdContactPhone, MdOutlineAssignment, MdWork } from "react-icons/md";
import { BiBuildings, BiSupport } from "react-icons/bi";
import { BsPeopleFill } from "react-icons/bs";
import { Role } from "@/interfaces/userInterface";


export const navbarMenu = [
    {
        label: 'Home',
        path: '/'
    },
    {
        label: 'Buy',
        path: '/properties'
    },
    {
        label: 'Sell',
        path: '/sell'
    },
    {
        label: 'Property Management',
        path: '/property-management'
    },
    {
        label: 'Services',
        path: '/services'
    },
    {
        label: 'Affiliates',
        path: '/affiliates'
    },
    {
        label: 'About Us',
        path: '/about'
    },
    {
        label: 'Events',
        path: '/events'
    }
]


export const newsArticles = [
    {
        publication: 'News Dairy',
        title: 'Wephco signs property partnership deal in Abu Dhabi',
        link: 'https://newsdiaryonline.com/wephco-signs-property-partnership-deal-in-abu-dhabi'
    },
    {
        publication: 'Leadership',
        title: 'Firm Woos Nigerians To Invest In Abu Dhabi Real Estate Sector',
        link: 'https://leadership.ng/firm-woos-nigerians-to-invest-in-abu-dhabi-real-estate-sector'
    },
    {
        publication: 'Daily Trust',
        title: 'Firm woos Nigerian investors to Abu Dhabi property',
        link: 'https://dailytrust.com/firm-woos-nigerian-investors-to-abu-dhabi-property/'
    },
    {
        publication: 'Freedom Online',
        title: 'Estate coy partners UAE govt. to promote investments abroad',
        link: 'https://freedomonline.com.ng/estate-coy-partners-uae-govt-to-promote-investments-abroad/?amp=1'
    },
    {
        publication: 'Blueprint',
        title: 'Firm urges Nigerians to invest in Abu Dhabi real sector',
        link: 'https://blueprint.ng/firm-urges-nigerians-to-invest-in-abu-dhabi-real-sector/'
    }
]

export const socialLinks = [
    {
        icon: FaFacebookF,
        link: 'https://www.facebook.com/wephco'
    },
    {
        icon: FaInstagram,
        link: 'https://www.instagram.com/wephco/'
    },
    {
        icon: FaXTwitter,
        link: 'https://x.com/wephco'
    },
    {
        icon: FaLinkedinIn,
        link: 'https://www.linkedin.com/wephco'
    }
]

export const partners = [
    {
        title: 'Wellahealth',
        image: wellahealth
    },
    {
        title: 'Aldar',
        image: aldar
    },
    {
        title: 'Damac',
        image: damac
    },
    {
        title: 'Sober',
        image: sober
    },
    {
        title: 'AA Rano',
        image: aarano
    },
]

export const dashboardMenu = [
    {
        label: 'Dashboard',
        icon: MdDashboard,
        path: '/dashboard'
    },
    {
        label: 'Users',
        icon: BsPeopleFill,
        path: '/dashboard/users'
    },
    {
        label: 'Withdrawals',
        icon: MdAttachMoney,
        path: '/dashboard/withdrawals'
    },
    {
        label: 'Consultations',
        icon: MdContactPhone,
        path: '/dashboard/consultations'
    },
    {
        label: 'Properties',
        icon: BiBuildings,
        path: '/dashboard/properties'
    },
    {
        label: 'Leads',
        icon: MdChatBubble,
        path: '/dashboard/leads'
    },
    {
        label: 'Support',
        icon: BiSupport,
        path: '/dashboard/support'
    },
    {
        label: 'Commission',
        icon: FaPercent,
        path: '/dashboard/commission'
    },
    {
        label: 'Send Notifications',
        icon: MdNotifications,
        path: '/dashboard/notifications'
    },
    {
        label: 'Analytics',
        icon: MdAnalytics,
        path: '/dashboard/analytics'
    },
    {
        label: 'Events',
        icon: MdEvent,
        path: '/dashboard/events'
    },
    {
        label: 'KYC',
        icon: MdVerifiedUser,
        path: '/dashboard/kyc'
    },
    {
        label: 'Project Waitlist',
        icon: MdOutlineAssignment,
        path: '/dashboard/project-waitlist'
    },
    {
        label: 'Careers',
        icon: MdWork,
        path: '/dashboard/careers'
    },
]

export const allowedRoles = [Role.ADMIN, Role.SUPERADMIN, Role.SUPPORT]

export const faqData = [
    {
        question: "Is Wephco a real estate company?",
        answer:
            "No, Wephco is a brokerage firm which positions us as an intermediary between the owner of the property and the buyer. We also have services such as property management.",
    },
    {
        question: "Does Wephco accept partnerships?",
        answer: "Most definitely!! We encourage and welcome partnerships.",
    },
    {
        question: "What is Wephco affiliate program?",
        answer:
            "It's a referral system that allows you to earn when a client purchases a property via your referral, all you have to do is book an appointment and we will take it from there.",
    },
    {
        question: "Are there extra costs apart from the price of the property?",
        answer: "No, there's no hidden charges or extra costs.",
    },
]


export const wephcoServices = {
    intro: 'At Wephco, we understand the unique opportunities and challenges within Nigeria and Africa’s real estate landscape. Our local services are designed to support executives, entrepreneurs, and families who seek profitable investments, luxury living, and long-term security within the continent.',
    international: [
        {
            title: 'International Property Brokerage',
            description: 'We connect African and global investors with high-value properties in prime markets such as the UAE, UK, Monaco, USA, Turkey, Australia, and Africa. Whether acquiring luxury residences, investment apartments, or commercial assets, we offer access to opportunities rarely available on the open market.'
        },
        {
            title: 'Deal Preparation & Coaching',
            description: 'We guide our clients through the complexities of international property transactions — from negotiations and legal compliance to financing structures. Our coaching ensures confidence and clarity in every deal.'
        },
    ],
    local: [
        {
            title: 'Residential & Luxury Homes',
            description: 'We specialize in sourcing and selling premium residences, from high-end apartments to exclusive estates. Whether you’re seeking a family home, a luxury penthouse, or a gated community property, Wephco ensures access to the finest options.'
        },
        {
            title: 'Commercial Property Brokerage',
            description: 'We connect investors with prime commercial spaces — office complexes, retail hubs, hotels, and mixed-use developments — positioned in growth-driven cities across Nigeria and Africa.'
        },
        {
            title: 'Land Acquisition & Development Advisory',
            description: 'For clients interested in land banking, estate development, or agricultural opportunities, we provide structured guidance on acquisition, regulatory compliance, and future appreciation potential.'
        },
        {
            title: 'Property Management & Leasing',
            description: 'Beyond acquisition, Wephco offers professional property management — handling leasing, tenant placement, and asset maintenance to ensure steady rental income and value protection.'
        },
        {
            title: 'Wephco Signature Living',
            description: 'Through our design and renovation division, we transform properties into modern, market-ready assets. From upscale interiors to structural enhancements, we maximize property value and appeal.'
        },
        {
            title: 'Escrow Verification',
            description: 'We provide escrow verification services to ensure secure and transparent property transactions.'
        }
    ],
    consultation: [
        {
            title: 'Acquisition Consultation',
            description: 'Every investor has a unique vision. Wephco provides tailored advisory sessions to align acquisitions with your long-term objectives — whether wealth preservation, portfolio diversification, or family legacy planning'
        },
        {
            title: 'Private Real Estate Advisory',
            description: 'Designed for ultra-high-net-worth individuals, our private advisory service offers discreet solutions for cross-border investments, residency-linked acquisitions, offshore holdings, and intergenerational wealth transfer'
        },
        {
            title: 'Investor Circle Access',
            description: 'Wephco clients enjoy membership in an exclusive circle where premium opportunities are shared ahead of the market. This ensures first-mover advantage on rare and highly profitable investments'
        },
        {
            title: 'Legacy & Wealth Structuring',
            description: 'Beyond acquisitions, we help investors structure real estate holdings in alignment with long-term goals — securing family security, estate planning, and generational influence'
        },
        {
            title: 'Investment Advisory',
            description: 'Our tailored advisory helps clients identify high-yield local projects, from affordable housing schemes to luxury estates. We align opportunities with your risk appetite, portfolio goals, and generational wealth strategy.'
        },
    ],
    outro: 'Wephco’s local property services bridge ambition with opportunity — providing Nigerian and African investors with a trusted pathway to secure wealth, luxury, and legacy at home.'
}

export const consultationServices = [
    { label: 'Property Brokerage', features: ['International Property Brokerage', 'Local Property Brokerage', 'Luxury Apartments'] },
    { label: 'Property Management', features: ['Property Management', 'Home Coming Investment', 'Investment Access', 'Global Investment Circle'] },
    { label: 'Private Consulting', features: ['Legacy & Wealth Structuring', 'Acquisition Vetting', 'Deal Preparation', 'Webinar/Seminar'] },
]

export const FIRESTORE_COLLECTIONS = {
    PROPERTIES: 'properties',
    CONSULTATIONS: 'consultations',
    USERS: 'users',
    LEADS: 'leads',
    COMMISSIONS: 'commissions',
    WITHDRAWALS: 'withdrawals',
    NOTIFICATIONS: 'notifications',
    ANALYTICS: 'analytics',
    KYC: 'kyc',
    INQUIRY: 'inquiry',
    JOB_APPLICATIONS: 'job_applications',
    CAREERS: 'careers',
    AFFILIATES: 'affiliates',
    EVENTS: 'events',
    MAGAZINES: 'magazines',
    PROJECT_WAITLIST: 'project_waitlist',
    PROJECT_WAITLIST_CONFIG: 'project_waitlist_config',
}

export const EMAIL_TEMPLATE_IDS = {
    CONSULTATION: '997873ab-0faf-4d49-b2c2-a3532434a668',
    PROPERTY_UPLOAD: '27bb4afd-efab-439f-afa4-13b6e83ebb35',
    PROPERTY_INQUIRY: '611d3795-4ada-4454-a7ba-85fc3fc3ce5f'
}

export interface IMembershipTier {
  id: string;
  name: string;
  price: string;
  priceAmount: number;
  currency: string;
  period: string;
  targetAudience: string;
  category: 'membership' | 'institutional';
  positioning: string;
  offers: string[];
}

export const WEPHCO_MEMBERSHIP_TIERS: IMembershipTier[] = [
  {
    id: 'insight',
    name: 'WEPHCO INSIGHT',
    price: 'FREE',
    priceAmount: 0,
    currency: 'USD',
    period: '/ year',
    targetAudience: 'General readers, young professionals, emerging investors and the African/global audience.',
    category: 'membership',
    positioning: 'Build the WEPHCO audience and convert free readers into premium members.',
    offers: [
      'Selected magazine articles',
      'Weekly investment intelligence',
      'Market and investment news',
      'Selected investment opportunities',
      'CEO interviews',
      'Africa market updates',
      'Access to selected webinars',
      'Event announcements',
      'WEPHCO newsletter',
    ],
  },
  {
    id: 'executive',
    name: 'WEPHCO EXECUTIVE',
    price: '$49',
    priceAmount: 49,
    currency: 'USD',
    period: '/ year',
    targetAudience: 'Professionals, executives, established investors and diaspora investors.',
    category: 'membership',
    positioning: 'For leaders who want to understand where capital, assets and opportunity are moving.',
    offers: [
      'Full digital magazine — 12 editions',
      'Premium investment intelligence',
      'Quarterly investment reports',
      'Africa Investment Radar',
      'Global Investment Destination reports',
      'Digital magazine archive',
      'CEO & Leadership Dialogues',
      'Priority event invitations',
      'Executive newsletters',
      'Selected online investment briefings',
      'Premium print editions where applicable',
    ],
  },
  {
    id: 'investor-circle',
    name: 'WEPHCO INVESTOR CIRCLE',
    price: '$299',
    priceAmount: 299,
    currency: 'USD',
    period: '/ year',
    targetAudience: 'Serious investors, entrepreneurs, senior executives and high-net-worth individuals.',
    category: 'membership',
    positioning: 'A private circle connecting capital, intelligence, relationships and opportunity.',
    offers: [
      'Everything in Executive',
      'Private investor briefings',
      'Investor roundtables',
      'Early access to WEPHCO reports',
      'WEPHCO Investment Watchlist',
      'Private investment intelligence sessions',
      'International investment forums',
      'Curated market opportunities',
      'Priority access to WEPHCO events',
      'Investor networking',
      'Annual Investor Intelligence Report',
      'Closed-door discussions',
    ],
  },
  {
    id: 'corporate-partner',
    name: 'WEPHCO CORPORATE & STRATEGIC PARTNER',
    price: 'From $1,999',
    priceAmount: 1999,
    currency: 'USD',
    period: '/ year',
    targetAudience: 'Banks, oil & gas companies, insurance companies, investment firms, law firms, airlines, developers, multinational corporations and institutions.',
    category: 'institutional',
    positioning: "More than a subscription, a strategic partnership connecting your organisation to Africa's emerging investment ecosystem.",
    offers: [
      'Corporate magazine access',
      'Multiple employee/user subscriptions',
      'Executive investment briefings',
      'Employee wealth & asset education',
      'Corporate investment intelligence',
      'CEO/Executive participation',
      'Thought-leadership opportunities',
      'Priority access to WEPHCO conferences',
      'Corporate roundtables',
      'Research collaboration',
      'Strategic event partnership',
      'Investment and networking opportunities',
      'Dedicated corporate relationship support',
    ],
  },
];
