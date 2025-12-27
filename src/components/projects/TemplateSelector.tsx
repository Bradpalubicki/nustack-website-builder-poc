'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Layout, Stethoscope, Scale, ShoppingBag, Building, Briefcase } from 'lucide-react';

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  industry?: string;
  features: string[];
  thumbnail?: string;
  icon: React.ReactNode;
}

interface TemplateSelectorProps {
  selectedTemplate: Template | null;
  onSelect: (template: Template) => void;
}

const TEMPLATES: Template[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch with a minimal foundation',
    category: 'General',
    features: ['Full customization', 'No preset content', 'Clean slate'],
    icon: <Layout className="h-8 w-8" />,
  },
  {
    id: 'healthcare-practice',
    name: 'Medical Practice',
    description: 'HIPAA-ready template for healthcare providers',
    category: 'Healthcare',
    industry: 'healthcare',
    features: [
      'E-E-A-T compliant',
      'Medical schema',
      'HIPAA considerations',
      'Patient portal ready',
    ],
    icon: <Stethoscope className="h-8 w-8" />,
  },
  {
    id: 'law-firm',
    name: 'Law Firm',
    description: 'Professional template for legal practices',
    category: 'Legal',
    industry: 'legal',
    features: [
      'Attorney profiles',
      'Practice areas',
      'Case results',
      'Bar rule compliant',
    ],
    icon: <Scale className="h-8 w-8" />,
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Store',
    description: 'Complete online store with product catalog',
    category: 'E-Commerce',
    industry: 'ecommerce',
    features: [
      'Product catalog',
      'Shopping cart',
      'Checkout flow',
      'Inventory management',
    ],
    icon: <ShoppingBag className="h-8 w-8" />,
  },
  {
    id: 'real-estate',
    name: 'Real Estate Agency',
    description: 'Property listings and agent profiles',
    category: 'Real Estate',
    industry: 'real_estate',
    features: [
      'Property listings',
      'Agent profiles',
      'MLS integration ready',
      'Map search',
    ],
    icon: <Building className="h-8 w-8" />,
  },
  {
    id: 'business',
    name: 'Business Website',
    description: 'Professional business presence',
    category: 'Business',
    industry: 'technology',
    features: [
      'Service pages',
      'Team section',
      'Contact forms',
      'Testimonials',
    ],
    icon: <Briefcase className="h-8 w-8" />,
  },
];

export function TemplateSelector({ selectedTemplate, onSelect }: TemplateSelectorProps) {
  const [filter, setFilter] = useState<string>('all');

  const categories = ['all', ...new Set(TEMPLATES.map((t) => t.category))];

  const filteredTemplates =
    filter === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === filter);

  return (
    <div>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {category === 'all' ? 'All Templates' : category}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => {
          const isSelected = selectedTemplate?.id === template.id;

          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'ring-2 ring-primary border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div
                    className={`p-3 rounded-lg ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {template.icon}
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <CardTitle className="mt-3">{template.name}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {template.features.slice(0, 3).map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {template.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{template.features.length - 3} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
