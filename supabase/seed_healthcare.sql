-- Healthcare Module Seed Data
-- This file contains template data for healthcare practices

-- ============================================================================
-- SERVICE CATEGORIES REFERENCE
-- ============================================================================

-- Service categories for healthcare practices:
-- sexual_health: 'Sexual Health & ED'
-- hormone: 'Hormone Therapy'
-- weight: 'Weight Management'
-- hair: 'Hair Restoration'
-- aesthetics: 'Medical Aesthetics'
-- preventive: 'Preventive Care'
-- pain: 'Pain Management'
-- dental: 'Dental Services'

-- ============================================================================
-- TEMPLATE: Men's Health Clinic Services
-- ============================================================================

-- Create a template function to seed services for a men's health practice
CREATE OR REPLACE FUNCTION seed_mens_health_services(p_practice_id UUID)
RETURNS void AS $$
DECLARE
    v_ed_service_id UUID;
    v_trt_service_id UUID;
    v_weight_service_id UUID;
    v_hair_service_id UUID;
BEGIN
    -- ED Services (Parent)
    INSERT INTO medical_services (
        id, practice_id, name, slug, short_name, category, description,
        short_description, benefits, ideal_candidate, procedure_overview,
        icon, is_featured, display_order, schema_type, medical_specialty
    ) VALUES (
        gen_random_uuid(),
        p_practice_id,
        'Erectile Dysfunction Treatment',
        'erectile-dysfunction',
        'ED Treatment',
        'sexual_health',
        'Comprehensive erectile dysfunction treatment options designed to restore confidence and improve intimate relationships. Our medical team offers cutting-edge therapies tailored to your specific needs.',
        'Effective ED treatments to help you regain confidence and improve your quality of life.',
        ARRAY['Improved sexual performance', 'Increased confidence', 'Better intimate relationships', 'Non-invasive options available', 'Personalized treatment plans'],
        'Men experiencing difficulty achieving or maintaining erections, reduced sexual desire, or those seeking to enhance their sexual performance.',
        'After a comprehensive evaluation, our medical team will recommend the most appropriate treatment based on your health history, lifestyle, and goals.',
        'heart',
        true,
        1,
        'MedicalTherapy',
        'Urology'
    ) RETURNING id INTO v_ed_service_id;

    -- ED Treatment Options
    INSERT INTO treatment_options (service_id, name, slug, description, how_it_works, benefits, side_effects, session_count, session_duration, fda_approved, display_order) VALUES
    (v_ed_service_id, 'Shockwave Therapy', 'shockwave-therapy',
     'Low-intensity shockwave therapy uses acoustic waves to improve blood flow and stimulate tissue regeneration in the penis.',
     'Acoustic waves stimulate angiogenesis (new blood vessel formation) and break up micro-plaque in blood vessels, improving natural blood flow to the penis.',
     ARRAY['Non-invasive treatment', 'No medication required', 'Long-lasting results', 'Addresses root cause', 'Minimal side effects'],
     ARRAY['Mild discomfort during treatment', 'Temporary redness'],
     '6-12 sessions', '15-20 minutes', true, 1),

    (v_ed_service_id, 'Injection Therapy (Trimix)', 'injection-therapy',
     'Trimix injections deliver a combination of three medications directly to the erectile tissue for immediate results.',
     'The medication combination relaxes smooth muscle and dilates blood vessels in the penis, creating an erection within 5-15 minutes.',
     ARRAY['High success rate', 'Works regardless of arousal', 'Customized dosing', 'Immediate results'],
     ARRAY['Injection site discomfort', 'Priapism risk if overdosed', 'Bruising'],
     'As needed', '5 minutes', true, 2),

    (v_ed_service_id, 'PRP Therapy (P-Shot)', 'prp-therapy',
     'The Priapus Shot uses platelet-rich plasma from your own blood to stimulate tissue regeneration and improve erectile function.',
     'Growth factors in PRP stimulate stem cells and promote new tissue growth, improving sensitivity and blood flow over time.',
     ARRAY['Natural treatment using your own blood', 'Improves sensitivity', 'Enhances size potential', 'Long-lasting effects'],
     ARRAY['Temporary swelling', 'Mild discomfort at injection site'],
     '1-3 sessions', '30 minutes', false, 3),

    (v_ed_service_id, 'Oral Medications', 'oral-medications',
     'FDA-approved oral medications like sildenafil, tadalafil, and vardenafil that enhance blood flow for improved erections.',
     'PDE5 inhibitors block an enzyme that restricts blood flow, allowing increased blood flow to the penis when sexually aroused.',
     ARRAY['Easy to use', 'Well-studied', 'Multiple options available', 'Effective for most men'],
     ARRAY['Headache', 'Flushing', 'Nasal congestion', 'Vision changes'],
     'As needed', 'N/A', true, 4);

    -- TRT Services (Parent)
    INSERT INTO medical_services (
        id, practice_id, name, slug, short_name, category, description,
        short_description, benefits, ideal_candidate, procedure_overview,
        icon, is_featured, display_order, schema_type, medical_specialty
    ) VALUES (
        gen_random_uuid(),
        p_practice_id,
        'Testosterone Replacement Therapy',
        'testosterone-therapy',
        'TRT',
        'hormone',
        'Testosterone replacement therapy to restore optimal hormone levels, increase energy, improve mood, and enhance overall vitality for men experiencing low testosterone.',
        'Restore your energy, strength, and vitality with personalized testosterone therapy.',
        ARRAY['Increased energy levels', 'Improved muscle mass', 'Better mood and mental clarity', 'Enhanced libido', 'Improved sleep quality', 'Reduced body fat'],
        'Men over 30 experiencing fatigue, decreased muscle mass, low libido, mood changes, or those with clinically low testosterone levels.',
        'We begin with comprehensive hormone panel testing, followed by a personalized treatment plan that may include injections, pellets, or topical treatments.',
        'zap',
        true,
        2,
        'MedicalTherapy',
        'Endocrinology'
    ) RETURNING id INTO v_trt_service_id;

    -- TRT Treatment Options
    INSERT INTO treatment_options (service_id, name, slug, description, how_it_works, benefits, side_effects, session_count, session_duration, fda_approved, display_order) VALUES
    (v_trt_service_id, 'TRT Injection Therapy', 'trt-injections',
     'Weekly or bi-weekly testosterone cypionate or enanthate injections for consistent hormone levels.',
     'Intramuscular injections deliver testosterone directly into the bloodstream, maintaining steady hormone levels between doses.',
     ARRAY['Precise dosing control', 'Consistent hormone levels', 'Cost-effective', 'Quick absorption'],
     ARRAY['Injection site reactions', 'Mood fluctuations between doses', 'Potential for increased red blood cells'],
     'Weekly or bi-weekly', '5 minutes', true, 1),

    (v_trt_service_id, 'Testosterone Pellet Therapy', 'testosterone-pellets',
     'Bioidentical testosterone pellets implanted under the skin for 3-6 months of consistent hormone release.',
     'Small pellets inserted under the skin slowly release testosterone, mimicking the body''s natural hormone production.',
     ARRAY['Consistent hormone levels', 'No daily administration', 'Lasts 3-6 months', 'Bioidentical hormones'],
     ARRAY['Minor procedure required', 'Pellet extrusion risk', 'Cost per treatment'],
     'Every 3-6 months', '20 minutes', true, 2),

    (v_trt_service_id, 'Hormone Panel Testing', 'hormone-testing',
     'Comprehensive blood testing to evaluate testosterone, estrogen, SHBG, and other key hormones.',
     'Blood tests measure total and free testosterone, along with related hormones to create a complete picture of your hormonal health.',
     ARRAY['Accurate diagnosis', 'Baseline for treatment', 'Monitor progress', 'Identify other issues'],
     ARRAY['Blood draw discomfort'],
     'Quarterly', '15 minutes', true, 3);

    -- Weight Loss Services (Parent)
    INSERT INTO medical_services (
        id, practice_id, name, slug, short_name, category, description,
        short_description, benefits, ideal_candidate, procedure_overview,
        icon, is_featured, display_order, schema_type, medical_specialty
    ) VALUES (
        gen_random_uuid(),
        p_practice_id,
        'Medical Weight Loss',
        'weight-loss',
        'Weight Loss',
        'weight',
        'Physician-supervised weight loss programs utilizing the latest FDA-approved medications and personalized nutrition plans for sustainable results.',
        'Achieve lasting weight loss with medically-supervised programs and breakthrough medications.',
        ARRAY['Significant weight reduction', 'Improved metabolic health', 'Better blood sugar control', 'Reduced cardiovascular risk', 'Increased energy', 'Improved self-confidence'],
        'Adults with BMI over 27 with weight-related health conditions, or BMI over 30, who have struggled with traditional diet and exercise alone.',
        'Your journey begins with a comprehensive health evaluation, followed by a customized plan that may include GLP-1 medications, nutritional counseling, and ongoing support.',
        'scale',
        true,
        3,
        'MedicalTherapy',
        'Obesity Medicine'
    ) RETURNING id INTO v_weight_service_id;

    -- Weight Loss Treatment Options
    INSERT INTO treatment_options (service_id, name, slug, description, how_it_works, benefits, side_effects, session_count, session_duration, fda_approved, display_order) VALUES
    (v_weight_service_id, 'Semaglutide (Wegovy/Ozempic)', 'semaglutide',
     'Weekly GLP-1 receptor agonist injection that reduces appetite and helps with sustainable weight loss.',
     'Semaglutide mimics a natural hormone that regulates appetite, slowing gastric emptying and signaling fullness to the brain.',
     ARRAY['Average 15-20% body weight loss', 'Once-weekly injection', 'Improved blood sugar', 'Reduced cardiovascular risk'],
     ARRAY['Nausea (usually temporary)', 'Constipation', 'Diarrhea', 'Fatigue'],
     'Weekly ongoing', '5 minutes', true, 1),

    (v_weight_service_id, 'Tirzepatide (Mounjaro/Zepbound)', 'tirzepatide',
     'Dual GIP/GLP-1 receptor agonist offering enhanced weight loss compared to single-action medications.',
     'Tirzepatide activates both GIP and GLP-1 receptors, providing dual-action appetite suppression and metabolic improvement.',
     ARRAY['Average 20-25% body weight loss', 'Superior to single-action drugs', 'Improved insulin sensitivity', 'Cardiovascular benefits'],
     ARRAY['Nausea', 'Diarrhea', 'Decreased appetite', 'Injection site reactions'],
     'Weekly ongoing', '5 minutes', true, 2),

    (v_weight_service_id, 'B12 Injections', 'b12-injections',
     'Vitamin B12 injections to boost energy, metabolism, and support your weight loss journey.',
     'B12 plays a crucial role in energy production and metabolism, helping you maintain energy levels during caloric restriction.',
     ARRAY['Increased energy', 'Improved metabolism', 'Better mood', 'Supports nervous system'],
     ARRAY['Mild pain at injection site', 'Rare allergic reaction'],
     'Weekly or bi-weekly', '5 minutes', true, 3),

    (v_weight_service_id, 'Nutritional Counseling', 'nutritional-counseling',
     'One-on-one guidance from our nutrition specialists to develop sustainable eating habits.',
     'Personalized meal planning and education help you make better food choices that support long-term weight management.',
     ARRAY['Personalized meal plans', 'Education on nutrition', 'Sustainable habits', 'Ongoing support'],
     ARRAY['Requires commitment', 'Lifestyle changes needed'],
     'Monthly', '30-60 minutes', true, 4);

    -- Hair Restoration Services (Parent)
    INSERT INTO medical_services (
        id, practice_id, name, slug, short_name, category, description,
        short_description, benefits, ideal_candidate, procedure_overview,
        icon, is_featured, display_order, schema_type, medical_specialty
    ) VALUES (
        gen_random_uuid(),
        p_practice_id,
        'Hair Restoration',
        'hair-restoration',
        'Hair Restoration',
        'hair',
        'Advanced hair restoration solutions from medical treatments to surgical transplants, designed to help you regain a full, natural-looking head of hair.',
        'Restore your hair and confidence with our comprehensive hair restoration treatments.',
        ARRAY['Natural-looking results', 'Permanent solutions available', 'Boost in confidence', 'Multiple treatment options', 'Minimal downtime options'],
        'Men experiencing male pattern baldness, thinning hair, or receding hairlines who want to restore their natural hair.',
        'We evaluate your hair loss pattern, scalp health, and goals to recommend the most effective treatment, from medications to transplant procedures.',
        'scissors',
        true,
        4,
        'MedicalProcedure',
        'Dermatology'
    ) RETURNING id INTO v_hair_service_id;

    -- Hair Restoration Treatment Options
    INSERT INTO treatment_options (service_id, name, slug, description, how_it_works, benefits, side_effects, session_count, session_duration, fda_approved, display_order) VALUES
    (v_hair_service_id, 'FUE Hair Transplant', 'fue-hair-transplant',
     'Follicular Unit Extraction transplants individual hair follicles for natural-looking, permanent results.',
     'Individual follicles are harvested from donor areas and transplanted to thinning areas, where they grow naturally.',
     ARRAY['Permanent results', 'Natural appearance', 'Minimal scarring', 'No linear scar'],
     ARRAY['Temporary swelling', 'Numbness', 'Scabbing during healing'],
     '1 session typically', '4-8 hours', true, 1),

    (v_hair_service_id, 'NeoGraft Procedure', 'neograft',
     'Automated FUE technology for faster, more precise hair transplantation with excellent results.',
     'NeoGraft uses pneumatic pressure to extract and implant follicles, reducing trauma and improving graft survival.',
     ARRAY['Less invasive than strip method', 'Faster procedure', 'Higher graft survival rate', 'Quicker recovery'],
     ARRAY['Temporary numbness', 'Minor swelling', 'Scabbing'],
     '1 session typically', '4-6 hours', true, 2),

    (v_hair_service_id, 'PRP Hair Therapy', 'prp-hair-therapy',
     'Platelet-rich plasma injections to stimulate hair follicles and promote natural hair growth.',
     'Growth factors in PRP stimulate dormant follicles and improve blood supply to the scalp, promoting thicker hair growth.',
     ARRAY['Non-surgical', 'Uses your own blood', 'Stimulates natural growth', 'Can combine with other treatments'],
     ARRAY['Scalp tenderness', 'Minor swelling', 'Temporary redness'],
     '3-6 sessions initially', '45 minutes', false, 3),

    (v_hair_service_id, 'Medical Hair Loss Treatment', 'medical-hair-treatment',
     'FDA-approved medications like finasteride and minoxidil to slow hair loss and promote regrowth.',
     'Finasteride blocks DHT (the hormone causing hair loss) while minoxidil improves blood flow to follicles.',
     ARRAY['Non-invasive', 'Convenient', 'Proven effectiveness', 'Can prevent further loss'],
     ARRAY['Finasteride: rare sexual side effects', 'Minoxidil: scalp irritation'],
     'Daily ongoing', 'N/A', true, 4);

