-- Healthcare SEO Module - Database Migration
-- This migration adds healthcare-specific functionality to the NuStack Builder

-- ============================================================================
-- PREREQUISITE: Ensure projects table exists (from base NuStack Builder)
-- ============================================================================

-- Create projects table if it doesn't exist (base table needed for healthcare module)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    template VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    domain VARCHAR(255),
    user_id UUID,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 1: medical_practices
-- Extends project data with medical-specific information
-- ============================================================================

CREATE TABLE medical_practices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100), -- 'mens_health', 'dermatology', 'dental', 'med_spa', 'chiropractic'
    npi_number VARCHAR(20), -- National Provider Identifier
    medical_director_name VARCHAR(255),
    medical_director_credentials VARCHAR(100), -- 'MD, FAAMFM', 'DMD', etc.
    medical_director_image_url TEXT,
    medical_director_bio TEXT,
    year_established INTEGER,
    accreditations TEXT[], -- ['AACE', 'AMA', etc.]
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id)
);

-- ============================================================================
-- TABLE 2: practice_locations
-- Multi-location support with full NAP (Name, Address, Phone)
-- ============================================================================

CREATE TABLE practice_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES medical_practices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- 'Green Bay Clinic'
    slug VARCHAR(100) NOT NULL, -- 'green-bay'
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    state_full VARCHAR(100), -- 'Wisconsin'
    zip VARCHAR(10) NOT NULL,
    country VARCHAR(2) DEFAULT 'US',
    phone VARCHAR(20) NOT NULL,
    fax VARCHAR(20),
    email VARCHAR(255),
    google_maps_embed TEXT,
    google_business_url TEXT,
    google_place_id VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    service_areas TEXT[], -- ['Ashwaubenon', 'De Pere', 'Appleton']
    hours JSONB, -- {"monday": {"open": "8:00 AM", "close": "5:00 PM"}, ...}
    holiday_hours JSONB,
    is_primary BOOLEAN DEFAULT false,
    accepts_new_patients BOOLEAN DEFAULT true,
    parking_info TEXT,
    accessibility_info TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(practice_id, slug)
);

-- ============================================================================
-- TABLE 3: medical_services
-- Treatment/service definitions
-- ============================================================================

CREATE TABLE medical_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES medical_practices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, -- 'Erectile Dysfunction Treatment'
    slug VARCHAR(100) NOT NULL, -- 'erectile-dysfunction'
    short_name VARCHAR(100), -- 'ED Treatment'
    category VARCHAR(100), -- 'sexual_health', 'hormone', 'weight', 'hair', 'aesthetics'
    parent_service_id UUID REFERENCES medical_services(id), -- for hierarchical services
    description TEXT,
    short_description VARCHAR(500),
    benefits TEXT[],
    ideal_candidate TEXT,
    procedure_overview TEXT,
    recovery_time VARCHAR(100),
    results_timeline VARCHAR(100),
    price_from DECIMAL(10, 2),
    price_to DECIMAL(10, 2),
    price_note VARCHAR(255), -- 'Starting at', 'Per session'
    duration VARCHAR(50), -- '30 minutes'
    icon VARCHAR(50), -- lucide icon name
    hero_image_url TEXT,
    gallery_images TEXT[],
    is_featured BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    schema_type VARCHAR(50), -- 'MedicalProcedure', 'MedicalTherapy', etc.
    medical_specialty VARCHAR(100), -- schema.org MedicalSpecialty
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(practice_id, slug)
);

-- ============================================================================
-- TABLE 4: treatment_options
-- Sub-treatments under services (e.g., Shockwave under ED)
-- ============================================================================

CREATE TABLE treatment_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES medical_services(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    how_it_works TEXT,
    benefits TEXT[],
    side_effects TEXT[],
    contraindications TEXT[],
    session_count VARCHAR(50), -- '6-12 sessions'
    session_duration VARCHAR(50),
    price_from DECIMAL(10, 2),
    price_to DECIMAL(10, 2),
    fda_approved BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(service_id, slug)
);

