import {
  conditions_link,
  landing_page_cta_link,
  legal_mentions,
  privacy_link,
} from "@/lib/utils/settings";
import type { LandingLogo } from "./shared/type";
import type { LandingPageContent } from "./type";

const logo: LandingLogo = {
  src: "/images/immoask_business_logo.png",
  alt: "ImmoAsk Business",
  width: 1613,
  height: 770,
  href: "#top",
};

const ownerFeatures = [
  "Unlimited rental agreements",
  "Unlimited properties",
  "Unlimited tenant accounts",
  "Accounting for all your properties",
  "Tax management for all properties",
  "Identity reports on prospective tenants",
  "5 real estate agents per vacant property",
  "All maintenance requests",
  "Unlimited inspection reports",
  "WhatsApp and email rent reminders",
  "Unlimited rent collection from all tenants",
];

const proFeatures = [
  "Unlimited properties",
  "Unlimited rental agreements",
  "Unlimited management agreements",
  "Unlimited move-in and move-out inspections",
  "Full accounting of properties and rents",
  "Simplified property taxation",
  "Unrestricted rent collection",
  "Identity reports on tenant applicants",
  "Centralized, unlimited maintenance requests",
  "Maintenance tracking",
  "Unlimited rent reminders (WhatsApp and email)",
  "Free promotion of your properties",
  "Property management statement at any time",
];