END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TEMPLATE: Common FAQ Templates
-- ============================================================================

-- Function to seed FAQs for ED services
CREATE OR REPLACE FUNCTION seed_ed_faqs(p_service_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO service_faqs (service_id, question, answer, display_order) VALUES
    (p_service_id, 'What causes erectile dysfunction?',
     'Erectile dysfunction can be caused by various factors including cardiovascular disease, diabetes, low testosterone, psychological factors like stress and anxiety, certain medications, and lifestyle factors such as smoking and obesity. A comprehensive evaluation helps identify your specific causes.',
     1),
    (p_service_id, 'How effective are ED treatments?',
     'ED treatments are highly effective for most men. Oral medications work for about 70% of men, while treatments like shockwave therapy and injection therapy have success rates above 80%. Our team will help determine which treatment is most likely to work for your situation.',
     2),
    (p_service_id, 'Are ED treatments covered by insurance?',
     'Coverage varies by insurance plan. Some plans cover oral medications like sildenafil and tadalafil, while newer treatments may not be covered. We offer flexible payment options and can help verify your benefits.',
     3),
    (p_service_id, 'How long do ED treatment results last?',
     'Results vary by treatment type. Oral medications provide temporary effects lasting 4-36 hours. Shockwave therapy can provide improvements lasting 1-2 years. We''ll discuss expected duration during your consultation.',
     4),
    (p_service_id, 'Is ED treatment painful?',
     'Most ED treatments involve minimal discomfort. Oral medications have no pain. Shockwave therapy may cause mild tingling. Injection therapy involves a small needle but patients quickly become comfortable with self-administration.',
     5),
    (p_service_id, 'Can ED be a sign of other health problems?',
     'Yes, erectile dysfunction can be an early warning sign of cardiovascular disease, diabetes, or hormonal imbalances. That''s why we perform a comprehensive health evaluation as part of your ED treatment plan.',
     6),
    (p_service_id, 'How soon can I expect results from ED treatment?',
     'Oral medications work within 30-60 minutes. Injection therapy works within 5-15 minutes. Shockwave therapy typically shows improvement after 3-6 sessions, with full results developing over several months.',
     7);
END;
$$ LANGUAGE plpgsql;

-- Function to seed FAQs for TRT services
CREATE OR REPLACE FUNCTION seed_trt_faqs(p_service_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO service_faqs (service_id, question, answer, display_order) VALUES
    (p_service_id, 'What are the signs of low testosterone?',
     'Common symptoms include fatigue, decreased libido, difficulty concentrating, mood changes, reduced muscle mass, increased body fat, and decreased motivation. Many men also experience sleep disturbances and reduced athletic performance.',
     1),
    (p_service_id, 'How is low testosterone diagnosed?',
     'Diagnosis requires blood testing to measure total and free testosterone levels, typically done in the morning when levels are highest. We also evaluate related hormones and your symptoms to create a complete picture.',
     2),
    (p_service_id, 'Is testosterone therapy safe?',
     'When properly monitored by experienced physicians, TRT is safe for most men. We perform regular blood tests to monitor hormone levels, red blood cell count, and other markers to ensure safe treatment.',
     3),
    (p_service_id, 'How long until I feel the effects of TRT?',
     'Many men notice improved energy and mood within 2-3 weeks. Improvements in libido and body composition typically develop over 3-6 months. Maximum benefits are usually achieved within 6-12 months of consistent treatment.',
     4),
    (p_service_id, 'Will I need testosterone therapy forever?',
     'This depends on the cause of your low testosterone. Some men require ongoing therapy, while others may be able to discontinue treatment after addressing underlying causes. We''ll monitor your progress and adjust accordingly.',
     5),
    (p_service_id, 'Does testosterone therapy affect fertility?',
     'TRT can reduce sperm production and may affect fertility. If preserving fertility is important, we can discuss alternative treatments or adjunct therapies. Please discuss your fertility goals during your consultation.',
     6),
    (p_service_id, 'Is testosterone therapy covered by insurance?',
     'Many insurance plans cover testosterone therapy when low testosterone is properly documented through blood tests. We can help verify your coverage and offer affordable options if needed.',
     7);
END;
$$ LANGUAGE plpgsql;

-- Function to seed FAQs for weight loss services
CREATE OR REPLACE FUNCTION seed_weight_loss_faqs(p_service_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO service_faqs (service_id, question, answer, display_order) VALUES
    (p_service_id, 'How much weight can I expect to lose?',
     'Results vary by individual and treatment type. Patients on GLP-1 medications like semaglutide typically lose 15-20% of body weight, while tirzepatide users often see 20-25% weight loss over 12-18 months with proper adherence.',
     1),
    (p_service_id, 'Are weight loss medications safe?',
     'FDA-approved weight loss medications have been extensively studied and are safe for most adults when prescribed appropriately. We screen for contraindications and monitor your progress throughout treatment.',
     2),
    (p_service_id, 'How long do I need to take weight loss medication?',
     'Treatment duration varies by individual goals and response. Many patients achieve their goals within 12-18 months, though some benefit from longer-term use for weight maintenance. We''ll develop a personalized plan.',
     3),
    (p_service_id, 'Will I regain weight if I stop the medication?',
     'Weight regain is possible without lifestyle changes. That''s why our program includes nutritional counseling and focuses on sustainable habits. Some patients maintain results with lifestyle alone; others benefit from ongoing medication.',
     4),
    (p_service_id, 'What are the side effects of GLP-1 medications?',
     'Common side effects include nausea, which typically improves over the first few weeks. Other possible effects include constipation, diarrhea, and decreased appetite. We start with lower doses to minimize side effects.',
     5),
    (p_service_id, 'Is medical weight loss covered by insurance?',
     'Coverage varies significantly by plan. Some insurers cover weight loss medications when BMI criteria are met. We offer affordable self-pay options and can help verify your specific coverage.',
     6),
    (p_service_id, 'How is medical weight loss different from dieting?',
     'Medical weight loss addresses the biological factors that make weight loss difficult. GLP-1 medications reduce hunger signals and help you feel satisfied with less food, making it easier to maintain a caloric deficit.',
     7);
END;
$$ LANGUAGE plpgsql;

-- Function to seed FAQs for hair restoration services
CREATE OR REPLACE FUNCTION seed_hair_faqs(p_service_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO service_faqs (service_id, question, answer, display_order) VALUES
    (p_service_id, 'Am I a good candidate for hair restoration?',
     'Good candidates have stable hair loss patterns and sufficient donor hair. Men with early to moderate hair loss often see the best results. During your consultation, we''ll evaluate your hair loss pattern and donor area.',
     1),
    (p_service_id, 'How long does hair transplant recovery take?',
     'Most patients return to work within 2-5 days. Transplanted hairs shed within 2-3 weeks (this is normal), and new growth begins around 3-4 months. Full results are visible at 12-18 months.',
     2),
    (p_service_id, 'Are hair transplant results permanent?',
     'Yes, transplanted hair is permanent because it''s taken from areas resistant to the hormones that cause pattern baldness. These hairs continue growing naturally for life.',
     3),
    (p_service_id, 'Does a hair transplant look natural?',
     'Modern FUE techniques create extremely natural results. We transplant individual follicles at natural angles and densities, matching your original hair growth pattern.',
     4),
    (p_service_id, 'Is hair restoration painful?',
     'Procedures are performed under local anesthesia, so you''ll feel no pain during treatment. Post-procedure discomfort is typically minimal and managed with over-the-counter pain medication.',
     5),
    (p_service_id, 'How much does hair restoration cost?',
     'Cost varies based on the extent of hair loss and number of grafts needed. During your consultation, we''ll provide a detailed quote and discuss financing options to fit your budget.',
     6),
    (p_service_id, 'Can I combine treatments for better results?',
     'Absolutely. Many patients combine surgical transplants with PRP therapy and medical treatments for optimal results. This comprehensive approach can improve outcomes and protect existing hair.',
     7);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- AUTHORITATIVE CITATION SOURCES
-- ============================================================================

-- Create a reference table for authoritative medical sources
CREATE TABLE IF NOT EXISTS citation_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    abbreviation VARCHAR(50),
    url VARCHAR(500),
    category VARCHAR(50), -- 'government', 'medical_institution', 'peer_reviewed', 'professional_org'
    credibility_score INTEGER CHECK (credibility_score >= 1 AND credibility_score <= 10),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert common authoritative sources
INSERT INTO citation_sources (name, abbreviation, url, category, credibility_score, description) VALUES
('National Institutes of Health', 'NIH', 'https://www.nih.gov', 'government', 10, 'U.S. government medical research agency'),
('PubMed', 'PubMed', 'https://pubmed.ncbi.nlm.nih.gov', 'peer_reviewed', 10, 'Database of peer-reviewed medical literature'),
('Mayo Clinic', 'Mayo Clinic', 'https://www.mayoclinic.org', 'medical_institution', 9, 'World-renowned medical institution'),
('Cleveland Clinic', 'Cleveland Clinic', 'https://my.clevelandclinic.org', 'medical_institution', 9, 'Leading academic medical center'),
('Johns Hopkins Medicine', 'Johns Hopkins', 'https://www.hopkinsmedicine.org', 'medical_institution', 9, 'Academic medical institution'),
('WebMD', 'WebMD', 'https://www.webmd.com', 'medical_institution', 7, 'Consumer health information website'),
('Healthline', 'Healthline', 'https://www.healthline.com', 'medical_institution', 7, 'Health information resource'),
('American Urological Association', 'AUA', 'https://www.auanet.org', 'professional_org', 9, 'Professional organization for urologists'),
('Endocrine Society', 'Endocrine Society', 'https://www.endocrine.org', 'professional_org', 9, 'Hormone research organization'),
('American Academy of Dermatology', 'AAD', 'https://www.aad.org', 'professional_org', 9, 'Professional dermatology organization'),
('American Medical Association', 'AMA', 'https://www.ama-assn.org', 'professional_org', 9, 'Physicians professional organization'),
('FDA', 'FDA', 'https://www.fda.gov', 'government', 10, 'U.S. Food and Drug Administration'),
('CDC', 'CDC', 'https://www.cdc.gov', 'government', 10, 'Centers for Disease Control and Prevention'),
('Obesity Medicine Association', 'OMA', 'https://obesitymedicine.org', 'professional_org', 8, 'Obesity medicine specialists organization'),
('International Society of Hair Restoration Surgery', 'ISHRS', 'https://ishrs.org', 'professional_org', 8, 'Hair restoration professionals organization');

-- ============================================================================
-- SCHEMA TYPE MAPPINGS
-- ============================================================================

-- Reference table for mapping services to schema.org types
CREATE TABLE IF NOT EXISTS schema_type_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_category VARCHAR(100) NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    schema_type VARCHAR(100) NOT NULL,
    medical_specialty VARCHAR(100),
    additional_types TEXT[], -- Additional schema types that apply
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert schema mappings for common healthcare services
INSERT INTO schema_type_mappings (service_category, service_name, schema_type, medical_specialty, additional_types) VALUES
-- Sexual Health / ED
('sexual_health', 'Erectile Dysfunction Treatment', 'MedicalTherapy', 'Urologic', ARRAY['MedicalProcedure']),
('sexual_health', 'Shockwave Therapy', 'MedicalProcedure', 'Urologic', ARRAY['MedicalTherapy']),
('sexual_health', 'PRP Therapy', 'MedicalProcedure', 'Urologic', ARRAY['MedicalTherapy']),
('sexual_health', 'Injection Therapy', 'MedicalTherapy', 'Urologic', NULL),

-- Hormone
('hormone', 'Testosterone Replacement Therapy', 'MedicalTherapy', 'Endocrine', NULL),
('hormone', 'Hormone Panel Testing', 'DiagnosticProcedure', 'Endocrine', ARRAY['MedicalTest']),
('hormone', 'TRT Injections', 'MedicalTherapy', 'Endocrine', NULL),
('hormone', 'Testosterone Pellet Therapy', 'MedicalProcedure', 'Endocrine', ARRAY['MedicalTherapy']),

-- Weight Management
('weight', 'Medical Weight Loss', 'MedicalTherapy', 'Bariatric', NULL),
('weight', 'Semaglutide Treatment', 'MedicalTherapy', 'Bariatric', ARRAY['Drug']),
('weight', 'Tirzepatide Treatment', 'MedicalTherapy', 'Bariatric', ARRAY['Drug']),
('weight', 'Nutritional Counseling', 'MedicalTherapy', 'Bariatric', NULL),

-- Hair Restoration
('hair', 'Hair Transplant', 'MedicalProcedure', 'Dermatology', ARRAY['SurgicalProcedure']),
('hair', 'FUE Hair Transplant', 'SurgicalProcedure', 'Dermatology', ARRAY['MedicalProcedure']),
('hair', 'PRP Hair Therapy', 'MedicalProcedure', 'Dermatology', ARRAY['MedicalTherapy']),
('hair', 'Medical Hair Loss Treatment', 'MedicalTherapy', 'Dermatology', NULL),

-- Aesthetics
('aesthetics', 'Botox', 'MedicalProcedure', 'Dermatology', ARRAY['MedicalTherapy']),
('aesthetics', 'Dermal Fillers', 'MedicalProcedure', 'Dermatology', NULL),
('aesthetics', 'Chemical Peel', 'MedicalProcedure', 'Dermatology', NULL),
('aesthetics', 'Laser Treatment', 'MedicalProcedure', 'Dermatology', ARRAY['MedicalTherapy']),

-- Dental
('dental', 'Dental Implants', 'MedicalProcedure', 'Dentistry', ARRAY['SurgicalProcedure']),
('dental', 'Teeth Whitening', 'MedicalProcedure', 'Dentistry', NULL),
('dental', 'Invisalign', 'MedicalTherapy', 'Dentistry', NULL),

-- Pain Management
('pain', 'Joint Injection', 'MedicalProcedure', 'Rheumatology', ARRAY['MedicalTherapy']),
('pain', 'Trigger Point Injection', 'MedicalProcedure', 'Rheumatology', NULL),
('pain', 'Regenerative Medicine', 'MedicalTherapy', 'Rheumatology', ARRAY['MedicalProcedure']);

-- ============================================================================
-- SAMPLE TESTIMONIAL TEMPLATES
-- ============================================================================

-- Testimonial content templates with variables
-- Use {{business_name}}, {{service_name}}, {{location}}, {{doctor_name}}

CREATE TABLE IF NOT EXISTS testimonial_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_category VARCHAR(100),
    rating INTEGER CHECK (rating >= 4 AND rating <= 5),
    title VARCHAR(255),
    content_template TEXT NOT NULL,
    treatment_focus VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO testimonial_templates (service_category, rating, title, content_template, treatment_focus) VALUES
-- ED Testimonials
('sexual_health', 5, 'Life-changing treatment',
 'I was hesitant to seek treatment for ED, but the team at {{business_name}} made me feel comfortable from day one. After starting {{service_name}}, my confidence is back and my relationship has never been better. Dr. {{doctor_name}} took the time to explain everything and find the right treatment for me.',
 'Erectile Dysfunction'),
('sexual_health', 5, 'Wish I had done this sooner',
 'After years of struggling, I finally made an appointment at {{business_name}}. The shockwave therapy has been incredible - no medications needed anymore! The staff at the {{location}} office were professional and discreet.',
 'Shockwave Therapy'),
('sexual_health', 4, 'Great results with Trimix',
 'The injection therapy has completely changed things for me. The {{business_name}} team taught me everything I needed to know, and now it''s second nature. Highly recommend for anyone who hasn''t had success with pills.',
 'Injection Therapy'),

-- TRT Testimonials
('hormone', 5, 'Got my energy back',
 'I didn''t realize how much low testosterone was affecting my life until I started TRT at {{business_name}}. More energy, better sleep, clearer thinking, and I''ve even put on muscle at 52! Dr. {{doctor_name}} monitors everything closely.',
 'Testosterone Therapy'),
('hormone', 5, 'Feeling like myself again',
 'At 45, I thought feeling tired and unmotivated was just part of getting older. {{business_name}} checked my levels and found they were well below normal. After 3 months on TRT, I feel 10 years younger.',
 'Testosterone Therapy'),
('hormone', 4, 'Pellet therapy is so convenient',
 'I love the pellet option - no weekly injections or daily gels. Every few months I visit {{business_name}} in {{location}} for a quick procedure and I''m set. Consistent energy and mood all month long.',
 'Testosterone Pellets'),

-- Weight Loss Testimonials
('weight', 5, 'Finally found something that works',
 'I''ve tried every diet out there. When {{business_name}} started me on semaglutide, everything changed. I''ve lost 45 pounds in 6 months and actually feel satisfied after meals. Dr. {{doctor_name}} and the team have been incredibly supportive.',
 'Semaglutide'),
('weight', 5, 'Down 60 pounds and keeping it off',
 'Tirzepatide from {{business_name}} has been a game-changer. Combined with their nutritional counseling, I''ve completely transformed my relationship with food. For the first time, I believe I can maintain this weight loss.',
 'Tirzepatide'),
('weight', 4, 'Professional and results-driven',
 'The medical weight loss program at {{business_name}} in {{location}} is top-notch. Regular check-ins, lab work monitoring, and a supportive team. I''ve lost 35 pounds and my blood pressure is finally normal.',
 'Medical Weight Loss'),

-- Hair Restoration Testimonials
('hair', 5, 'Natural looking results',
 'I was nervous about getting a hair transplant, but the FUE results from {{business_name}} exceeded my expectations. Dr. {{doctor_name}} designed a hairline that looks completely natural. My only regret is not doing it sooner!',
 'FUE Hair Transplant'),
('hair', 5, 'Best decision I ever made',
 'After my NeoGraft procedure at {{business_name}}, I can''t stop looking in the mirror. The recovery was easier than expected, and the new hair growth has given me so much confidence. Worth every penny.',
 'NeoGraft'),
('hair', 4, 'PRP helped significantly',
 'I wasn''t ready for a transplant yet, so {{business_name}} recommended PRP therapy first. After 4 sessions, my existing hair is noticeably thicker and I''ve seen new growth in my crown area.',
 'PRP Hair Therapy');

-- ============================================================================
-- USAGE INSTRUCTIONS
-- ============================================================================

-- To seed a new men's health practice with services:
-- SELECT seed_mens_health_services('your-practice-uuid-here');

-- To seed FAQs for a specific service:
-- SELECT seed_ed_faqs('your-ed-service-uuid-here');
-- SELECT seed_trt_faqs('your-trt-service-uuid-here');
-- SELECT seed_weight_loss_faqs('your-weight-service-uuid-here');
-- SELECT seed_hair_faqs('your-hair-service-uuid-here');

-- Example: Complete setup for a new practice
-- 1. Create the practice record
-- INSERT INTO medical_practices (project_id, name, specialty, ...) VALUES (...) RETURNING id;
-- 2. Seed services
-- SELECT seed_mens_health_services('returned-practice-id');
-- 3. Seed FAQs for each service (get service IDs from medical_services table)
-- SELECT seed_ed_faqs('ed-service-id');