-- ============================================================================
-- TABLE 5: location_services
-- Junction table for location-specific service offerings
-- ============================================================================

CREATE TABLE location_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES practice_locations(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES medical_services(id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT true,
    local_phone VARCHAR(20), -- location-specific booking line
    local_price_from DECIMAL(10, 2), -- location-specific pricing
    local_price_to DECIMAL(10, 2),
    wait_time VARCHAR(50), -- 'Same day appointments available'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(location_id, service_id)
);

-- ============================================================================
-- TABLE 6: health_articles
-- E-E-A-T compliant health content
-- ============================================================================

CREATE TABLE health_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES medical_practices(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    excerpt TEXT,
    content TEXT NOT NULL, -- Markdown content
    featured_image_url TEXT,
    featured_image_alt TEXT,
    author_name VARCHAR(255),
    author_credentials VARCHAR(100),
    author_image_url TEXT,
    author_bio TEXT,
    medical_reviewer_name VARCHAR(255),
    medical_reviewer_credentials VARCHAR(100),
    medical_reviewer_image_url TEXT,
    citations JSONB DEFAULT '[]', -- [{url, title, source, accessed_date}]
    related_services UUID[], -- references medical_services
    related_articles UUID[],
    category VARCHAR(100), -- 'conditions', 'treatments', 'wellness', 'news'
    tags TEXT[],
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    word_count INTEGER,
    reading_time INTEGER, -- minutes
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'review', 'published'
    published_at TIMESTAMPTZ,
    last_reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(practice_id, slug)
);

-- ============================================================================
-- TABLE 7: article_faqs
-- FAQ items for articles (for FAQPage schema)
-- ============================================================================

CREATE TABLE article_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID NOT NULL REFERENCES health_articles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 8: seo_landing_pages
-- Symptom-based and keyword-targeted pages
-- ============================================================================

CREATE TABLE seo_landing_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES medical_practices(id) ON DELETE CASCADE,
    page_type VARCHAR(50) NOT NULL, -- 'symptom', 'near_me', 'comparison', 'cost', 'condition_location'
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    h1_heading VARCHAR(255),
    target_keywords TEXT[], -- ['hair transplant near me', 'FUE hair transplant']
    secondary_keywords TEXT[],
    content TEXT,
    hero_section JSONB,
    related_services UUID[],
    target_locations UUID[], -- for hyper-local pages
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    canonical_url TEXT,
    noindex BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(practice_id, slug)
);

-- ============================================================================
-- TABLE 9: testimonials
-- Patient reviews with schema support
-- ============================================================================

CREATE TABLE testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES medical_practices(id) ON DELETE CASCADE,
    location_id UUID REFERENCES practice_locations(id),
    service_id UUID REFERENCES medical_services(id),
    patient_name VARCHAR(100) NOT NULL,
    patient_initials VARCHAR(10), -- 'J.D.'
    patient_location VARCHAR(100), -- 'Green Bay, WI'
    patient_image_url TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT NOT NULL,
    treatment_received VARCHAR(255),
    verified BOOLEAN DEFAULT false,
    source VARCHAR(50), -- 'google', 'healthgrades', 'internal'
    source_url TEXT,
    display_on_homepage BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 10: physician_profiles
-- Individual provider profiles for E-E-A-T
-- ============================================================================

CREATE TABLE physician_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practice_id UUID NOT NULL REFERENCES medical_practices(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    credentials VARCHAR(100), -- 'MD, FAAMFM'
    title VARCHAR(255), -- 'Medical Director'
    specialties TEXT[],
    bio TEXT,
    education JSONB, -- [{institution, degree, year}]
    certifications JSONB, -- [{name, issuer, year}]
    memberships TEXT[], -- ['American Medical Association', etc.]
    image_url TEXT,
    accepting_patients BOOLEAN DEFAULT true,
    locations UUID[], -- practice_locations they work at
    services UUID[], -- medical_services they provide
    years_experience INTEGER,
    languages TEXT[] DEFAULT ARRAY['English'],
    npi_number VARCHAR(20),
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(practice_id, slug)
);