/** English content of the ImmoAsk Business landing page. */
export const landingPageContentEn: LandingPageContent = {
  ui: {
    navLabel: "Main navigation",
    switchLanguage: "Switch to French",
    switchLanguageCode: "FR",
    switchToDark: "Turn on dark mode",
    switchToLight: "Turn on light mode",
  },

  header: {
    logo,
    links: [
      { label: "Platform", href: "#plateformes" },
      { label: "Benefits", href: "#valeur" },
      { label: "Plans", href: "#formules" },
      { label: "Reviews", href: "#avis" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: { label: "Get started", href: landing_page_cta_link, variant: "primary" },
  },

  hero: {
    title: "Your property portfolio deserves",
    highlight: "smarter management.",
    description:
      "Smart property management, wherever you are. The solution built for diaspora landlords and ambitious real estate professionals.",
    actions: [
      { label: "Start for free", href: landing_page_cta_link, variant: "primary", withArrow: true },
      { label: "See the demo", href: landing_page_cta_link, variant: "ghost" },
    ],
    trustItems: ["Free, no commitment", "Tax-compliant contracts"],
    phone: {
      title: "October rent",
      location: "Agoè",
      amount: "150,000",
      currency: "FCFA",
      rows: [
        { label: "Rent received", caption: "Mixx by Yas" },
        { label: "Receipt sent", caption: "WhatsApp" },
        { label: "Transfer on its way", caption: "Ecobank, Paris" },
      ],
      chips: [
        { label: "Automatic transfer", caption: "On the 5th of every month" },
        { label: "Tenant up to date", caption: "No reminders needed" },
      ],
    },
  },

  marquee: {
    items: ["Paris", "Lyon", "Montreal", "Brussels", "Lomé", "Geneva"],
  },

  platforms: {
    heading: {
      title: "On mobile. On the web.",
      subtitle: "One platform, two ways to manage.",
    },
    mock: {
      webLabel: "Web",
      mobileLabel: "Mobile",
      kpis: [
        { value: "12", label: "Buildings" },
        { value: "98%", label: "Rents up to date" },
        { value: "5", label: "Transfer day" },
      ],
      chartBars: [45, 70, 55, 85, 62, 95, 75, 100],
      amount: "150,000",
      currency: "FCFA",
      mobileRows: ["Rent received", "Receipt sent"],
    },
    features: [
      {
        icon: "phone",
        title: "Mobile app",
        description: "Mobile Money payments, WhatsApp receipts, quote approvals.",
      },
      {
        icon: "monitor",
        title: "Web platform",
        description: "Multi-building portfolio, accounting ledger, tax statement export.",
      },
    ],
  },

  beforeAfter: {
    heading: { title: "No more informal arrangements." },
    items: [
      { before: "Family tensions", after: "A neutral intermediary" },
      { before: "Unpaid rent", after: "Recovery handled by ImmoAsk" },
      { before: "Late rent", after: "Transfer every 5th of the month" },
      { before: "Inflated quotes", after: "Before and after photos" },
      { before: "Legal grey areas", after: "Tax-compliant contracts" },
    ],
  },

  features: {
    heading: { title: "Everything, from your phone." },
    tiles: [
      {
        icon: "phone",
        title: "Mobile Money\nand WhatsApp receipts",
        description: "Zero cash. Instant receipt.",
        span: 4,
        highlighted: true,
      },
      { icon: "bank", title: "Bank transfer", description: "Ecobank, BOA, IBAN.", span: 2 },
      { icon: "wrench", title: "Vetted tradespeople", description: "Photos and approved quotes.", span: 2 },
      {
        icon: "shield",
        title: "Legal peace of mind",
        description: "Leases, deposits, files always in order.",
        span: 4,
      },
    ],
  },

  stats: {
    items: [
      { value: 5, label: "Transfer on the 5th of the month" },
      { value: 100, suffix: "%", label: "Everything on mobile or web" },
      { value: 0, label: "Hidden fees" },
    ],
  },

  pricing: {
    heading: {
      title: "Gentle plans.",
      subtitle: "Landlords and real estate professionals. No hidden fees.",
    },
    audiences: [
      {
        id: "own",
        label: "Landlord",
        plans: [
          {
            name: "Essential",
            price: "5.99%",
            priceUnit: "of rent collected",
            description: "From 1 to 100 leases. You manage, with ImmoAsk Business.",
            features: ownerFeatures,
            cta: { label: "Choose Essential", href: landing_page_cta_link },
          },
          {
            name: "Serenity",
            price: "4.99%",
            priceUnit: "of rent collected",
            description: "101 leases and more. You manage, with ImmoAsk Business.",
            features: ownerFeatures,
            cta: { label: "Choose Serenity", href: landing_page_cta_link },
            featured: true,
            tag: "Large portfolio",
          },
          {
            name: "Elite",
            price: "10%",
            priceUnit: "of rent collected",
            description: "Everything in Serenity, plus:",
            features: [
              "Dedicated property manager",
              "Renovation tracking",
              "Ongoing maintenance follow-up",
              "Guaranteed recovery of unpaid rent",
              "Free tenant search when vacant",
              "3 quotes per maintenance request",
              "Handling of minor disputes between parties",
            ],
            cta: { label: "Go Elite", href: landing_page_cta_link },
          },
        ],
      },
      {
        id: "pro",
        label: "Agencies, bailiffs, notaries",
        plans: [
          {
            name: "Business",
            price: "0.79999",
            priceUnit: "USD per lease, per month",
            priceUnitOnNewLine: true,
            description: "From 1 to 100 rental agreements.",
            features: proFeatures,
            cta: { label: "Request access", href: landing_page_cta_link },
          },
          {
            name: "Business Plus",
            price: "0.59999",
            priceUnit: "USD per lease, per month",
            priceUnitOnNewLine: true,
            description: "101 rental agreements and more.",
            features: proFeatures,
            cta: { label: "Request access", href: landing_page_cta_link },
            featured: true,
            tag: "Best rate",
          },
        ],
      },
    ],
  },

  testify: {
    heading: { title: "They sleep better." },
    testimonials: [
      {
        quote: "My sister no longer has to deal with tenants. The rent lands in my Ecobank account.",
        author: "Koffi M.",
        meta: "Agoè, living in Lyon",
      },
      {
        quote: "I see every repair in photos before I pay. Flawless.",
        author: "Abla D.",
        meta: "Tokoin, Montreal",
      },
      {
        quote: "My days are for my patients, not for chasing rent.",
        author: "Dr. Emmanuel K.",
        meta: "Baguida, Lomé",
        initial: "E",
      },
    ],
  },

  faq: {
    heading: { title: "Frequently asked questions." },
    items: [
      {
        question: "How do I receive my rent?",
        answer: "Automatic transfer on the 5th of every month to France, Canada or Lomé.",
      },
      {
        question: "What if a tenant pays late?",
        answer: "Automatic WhatsApp reminders and calls, then follow-up by our team.",
      },
      {
        question: "Is there a commitment?",
        answer: "No. You can leave whenever you want.",
      },
      {
        question: "How are tradespeople chosen?",
        answer: "Vetted by our team and by you. You approve every quote before work starts.",
      },
    ],
  },

  cta: {
    title: "Ready to manage stress-free?",
    description:
      "Join more than 450 diaspora landlords and 100 real estate agents, notaries and bailiffs who already trust us.",
    actions: [
      { label: "Get started now", href: landing_page_cta_link, variant: "white" },
      { label: "WhatsApp +228 91 84 90 90", href: "#", variant: "glass" },
    ],
  },

  footer: {
    logo,
    links: [
      { label: "Terms", href: conditions_link },
      { label: "Privacy", href: privacy_link },
      { label: "Legal notice", href: legal_mentions },
      { label: "Help", href: "#" },
    ],
    copyright: "© 2026 ImmoAsk Business by ImmoAsk with Omnisoft Africa",
  },
};
