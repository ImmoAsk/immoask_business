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
  "Contrats de location illimités",
  "Biens immobiliers illimités",
  "Comptes locataires illimités",
  "Comptabilité de tous vos biens",
  "Gestion fiscale de tous les biens",
  "Rapports d'identité des aspirants locataires",
  "5 agents immobiliers par bien vacant",
  "Toutes les requêtes de maintenance",
  "États des lieux illimités",
  "Rappels WhatsApp et e-mail des loyers",
  "Encaissement illimité de tous les locataires",
];

const proFeatures = [
  "Biens immobiliers illimités",
  "Contrats de location illimités",
  "Contrats de gestion illimités",
  "États des lieux d'entrée et de sortie sans limite",
  "Suivi comptable complet des biens et des loyers",
  "Fiscalité immobilière simplifiée",
  "Encaissement des loyers sans restriction",
  "Rapports d'identité des candidats locataires",
  "Requêtes de maintenance centralisées et illimitées",
  "Suivi des maintenances",
  "Rappels de loyers illimités (WhatsApp et e-mail)",
  "Promotion gratuite de vos biens",
  "Relevé de gestion immobilière en tout temps",
];

/** French content of the ImmoAsk Business landing page (default language). */
export const landingPageContent: LandingPageContent = {
  ui: {
    navLabel: "Navigation principale",
    switchLanguage: "Passer en anglais",
    switchLanguageCode: "EN",
    switchToDark: "Activer le mode sombre",
    switchToLight: "Activer le mode clair",
  },

  header: {
    logo,
    links: [
      { label: "Plateforme", href: "#plateformes" },
      { label: "Avantages", href: "#valeur" },
      { label: "Formules", href: "#formules" },
      { label: "Avis", href: "#avis" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: { label: "Démarrer", href: landing_page_cta_link, variant: "primary" },
  },

  hero: {
    title: "Votre patrimoine immobilier mérite",
    highlight: "une gestion plus intelligente.",
    description:
      "La gestion immobilière intelligente, où que vous soyez. La solution pensée pour les propriétaires de la diaspora et les professionnels de l'immobilier ambitieux.",
    actions: [
      { label: "Démarrer gratuitement", href: landing_page_cta_link, variant: "primary", withArrow: true },
      { label: "Voir la démo", href: landing_page_cta_link, variant: "ghost" },
    ],
    trustItems: ["Gratuit sans engagement", "Contrats conformes aux normes fiscales"],
    phone: {
      title: "Loyer d'octobre",
      location: "Agoè",
      amount: "150 000",
      currency: "FCFA",
      rows: [
        { label: "Loyer reçu", caption: "Mixx by Yas" },
        { label: "Quittance envoyée", caption: "WhatsApp" },
        { label: "Virement en route", caption: "Ecobank, Paris" },
      ],
      chips: [
        { label: "Virement automatique", caption: "Le 5 de chaque mois" },
        { label: "Locataire à jour", caption: "Aucune relance" },
      ],
    },
  },

  marquee: {
    items: ["Paris", "Lyon", "Montréal", "Bruxelles", "Lomé", "Genève","USA","Allemagne","Espagne","Nigeria"],
  },

  platforms: {
    heading: {
      title: "Sur mobile. Sur web.",
      subtitle: "Une seule plateforme, deux façons de gérer.",
    },
    mock: {
      webLabel: "Web",
      mobileLabel: "Mobile",
      kpis: [
        { value: "12", label: "Immeubles" },
        { value: "98%", label: "Loyers à jour" },
        { value: "5", label: "Virement le" },
      ],
      chartBars: [45, 70, 55, 85, 62, 95, 75, 100],
      amount: "150 000",
      currency: "FCFA",
      mobileRows: ["Loyer reçu", "Quittance envoyée"],
    },
    features: [
      {
        icon: "phone",
        title: "Application mobile",
        description: "Paiements Mobile Money, quittances WhatsApp, validation des devis.",
      },
      {
        icon: "monitor",
        title: "Plateforme web",
        description: "Portefeuille multi-immeubles, registre comptable, export du relevé fiscal.",
      },
    ],
  },

  beforeAfter: {
    heading: { title: "Fini les arrangements informels." },
    items: [
      { before: "Tensions familiales", after: "Un intermédiaire neutre" },
      { before: "Loyers impayés", after: "Recouvrement assuré par ImmoAsk" },
      { before: "Retards de loyer", after: "Virement chaque 5 du mois" },
      { before: "Devis gonflés", after: "Photos avant et après" },
      { before: "Flou juridique", after: "Contrats conformes aux normes fiscales" },
    ],
  },

  features: {
    heading: { title: "Tout, depuis votre téléphone." },
    tiles: [
      {
        icon: "phone",
        title: "Mobile Money\net quittance WhatsApp",
        description: "Zéro espèces. Reçu instantané.",
        span: 4,
        highlighted: true,
      },
      { icon: "bank", title: "Virement bancaire", description: "Ecobank, BOA, IBAN.", span: 2 },
      { icon: "wrench", title: "Artisans vérifiés", description: "Photos et devis validés.", span: 2 },
      {
        icon: "shield",
        title: "Sérénité juridique",
        description: "Baux, cautions, dossier toujours en règle.",
        span: 4,
      },
    ],
  },

  stats: {
    items: [
      { value: 5, label: "Virement le 5 du mois" },
      { value: 100, suffix: "%", label: "Tout via le mobile ou le web" },
      { value: 0, label: "Frais cachés" },
    ],
  },

  pricing: {
    heading: {
      title: "Des formules douces.",
      subtitle: "Propriétaires et professionnels de l'immobilier. Aucun frais caché.",
    },
    audiences: [
      {
        id: "own",
        label: "Propriétaire",
        plans: [
          {
            name: "Essentiel",
            price: "5,99%",
            priceUnit: "des loyers perçus",
            description: "De 1 à 100 contrats. Vous gérez, avec ImmoAsk Business.",
            features: ownerFeatures,
            cta: { label: "Choisir Essentiel", href: landing_page_cta_link },
          },
          {
            name: "Sérénité",
            price: "4,99%",
            priceUnit: "des loyers perçus",
            description: "101 contrats et plus. Vous gérez, avec ImmoAsk Business.",
            features: ownerFeatures,
            cta: { label: "Choisir Sérénité", href: landing_page_cta_link },
            featured: true,
            tag: "Grand portefeuille",
          },
          {
            name: "Élite",
            price: "10%",
            priceUnit: "des loyers perçus",
            description: "Tout Sérénité, et en plus :",
            features: [
              "Gestionnaire immobilier dédié",
              "Suivi des rénovations",
              "Suivi continu des maintenances",
              "Recouvrement assuré en cas d'impayés",
              "Prospection gratuite en cas de vacance",
              "3 devis par demande de maintenance",
              "Gestion des conflits mineurs entre parties",
            ],
            cta: { label: "Opter pour l'Élite", href: landing_page_cta_link },
          },
        ],
      },
      {
        id: "pro",
        label: "Agences, huissiers, notaires",
        plans: [
          {
            name: "Business",
            price: "0,79999",
            priceUnit: "USD par contrat, par mois",
            priceUnitOnNewLine: true,
            description: "De 1 à 100 contrats de location.",
            features: proFeatures,
            cta: { label: "Demander l'accès", href: landing_page_cta_link },
          },
          {
            name: "Business Plus",
            price: "0,59999",
            priceUnit: "USD par contrat, par mois",
            priceUnitOnNewLine: true,
            description: "101 contrats de location et plus.",
            features: proFeatures,
            cta: { label: "Demander l'accès", href: landing_page_cta_link },
            featured: true,
            tag: "Meilleur tarif",
          },
        ],
      },
    ],
  },

  testify: {
    heading: { title: "Ils dorment mieux." },
    testimonials: [
      {
        quote: "Ma sœur ne subit plus les locataires. Le loyer arrive sur mon compte Ecobank.",
        author: "Koffi M.",
        meta: "Agoè, résident à Lyon",
      },
      {
        quote: "Je vois chaque réparation en photo avant de payer. Impeccable.",
        author: "Abla D.",
        meta: "Tokoin, Montréal",
      },
      {
        quote: "Mes journées sont pour mes patients, plus pour les relances.",
        author: "Dr. Emmanuel K.",
        meta: "Baguida, Lomé",
        initial: "E",
      },
    ],
  },

  faq: {
    heading: { title: "Questions fréquentes." },
    items: [
      {
        question: "Comment je reçois mes loyers ?",
        answer: "Virement automatique le 5 de chaque mois vers la France, le Canada ou Lomé.",
      },
      {
        question: "Et si un locataire est en retard ?",
        answer: "Relances WhatsApp automatiques et Appels, puis suivi par notre équipe.",
      },
      {
        question: "Y a-t-il un engagement ?",
        answer: "Non. Vous partez quand vous voulez.",
      },
      {
        question: "Comment sont choisis les artisans ?",
        answer: "Vérifiés par notre équipe et par vous. Vous validez chaque devis avant les travaux.",
      },
    ],
  },

  cta: {
    title: "Prêt à gérer sans stress ?",
    description:
      "Rejoignez plus de 450 propriétaires de la diaspora et 100 agents immobiliers, notaires et huissiers qui nous font déjà confiance.",
    actions: [
      { label: "Démarrer maintenant", href: landing_page_cta_link, variant: "white" },
      { label: "WhatsApp +228 91 84 90 90", href: "#", variant: "glass" },
    ],
  },

  footer: {
    logo,
    links: [
      { label: "Conditions", href: conditions_link },
      { label: "Confidentialité", href: privacy_link },
      { label: "Mentions légales", href: legal_mentions },
      { label: "Aide", href: "#" },
    ],
    copyright: "© 2026 ImmoAsk Business by ImmoAsk avec Omnisoft Africa",
  },
};