-- ============================================================================
-- TABLE 11: service_faqs
-- FAQ items for service pages
-- ============================================================================

CREATE TABLE service_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES medical_services(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE 12: location_service_pages
-- Generated local SEO pages (location x service combinations)
-- ============================================================================

CREATE TABLE location_service_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID NOT NULL REFERENCES practice_locations(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES medical_services(id) ON DELETE CASCADE,
    slug VARCHAR(200) NOT NULL, -- 'green-bay/erectile-dysfunction'
    h1_heading VARCHAR(255),
    content TEXT,
    faqs JSONB DEFAULT '[]', -- [{question, answer}]
    meta_title VARCHAR(70),
    meta_description VARCHAR(160),
    schema_data JSONB,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(location_id, service_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Medical Practices
CREATE INDEX idx_medical_practices_project ON medical_practices(project_id);

-- Practice Locations
CREATE INDEX idx_practice_locations_practice ON practice_locations(practice_id);
CREATE INDEX idx_practice_locations_slug ON practice_locations(slug);
CREATE INDEX idx_practice_locations_city_state ON practice_locations(city, state);

-- Medical Services
CREATE INDEX idx_medical_services_practice ON medical_services(practice_id);
CREATE INDEX idx_medical_services_category ON medical_services(category);
CREATE INDEX idx_medical_services_slug ON medical_services(slug);
CREATE INDEX idx_medical_services_parent ON medical_services(parent_service_id);

-- Treatment Options
CREATE INDEX idx_treatment_options_service ON treatment_options(service_id);

-- Location Services
CREATE INDEX idx_location_services_location ON location_services(location_id);
CREATE INDEX idx_location_services_service ON location_services(service_id);

-- Health Articles
CREATE INDEX idx_health_articles_practice ON health_articles(practice_id);
CREATE INDEX idx_health_articles_status ON health_articles(status);
CREATE INDEX idx_health_articles_category ON health_articles(category);
CREATE INDEX idx_health_articles_published ON health_articles(published_at);

-- Article FAQs
CREATE INDEX idx_article_faqs_article ON article_faqs(article_id);

-- SEO Landing Pages
CREATE INDEX idx_seo_landing_pages_practice ON seo_landing_pages(practice_id);
CREATE INDEX idx_seo_landing_pages_type ON seo_landing_pages(page_type);
CREATE INDEX idx_seo_landing_pages_status ON seo_landing_pages(status);

-- Testimonials
CREATE INDEX idx_testimonials_practice ON testimonials(practice_id);
CREATE INDEX idx_testimonials_rating ON testimonials(rating);
CREATE INDEX idx_testimonials_location ON testimonials(location_id);
CREATE INDEX idx_testimonials_service ON testimonials(service_id);

-- Physician Profiles
CREATE INDEX idx_physician_profiles_practice ON physician_profiles(practice_id);
CREATE INDEX idx_physician_profiles_slug ON physician_profiles(slug);

-- Service FAQs
CREATE INDEX idx_service_faqs_service ON service_faqs(service_id);

-- Location Service Pages
CREATE INDEX idx_location_service_pages_location ON location_service_pages(location_id);
CREATE INDEX idx_location_service_pages_service ON location_service_pages(service_id);
CREATE INDEX idx_location_service_pages_status ON location_service_pages(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE physician_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_service_pages ENABLE ROW LEVEL SECURITY;

-- Projects policies (base table)
CREATE POLICY "Users can view their own projects"
    ON projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own projects"
    ON projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
    ON projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
    ON projects FOR DELETE
    USING (auth.uid() = user_id);

-- Medical Practices policies
CREATE POLICY "Users can view practices for their projects"
    ON medical_practices FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert practices for their projects"
    ON medical_practices FOR INSERT
    WITH CHECK (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update practices for their projects"
    ON medical_practices FOR UPDATE
    USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete practices for their projects"
    ON medical_practices FOR DELETE
    USING (
        project_id IN (
            SELECT id FROM projects WHERE user_id = auth.uid()
        )
    );

-- Practice Locations policies
CREATE POLICY "Users can view locations for their practices"
    ON practice_locations FOR SELECT
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert locations for their practices"
    ON practice_locations FOR INSERT
    WITH CHECK (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update locations for their practices"
    ON practice_locations FOR UPDATE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete locations for their practices"
    ON practice_locations FOR DELETE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Medical Services policies
CREATE POLICY "Users can view services for their practices"
    ON medical_services FOR SELECT
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert services for their practices"
    ON medical_services FOR INSERT
    WITH CHECK (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update services for their practices"
    ON medical_services FOR UPDATE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete services for their practices"
    ON medical_services FOR DELETE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Treatment Options policies
CREATE POLICY "Users can view treatment options for their services"
    ON treatment_options FOR SELECT
    USING (
        service_id IN (
            SELECT ms.id FROM medical_services ms
            JOIN medical_practices mp ON ms.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert treatment options for their services"
    ON treatment_options FOR INSERT
    WITH CHECK (
        service_id IN (
            SELECT ms.id FROM medical_services ms
            JOIN medical_practices mp ON ms.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update treatment options for their services"
    ON treatment_options FOR UPDATE
    USING (
        service_id IN (
            SELECT ms.id FROM medical_services ms
            JOIN medical_practices mp ON ms.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete treatment options for their services"
    ON treatment_options FOR DELETE
    USING (
        service_id IN (
            SELECT ms.id FROM medical_services ms
            JOIN medical_practices mp ON ms.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Location Services policies
CREATE POLICY "Users can view location services for their locations"
    ON location_services FOR SELECT
    USING (
        location_id IN (
            SELECT pl.id FROM practice_locations pl
            JOIN medical_practices mp ON pl.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert location services for their locations"
    ON location_services FOR INSERT
    WITH CHECK (
        location_id IN (
            SELECT pl.id FROM practice_locations pl
            JOIN medical_practices mp ON pl.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update location services for their locations"
    ON location_services FOR UPDATE
    USING (
        location_id IN (
            SELECT pl.id FROM practice_locations pl
            JOIN medical_practices mp ON pl.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete location services for their locations"
    ON location_services FOR DELETE
    USING (
        location_id IN (
            SELECT pl.id FROM practice_locations pl
            JOIN medical_practices mp ON pl.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Health Articles policies
CREATE POLICY "Users can view articles for their practices"
    ON health_articles FOR SELECT
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert articles for their practices"
    ON health_articles FOR INSERT
    WITH CHECK (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update articles for their practices"
    ON health_articles FOR UPDATE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete articles for their practices"
    ON health_articles FOR DELETE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Article FAQs policies
CREATE POLICY "Users can view article FAQs for their articles"
    ON article_faqs FOR SELECT
    USING (
        article_id IN (
            SELECT ha.id FROM health_articles ha
            JOIN medical_practices mp ON ha.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert article FAQs for their articles"
    ON article_faqs FOR INSERT
    WITH CHECK (
        article_id IN (
            SELECT ha.id FROM health_articles ha
            JOIN medical_practices mp ON ha.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update article FAQs for their articles"
    ON article_faqs FOR UPDATE
    USING (
        article_id IN (
            SELECT ha.id FROM health_articles ha
            JOIN medical_practices mp ON ha.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete article FAQs for their articles"
    ON article_faqs FOR DELETE
    USING (
        article_id IN (
            SELECT ha.id FROM health_articles ha
            JOIN medical_practices mp ON ha.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- SEO Landing Pages policies
CREATE POLICY "Users can view landing pages for their practices"
    ON seo_landing_pages FOR SELECT
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert landing pages for their practices"
    ON seo_landing_pages FOR INSERT
    WITH CHECK (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update landing pages for their practices"
    ON seo_landing_pages FOR UPDATE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete landing pages for their practices"
    ON seo_landing_pages FOR DELETE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Testimonials policies
CREATE POLICY "Users can view testimonials for their practices"
    ON testimonials FOR SELECT
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert testimonials for their practices"
    ON testimonials FOR INSERT
    WITH CHECK (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update testimonials for their practices"
    ON testimonials FOR UPDATE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete testimonials for their practices"
    ON testimonials FOR DELETE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Physician Profiles policies
CREATE POLICY "Users can view physicians for their practices"
    ON physician_profiles FOR SELECT
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert physicians for their practices"
    ON physician_profiles FOR INSERT
    WITH CHECK (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update physicians for their practices"
    ON physician_profiles FOR UPDATE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete physicians for their practices"
    ON physician_profiles FOR DELETE
    USING (
        practice_id IN (
            SELECT mp.id FROM medical_practices mp
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Service FAQs policies
CREATE POLICY "Users can view service FAQs for their services"
    ON service_faqs FOR SELECT
    USING (
        service_id IN (
            SELECT ms.id FROM medical_services ms
            JOIN medical_practices mp ON ms.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert service FAQs for their services"
    ON service_faqs FOR INSERT
    WITH CHECK (
        service_id IN (
            SELECT ms.id FROM medical_services ms
            JOIN medical_practices mp ON ms.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update service FAQs for their services"
    ON service_faqs FOR UPDATE
    USING (
        service_id IN (
            SELECT ms.id FROM medical_services ms
            JOIN medical_practices mp ON ms.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete service FAQs for their services"
    ON service_faqs FOR DELETE
    USING (
        service_id IN (
            SELECT ms.id FROM medical_services ms
            JOIN medical_practices mp ON ms.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- Location Service Pages policies
CREATE POLICY "Users can view location service pages for their locations"
    ON location_service_pages FOR SELECT
    USING (
        location_id IN (
            SELECT pl.id FROM practice_locations pl
            JOIN medical_practices mp ON pl.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert location service pages for their locations"
    ON location_service_pages FOR INSERT
    WITH CHECK (
        location_id IN (
            SELECT pl.id FROM practice_locations pl
            JOIN medical_practices mp ON pl.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update location service pages for their locations"
    ON location_service_pages FOR UPDATE
    USING (
        location_id IN (
            SELECT pl.id FROM practice_locations pl
            JOIN medical_practices mp ON pl.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete location service pages for their locations"
    ON location_service_pages FOR DELETE
    USING (
        location_id IN (
            SELECT pl.id FROM practice_locations pl
            JOIN medical_practices mp ON pl.practice_id = mp.id
            JOIN projects p ON mp.project_id = p.id
            WHERE p.user_id = auth.uid()
        )
    );

-- ============================================================================
-- TRIGGERS FOR updated_at
-- ============================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_practices_updated_at
    BEFORE UPDATE ON medical_practices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practice_locations_updated_at
    BEFORE UPDATE ON practice_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_services_updated_at
    BEFORE UPDATE ON medical_services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_health_articles_updated_at
    BEFORE UPDATE ON health_articles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_landing_pages_updated_at
    BEFORE UPDATE ON seo_landing_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_physician_profiles_updated_at
    BEFORE UPDATE ON physician_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_location_service_pages_updated_at
    BEFORE UPDATE ON location_service_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE medical_practices IS 'Healthcare practice information linked to projects';
COMMENT ON TABLE practice_locations IS 'Multi-location support with NAP data for local SEO';
COMMENT ON TABLE medical_services IS 'Treatment and service definitions for the practice';
COMMENT ON TABLE treatment_options IS 'Sub-treatments under main services (e.g., Shockwave under ED)';
COMMENT ON TABLE location_services IS 'Junction table for location-specific service availability and pricing';
COMMENT ON TABLE health_articles IS 'E-E-A-T compliant health content with medical review';
COMMENT ON TABLE article_faqs IS 'FAQ items for articles supporting FAQPage schema';
COMMENT ON TABLE seo_landing_pages IS 'Symptom-based and keyword-targeted landing pages';
COMMENT ON TABLE testimonials IS 'Patient reviews with schema.org Review support';
COMMENT ON TABLE physician_profiles IS 'Individual provider profiles for E-E-A-T compliance';
COMMENT ON TABLE service_faqs IS 'FAQ items for service pages';
COMMENT ON TABLE location_service_pages IS 'Generated local SEO pages for location x service combinations';
