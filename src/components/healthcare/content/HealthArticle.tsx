'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, BookOpen, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MedicalReviewer } from '../eeat/MedicalReviewer';
import { LastUpdatedBadge } from '../eeat/LastUpdatedBadge';
import { ArticleCitations } from '../eeat/ArticleCitations';
import { AuthorBio } from '../eeat/AuthorBio';
import { MedicalDisclaimer } from '../eeat/MedicalDisclaimer';
import { FAQPageSchema } from '../schema/FAQPageSchema';
import { ArticleSchema } from '../schema/ArticleSchema';
import type { HealthArticle as HealthArticleType, FAQItem, Citation, MedicalService } from '@/types/healthcare';

export interface HealthArticleProps {
  /** Article data */
  article: HealthArticleType;
  /** Show table of contents */
  showTableOfContents?: boolean;
  /** Show related articles */
  showRelatedArticles?: boolean;
  /** Show related services */
  showRelatedServices?: boolean;
  /** Related articles data */
  relatedArticles?: HealthArticleType[];
  /** Related services data */
  relatedServices?: MedicalService[];
  /** FAQs for the article */
  faqs?: FAQItem[];
  /** Publisher info for schema */
  publisher?: {
    name: string;
    url: string;
    logo: string;
  };
  /** Base URL for the site */
  baseUrl?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Extract headings from markdown content for TOC
 */
function extractHeadings(content: string): Array<{ level: number; text: string; id: string }> {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Array<{ level: number; text: string; id: string }> = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text.toLowerCase().replace(/[^\w]+/g, '-');
    headings.push({ level, text, id });
  }

  return headings;
}

/**
 * Table of Contents Component
 */
