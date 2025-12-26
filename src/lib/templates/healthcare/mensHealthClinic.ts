/**
 * Men's Health Clinic Template
 *
 * Complete template configuration for men's health practices
 * including ED, TRT, weight loss, and hair restoration services.
 */

import type { HealthcareTemplate } from '@/types/healthcare';

export const mensHealthClinicTemplate: HealthcareTemplate = {
  id: 'mens-health-clinic',
  name: "Men's Health Clinic",
  description: 'ED, TRT, Weight Loss, Hair Restoration',
  industry: 'healthcare',
  subCategory: 'mens_health',
  thumbnail: '/templates/mens-health-thumb.png',
  demoUrl: 'https://demo-mens-health.nustack.dev',

  features: [
    'Multi-location support',
    'Treatment service pages',
    'Local SEO pages (location × service)',
    'Health library with E-E-A-T compliance',
    'Appointment booking system',
    'HIPAA-aware contact forms',
    'Schema markup (12 types)',
    'Conversion tracking',
    'Medical reviewer badges',
    'Patient testimonials with schema',
  ],

  defaultServices: [
    {
      name: 'Erectile Dysfunction Treatment',
      slug: 'erectile-dysfunction',
      category: 'sexual_health',
      treatments: ['Shockwave Therapy', 'Injection Therapy', 'PRP Therapy', 'Oral Medications'],
    },
    {
      name: 'Testosterone Replacement Therapy',
      slug: 'testosterone-therapy',
      category: 'hormone',
      treatments: ['TRT Injections', 'Testosterone Pellets', 'Hormone Testing'],
    },
    {
      name: 'Medical Weight Loss',
      slug: 'weight-loss',
      category: 'weight',
      treatments: ['Semaglutide', 'Tirzepatide', 'B12 Injections', 'Nutritional Counseling'],
    },
    {
      name: 'Hair Restoration',
      slug: 'hair-restoration',
      category: 'hair',
      treatments: ['FUE Hair Transplant', 'NeoGraft', 'PRP Hair Therapy', 'Medical Treatment'],
    },
  ],

  pages: [
    { path: '/', name: 'Homepage', description: 'Hero, services overview, testimonials, trust signals' },
    { path: '/about', name: 'About Us', description: 'Practice story, team, mission, values' },
    { path: '/team', name: 'Our Team', description: 'Physician profiles with E-E-A-T compliance' },
    { path: '/team/[physician]', name: 'Physician Profile', description: 'Individual provider page' },
    { path: '/treatments', name: 'Treatments Index', description: 'All services with filtering' },
    { path: '/treatments/[service]', name: 'Service Page', description: 'Individual service details' },
    { path: '/treatments/[service]/[treatment]', name: 'Treatment Page', description: 'Specific treatment option' },
    { path: '/locations', name: 'Locations Index', description: 'All clinic locations' },
    { path: '/locations/[location]', name: 'Location Page', description: 'Individual location with NAP' },
    { path: '/locations/[location]/[service]', name: 'Local SEO Page', description: 'Location + Service combo' },
    { path: '/health-library', name: 'Health Library', description: 'Articles index with categories' },
    { path: '/health-library/[category]', name: 'Category Page', description: 'Articles by category' },
    { path: '/health-library/[category]/[slug]', name: 'Article Page', description: 'Individual article with E-E-A-T' },
    { path: '/book-appointment', name: 'Book Appointment', description: 'Appointment request form' },
    { path: '/special-offers', name: 'Special Offers', description: 'Current promotions and packages' },
    { path: '/patient-reviews', name: 'Reviews', description: 'Testimonials with aggregate rating' },
    { path: '/contact', name: 'Contact', description: 'Contact form with all locations' },
    { path: '/privacy-policy', name: 'Privacy Policy', description: 'Privacy and HIPAA information' },
    { path: '/disclaimer', name: 'Medical Disclaimer', description: 'Full medical disclaimer' },
  ],

  schemaTypes: [
    'Organization',
    'MedicalBusiness',
    'MedicalClinic',
    'Physician',
    'LocalBusiness',
    'FAQPage',
    'Article',
    'MedicalWebPage',
    'BreadcrumbList',
    'Review',
    'AggregateRating',
    'Service',
    'MedicalProcedure',
    'MedicalTherapy',
    'Offer',
  ],

  requiredIntegrations: ['supabase', 'resend'],
  optionalIntegrations: ['twilio', 'calendly', 'ga4', 'gtm', 'pixel'],

  setupWizard: [
    {
      step: 1,
      title: 'Practice Information',
      fields: ['practice_name', 'specialty', 'year_established', 'phone', 'email'],
    },
    {
      step: 2,
      title: 'Medical Director',
      fields: ['director_name', 'credentials', 'npi', 'bio', 'image', 'specialties'],
    },
    {
      step: 3,
      title: 'Locations',
      fields: ['locations_array'],
      minimum: 1,
      canAddCustom: true,
    },
    {
      step: 4,
      title: 'Services',
      fields: ['services_selection'],
      canAddCustom: true,
    },
    {
      step: 5,
      title: 'Branding',
      fields: ['logo', 'primary_color', 'secondary_color', 'fonts'],
    },
    {
      step: 6,
      title: 'Domain & Deployment',
      fields: ['domain', 'subdomain', 'ssl'],
    },
  ],
};

export default mensHealthClinicTemplate;