function TableOfContents({
  headings,
  className,
}: {
  headings: Array<{ level: number; text: string; id: string }>;
  className?: string;
}) {
  if (headings.length === 0) return null;

  return (
    <Card className={cn('sticky top-4', className)}>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          Table of Contents
        </h3>
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={cn(heading.level === 3 && 'ml-4')}
              >
                <a
                  href={`#${heading.id}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </CardContent>
    </Card>
  );
}

/**
 * Related Article Card
 */
function RelatedArticleCard({ article }: { article: HealthArticleType }) {
  return (
    <a
      href={`/health-library/${article.slug}`}
      className="group block p-4 border rounded-lg hover:border-primary transition-colors"
    >
      {article.featuredImageUrl && (
        <img
          src={article.featuredImageUrl}
          alt={article.featuredImageAlt || article.title}
          className="w-full h-32 object-cover rounded mb-3"
        />
      )}
      <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
        {article.title}
      </h4>
      {article.excerpt && (
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>
      )}
      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        <span>{article.readingTime} min read</span>
      </div>
    </a>
  );
}

/**
 * Related Service Card
 */
function RelatedServiceCard({ service }: { service: MedicalService }) {
  return (
    <a
      href={`/treatments/${service.slug}`}
      className="group flex items-center justify-between p-4 border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
    >
      <div>
        <h4 className="font-medium group-hover:text-primary transition-colors">
          {service.name}
        </h4>
        {service.shortDescription && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
            {service.shortDescription}
          </p>
        )}
      </div>
      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
    </a>
  );
}

/**
 * HealthArticle Component
 *
 * Full article layout with E-E-A-T compliance.
 * Includes medical reviewer, citations, author bio, and schema markup.
 */
export function HealthArticle({
  article,
  showTableOfContents = true,
  showRelatedArticles = true,
  showRelatedServices = true,
  relatedArticles = [],
  relatedServices = [],
  faqs = [],
  publisher,
  baseUrl = '',
  className,
}: HealthArticleProps) {
  const headings = extractHeadings(article.content);
  const articleUrl = `${baseUrl}/health-library/${article.slug}`;

  return (
    <article className={cn('', className)} itemScope itemType="https://schema.org/Article">
      {/* Schema Markup */}
      {publisher && (
        <ArticleSchema
          headline={article.title}
          description={article.excerpt || article.metaDescription || ''}
          image={article.featuredImageUrl ? [article.featuredImageUrl] : []}
          datePublished={article.publishedAt || article.createdAt}
          dateModified={article.updatedAt}
          author={{
            name: article.authorName || 'Medical Team',
            type: 'Person',
            image: article.authorImageUrl,
            jobTitle: article.authorCredentials,
          }}
          publisher={publisher}
          mainEntityOfPage={articleUrl}
          wordCount={article.wordCount}
          articleSection={article.category}
          articleType="MedicalWebPage"
        />
      )}

      {faqs.length > 0 && <FAQPageSchema faqs={faqs} mainEntityOfPage={articleUrl} />}

      {/* Article Header */}
      <header className="mb-8">
        {/* Category Badge */}
        {article.category && (
          <Badge variant="secondary" className="mb-4">
            {article.category}
          </Badge>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4" itemProp="headline">
          {article.title}
        </h1>

        {/* Meta Info Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
          {article.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <time dateTime={article.publishedAt} itemProp="datePublished">
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          )}
          {article.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{article.readingTime} min read</span>
            </div>
          )}
          {article.wordCount && <span>{article.wordCount.toLocaleString()} words</span>}
        </div>

        {/* Medical Reviewer Badge */}
        {article.medicalReviewerName && (
          <MedicalReviewer
            name={article.medicalReviewerName}
            credentials={article.medicalReviewerCredentials || ''}
            imageUrl={article.medicalReviewerImageUrl}
            reviewDate={article.lastReviewedAt || article.updatedAt}
            variant="badge"
          />
        )}

        {/* Last Updated */}
        <div className="mt-4">
          <LastUpdatedBadge date={article.updatedAt} label="Last updated" variant="text" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Table of Contents (Sidebar on Desktop) */}
        {showTableOfContents && headings.length > 0 && (
          <aside className="hidden lg:block lg:col-span-1">
            <TableOfContents headings={headings} />
          </aside>
        )}

        {/* Article Body */}
        <div className={cn('lg:col-span-3', !showTableOfContents && 'lg:col-span-4')}>
          {/* Featured Image */}
          {article.featuredImageUrl && (
            <figure className="mb-8">
              <img
                src={article.featuredImageUrl}
                alt={article.featuredImageAlt || article.title}
                className="w-full rounded-lg"
                itemProp="image"
              />
              {article.featuredImageAlt && (
                <figcaption className="text-sm text-muted-foreground mt-2 text-center">
                  {article.featuredImageAlt}
                </figcaption>
              )}
            </figure>
          )}

          {/* Mobile TOC */}
          {showTableOfContents && headings.length > 0 && (
            <div className="lg:hidden mb-8">
              <TableOfContents headings={headings} />
            </div>
          )}

          {/* Article Content */}
          <div
            className="prose prose-slate max-w-none"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* FAQs */}
          {faqs.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Citations */}
          {article.citations && article.citations.length > 0 && (
            <ArticleCitations
              citations={article.citations as Citation[]}
              variant="endnotes"
              showAccessedDate
            />
          )}

          <Separator className="my-8" />

          {/* Author Bio */}
          {article.authorName && (
            <AuthorBio
              name={article.authorName}
              credentials={article.authorCredentials || ''}
              imageUrl={article.authorImageUrl}
              bio={article.authorBio || ''}
              role="Health Content Writer"
            />
          )}

          {/* Related Services */}
          {showRelatedServices && relatedServices.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Related Treatments</h2>
              <div className="grid gap-3">
                {relatedServices.map((service) => (
                  <RelatedServiceCard key={service.id} service={service} />
                ))}
              </div>
            </section>
          )}

          {/* Related Articles */}
          {showRelatedArticles && relatedArticles.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold mb-4">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.slice(0, 4).map((relatedArticle) => (
                  <RelatedArticleCard key={relatedArticle.id} article={relatedArticle} />
                ))}
              </div>
            </section>
          )}

          {/* Medical Disclaimer */}
          <div className="mt-12">
            <MedicalDisclaimer variant="footer" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default HealthArticle;
