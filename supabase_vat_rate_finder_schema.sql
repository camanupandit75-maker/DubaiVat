-- =============================================
-- UAE VAT RATE FINDER - DATABASE SCHEMA
-- =============================================
-- Run this SQL in Supabase SQL Editor to set up VAT Rate Finder tables

-- 1. VAT Rate Types (Standard, Zero-Rated, Exempt)
CREATE TABLE IF NOT EXISTS vat_rate_types (
  id text PRIMARY KEY,
  name text NOT NULL,
  rate decimal(5,2) NOT NULL,
  can_recover_input_vat boolean NOT NULL,
  must_register boolean NOT NULL,
  description text,
  color text -- For UI display
);

INSERT INTO vat_rate_types VALUES
  ('standard', 'Standard Rate', 5.00, true, true, 'Applies to most goods and services unless specifically exempt or zero-rated', '#10B981'),
  ('zero-rated', 'Zero-Rated', 0.00, true, true, 'VAT is 0% but business can still recover input VAT on related purchases', '#3B82F6'),
  ('exempt', 'Exempt', 0.00, false, false, 'No VAT charged and input VAT on related purchases cannot be recovered', '#F59E0B'),
  ('out-of-scope', 'Out of Scope', 0.00, false, false, 'Falls outside the UAE VAT system entirely', '#6B7280')
ON CONFLICT (id) DO NOTHING;

-- 2. VAT Categories (Main groupings)
CREATE TABLE IF NOT EXISTS vat_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  name_ar text, -- Arabic name
  rate_type text REFERENCES vat_rate_types(id) NOT NULL,
  description text,
  conditions text, -- Qualifying conditions
  common_mistakes text, -- What people often get wrong
  fta_reference text, -- FTA article/clarification reference
  effective_from date DEFAULT '2018-01-01',
  effective_to date, -- NULL means still active
  display_order integer DEFAULT 100,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. VAT Sub-Categories (Specific items within categories)
CREATE TABLE IF NOT EXISTS vat_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES vat_categories(id) ON DELETE CASCADE,
  code text NOT NULL,
  name text NOT NULL,
  name_ar text,
  rate_type text REFERENCES vat_rate_types(id) NOT NULL,
  rate_override decimal(5,2), -- If different from category default
  description text,
  conditions text,
  examples text,
  is_active boolean DEFAULT true,
  UNIQUE(category_id, code)
);

-- 4. VAT Keywords (For smart search and auto-detection)
CREATE TABLE IF NOT EXISTS vat_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword text NOT NULL,
  keyword_ar text,
  category_id uuid REFERENCES vat_categories(id) ON DELETE CASCADE,
  subcategory_id uuid REFERENCES vat_subcategories(id) ON DELETE CASCADE,
  confidence_score decimal(3,2) DEFAULT 0.80, -- How confident the match is (0-1)
  is_vendor_name boolean DEFAULT false, -- Is this a known vendor?
  UNIQUE(keyword, category_id)
);

-- 5. Known Vendors (For auto-detection)
CREATE TABLE IF NOT EXISTS vat_known_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name text NOT NULL,
  vendor_trn text,
  category_id uuid REFERENCES vat_categories(id),
  subcategory_id uuid REFERENCES vat_subcategories(id),
  suggested_rate_type text REFERENCES vat_rate_types(id),
  notes text,
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- 6. VAT Validation Rules (Business logic for verification)
CREATE TABLE IF NOT EXISTS vat_validation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_code text UNIQUE NOT NULL,
  rule_name text NOT NULL,
  description text,
  category_id uuid REFERENCES vat_categories(id),
  condition_field text, -- e.g., 'amount', 'vendor_trn', 'date'
  condition_operator text, -- e.g., 'equals', 'contains', 'greater_than'
  condition_value text,
  expected_rate_type text REFERENCES vat_rate_types(id),
  error_message text,
  warning_message text,
  severity text CHECK (severity IN ('error', 'warning', 'info')) DEFAULT 'warning',
  is_active boolean DEFAULT true
);

-- =============================================
-- SEED DATA: UAE VAT CATEGORIES
-- =============================================

-- STANDARD RATED (5%) CATEGORIES
INSERT INTO vat_categories (code, name, name_ar, rate_type, description, conditions, display_order) VALUES
  ('STD-ELECTRONICS', 'Electronics & Technology', 'الإلكترونيات والتكنولوجيا', 'standard', 'Phones, laptops, TVs, gadgets, software', NULL, 10),
  ('STD-OFFICE', 'Office Supplies & Equipment', 'مستلزمات ومعدات المكتب', 'standard', 'Stationery, furniture, office equipment', NULL, 11),
  ('STD-FUEL', 'Fuel & Petrol', 'الوقود والبنزين', 'standard', 'Petrol, diesel at retail pumps', NULL, 12),
  ('STD-MEALS', 'Meals & Entertainment', 'الوجبات والترفيه', 'standard', 'Restaurants, cafes, catering, takeaway', 'Input VAT on entertainment limited to 50% recovery', 13),
  ('STD-HOTEL', 'Hotel & Accommodation', 'الفنادق والإقامة', 'standard', 'Hotel rooms, serviced apartments, Airbnb', 'Includes no-show fees. Tourism Dirham is outside VAT scope', 14),
  ('STD-PROFESSIONAL', 'Professional Services', 'الخدمات المهنية', 'standard', 'Legal, accounting, consulting, marketing, IT services', NULL, 15),
  ('STD-COMMERCIAL-RENT', 'Commercial Property Rent', 'إيجار العقارات التجارية', 'standard', 'Office rent, warehouse, retail space lease', NULL, 16),
  ('STD-COMMERCIAL-SALE', 'Commercial Property Sale', 'بيع العقارات التجارية', 'standard', 'Sale of commercial buildings, offices, warehouses', NULL, 17),
  ('STD-UTILITIES', 'Utilities', 'المرافق', 'standard', 'Electricity (DEWA), water, gas', 'Fully recoverable for business making taxable supplies', 18),
  ('STD-TELECOM', 'Telecommunications', 'الاتصالات', 'standard', 'Mobile, internet, landline services', NULL, 19),
  ('STD-VEHICLES', 'Vehicles & Automotive', 'السيارات والمركبات', 'standard', 'Cars, motorcycles, parts, repairs', NULL, 20),
  ('STD-CLOTHING', 'Clothing & Footwear', 'الملابس والأحذية', 'standard', 'Apparel, shoes, accessories', NULL, 21),
  ('STD-FURNITURE', 'Furniture & Home Goods', 'الأثاث والسلع المنزلية', 'standard', 'Furniture, appliances, home décor', NULL, 22),
  ('STD-JEWELRY', 'Jewelry (Non-Investment)', 'المجوهرات (غير الاستثمارية)', 'standard', 'Jewelry below 99% purity, fashion jewelry', NULL, 23),
  ('STD-BEAUTY', 'Personal Care & Beauty', 'العناية الشخصية والجمال', 'standard', 'Haircuts, spa, gym, cosmetic procedures', NULL, 24),
  ('STD-EDUCATION-PRIVATE', 'Private Education & Training', 'التعليم والتدريب الخاص', 'standard', 'Private schools (non-govt funded), language courses, corporate training', 'Must NOT receive >50% government funding', 25),
  ('STD-HEALTHCARE-ELECTIVE', 'Elective Healthcare', 'الرعاية الصحية الاختيارية', 'standard', 'Cosmetic surgery, elective procedures, wellness programs', 'Not preventive or curative in nature', 26),
  ('STD-INSURANCE-GENERAL', 'General Insurance', 'التأمين العام', 'standard', 'Car insurance, property insurance, travel insurance', 'Life insurance is exempt', 27),
  ('STD-RETAIL', 'General Retail', 'التجزئة العامة', 'standard', 'Supermarkets, groceries, general merchandise', NULL, 28),
  ('STD-ADVERTISING', 'Advertising & Marketing', 'الإعلان والتسويق', 'standard', 'Digital ads, print advertising, marketing services', NULL, 29),
  ('STD-MAINTENANCE', 'Maintenance & Repairs', 'الصيانة والإصلاحات', 'standard', 'Building maintenance, equipment repairs, cleaning services', NULL, 30),
  ('STD-SHIPPING-LOCAL', 'Local Shipping & Delivery', 'الشحن والتوصيل المحلي', 'standard', 'Domestic courier, local delivery services', NULL, 31),
  ('STD-EVENTS', 'Events & Entertainment', 'الفعاليات والترفيه', 'standard', 'Concerts, exhibitions, theme parks, cinema', NULL, 32),
  ('STD-SERVICE-CHARGE', 'Service Charges', 'رسوم الخدمة', 'standard', 'Service charges on residential/commercial properties', 'Even on residential properties, service charges are 5%', 33)
ON CONFLICT (code) DO NOTHING;

-- ZERO-RATED (0%) CATEGORIES
INSERT INTO vat_categories (code, name, name_ar, rate_type, description, conditions, common_mistakes, display_order) VALUES
  ('ZERO-EXPORT', 'Exports Outside GCC', 'الصادرات خارج دول الخليج', 'zero-rated', 'Goods and services exported outside GCC implementing states', 'Must have: customs declaration with commercial evidence, OR bill of lading with export proof, OR customs declaration showing suspension status', 'Failing to maintain proper export documentation', 40),
  ('ZERO-INTL-TRANSPORT', 'International Transportation', 'النقل الدولي', 'zero-rated', 'International flights, cargo shipping, cross-border transport', 'Journey must start, end, or cross UAE territory', 'Confusing with local transport (which is exempt)', 41),
  ('ZERO-HEALTHCARE', 'Healthcare (Preventive/Curative)', 'الرعاية الصحية (الوقائية/العلاجية)', 'zero-rated', 'Medical services from licensed providers to patients', 'Must be: preventive or curative, provided by MoH-licensed practitioners, supplied directly to patients', 'B2B healthcare supplies (doctor to hospital) are standard-rated', 42),
  ('ZERO-EDUCATION-GOVT', 'Education (Government Funded)', 'التعليم (الممول حكومياً)', 'zero-rated', 'Nurseries through higher education at qualifying institutions', 'Must be: government-owned OR receive >50% government funding, follow approved curriculum', 'Private school fees without government funding are 5%', 43),
  ('ZERO-RESIDENTIAL-FIRST', 'First Residential Property Supply', 'التوريد الأول للعقارات السكنية', 'zero-rated', 'Newly constructed residential properties (first sale/lease)', 'Must be within 3 years of construction completion. Completion = earlier of certification or first occupation', 'Claiming zero-rate beyond 3-year window', 44),
  ('ZERO-PRECIOUS-METALS', 'Investment Precious Metals', 'المعادن الثمينة الاستثمارية', 'zero-rated', 'Gold, silver at 99%+ purity for investment', 'Must meet investment grade standards (99% minimum purity)', 'Fashion jewelry is standard-rated', 45),
  ('ZERO-OIL-GAS', 'Crude Oil & Natural Gas', 'النفط الخام والغاز الطبيعي', 'zero-rated', 'Supply of crude oil and natural gas', 'Refined petroleum products (petrol at pumps) are standard-rated', NULL, 46),
  ('ZERO-TRANSPORT-VEHICLES', 'International Transport Vehicles', 'مركبات النقل الدولي', 'zero-rated', 'Aircraft, vessels for international transport or rescue', 'Must be used for international passenger/goods transportation', NULL, 47)
ON CONFLICT (code) DO NOTHING;

-- EXEMPT (0%, No Input VAT Recovery) CATEGORIES
INSERT INTO vat_categories (code, name, name_ar, rate_type, description, conditions, common_mistakes, display_order) VALUES
  ('EXEMPT-FINANCIAL', 'Financial Services (No Explicit Fee)', 'الخدمات المالية (بدون رسوم صريحة)', 'exempt', 'Interest-based lending, margin forex, deposit interest', 'Only exempt when NO explicit fee/commission charged. Services with fees are 5%', 'Treating fee-based financial services as exempt', 60),
  ('EXEMPT-LIFE-INSURANCE', 'Life Insurance', 'التأمين على الحياة', 'exempt', 'Life insurance contracts and reinsurance', NULL, NULL, 61),
  ('EXEMPT-RESIDENTIAL-RENT', 'Residential Property (Subsequent)', 'العقارات السكنية (اللاحقة)', 'exempt', 'Residential rent, resale of residential property', 'Must be used as residential dwelling with tenancy >6 months. First supply is zero-rated, not exempt', 'Confusing first supply (zero-rated) with subsequent (exempt)', 62),
  ('EXEMPT-BARE-LAND', 'Bare/Undeveloped Land', 'الأراضي الخالية/غير المطورة', 'exempt', 'Sale or lease of undeveloped land', 'Land without buildings or structures', NULL, 63),
  ('EXEMPT-LOCAL-TRANSPORT', 'Local Passenger Transport', 'النقل المحلي للركاب', 'exempt', 'Metro, bus, taxi, abra within UAE', 'Does NOT include: pleasure trips, sightseeing tours (5%), international flights (zero-rated)', 'Applying exempt rate to tour buses', 64),
  ('EXEMPT-VIRTUAL-ASSETS', 'Virtual Assets', 'الأصول الافتراضية', 'exempt', 'Cryptocurrency transactions, virtual asset transfers', 'Added by Cabinet Decision 100/2024. Retroactive to Jan 1, 2018', NULL, 65),
  ('EXEMPT-FUND-MANAGEMENT', 'Investment Fund Management', 'إدارة صناديق الاستثمار', 'exempt', 'Management of licensed investment funds', 'Fund must be licensed. Added by Cabinet Decision 100/2024', NULL, 66),
  ('EXEMPT-SCHOOL-TRANSPORT', 'School Transport', 'النقل المدرسي', 'exempt', 'Transportation from home to school and back', 'Only home-to-school. Field trips are standard-rated', NULL, 67)
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- SEED DATA: SUB-CATEGORIES WITH EXAMPLES
-- =============================================

-- Standard Rate Sub-Categories
INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'electronics-phones', 'Mobile Phones', 'standard', 'iPhone, Samsung Galaxy, smartphones'
FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'electronics-laptops', 'Computers & Laptops', 'standard', 'MacBook, Dell, HP laptops, desktops'
FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'meals-restaurant', 'Restaurant Dining', 'standard', 'Dine-in meals, fine dining, casual restaurants'
FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'meals-delivery', 'Food Delivery', 'standard', 'Talabat, Deliveroo, Careem Food orders'
FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'professional-legal', 'Legal Services', 'standard', 'Law firm fees, legal consultation, court representation'
FROM vat_categories WHERE code = 'STD-PROFESSIONAL'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'professional-accounting', 'Accounting & Audit', 'standard', 'Audit fees, bookkeeping, tax advisory'
FROM vat_categories WHERE code = 'STD-PROFESSIONAL'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'professional-consulting', 'Business Consulting', 'standard', 'Management consulting, strategy, IT consulting'
FROM vat_categories WHERE code = 'STD-PROFESSIONAL'
ON CONFLICT (category_id, code) DO NOTHING;

-- Zero-Rated Sub-Categories
INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'healthcare-hospital', 'Hospital Services', 'zero-rated', 'Inpatient care, surgery, emergency treatment'
FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'healthcare-clinic', 'Clinic Consultations', 'zero-rated', 'GP visits, specialist consultations, diagnostics'
FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'healthcare-dental', 'Dental Services', 'zero-rated', 'Dental checkups, fillings, extractions (not cosmetic)'
FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'healthcare-pharmacy', 'Prescription Medicine', 'zero-rated', 'Prescribed medications from licensed pharmacies'
FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'transport-flights', 'International Flights', 'zero-rated', 'Emirates, Etihad, flydubai international routes'
FROM vat_categories WHERE code = 'ZERO-INTL-TRANSPORT'
ON CONFLICT (category_id, code) DO NOTHING;

INSERT INTO vat_subcategories (category_id, code, name, rate_type, examples) 
SELECT id, 'transport-cargo', 'International Cargo', 'zero-rated', 'DHL, FedEx, Aramex international shipping'
FROM vat_categories WHERE code = 'ZERO-INTL-TRANSPORT'
ON CONFLICT (category_id, code) DO NOTHING;

-- =============================================
-- SEED DATA: KEYWORDS FOR SMART SEARCH
-- =============================================

-- Electronics Keywords
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'iphone', id, 0.95 FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'samsung', id, 0.90 FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'laptop', id, 0.95 FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'computer', id, 0.90 FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'mobile', id, 0.85 FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'sharaf dg', id, 0.95 FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'emax', id, 0.95 FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'jumbo', id, 0.90 FROM vat_categories WHERE code = 'STD-ELECTRONICS'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Office Supplies Keywords
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'stationery', id, 0.95 FROM vat_categories WHERE code = 'STD-OFFICE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'office supplies', id, 0.95 FROM vat_categories WHERE code = 'STD-OFFICE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'office equipment', id, 0.90 FROM vat_categories WHERE code = 'STD-OFFICE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'office furniture', id, 0.90 FROM vat_categories WHERE code = 'STD-OFFICE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'printer', id, 0.85 FROM vat_categories WHERE code = 'STD-OFFICE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'paper', id, 0.80 FROM vat_categories WHERE code = 'STD-OFFICE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'pen', id, 0.75 FROM vat_categories WHERE code = 'STD-OFFICE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'notebook', id, 0.75 FROM vat_categories WHERE code = 'STD-OFFICE'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Fuel Keywords
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'petrol', id, 0.95 FROM vat_categories WHERE code = 'STD-FUEL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'diesel', id, 0.95 FROM vat_categories WHERE code = 'STD-FUEL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'enoc', id, 0.98 FROM vat_categories WHERE code = 'STD-FUEL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'adnoc', id, 0.98 FROM vat_categories WHERE code = 'STD-FUEL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'emarat', id, 0.98 FROM vat_categories WHERE code = 'STD-FUEL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'eppco', id, 0.98 FROM vat_categories WHERE code = 'STD-FUEL'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Restaurant/Meals Keywords
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'restaurant', id, 0.95 FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'cafe', id, 0.90 FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'coffee', id, 0.80 FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'starbucks', id, 0.98 FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'mcdonalds', id, 0.98 FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'kfc', id, 0.98 FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'talabat', id, 0.95 FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'deliveroo', id, 0.95 FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'zomato', id, 0.95 FROM vat_categories WHERE code = 'STD-MEALS'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Hotel Keywords
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'hotel', id, 0.95 FROM vat_categories WHERE code = 'STD-HOTEL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'marriott', id, 0.98 FROM vat_categories WHERE code = 'STD-HOTEL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'hilton', id, 0.98 FROM vat_categories WHERE code = 'STD-HOTEL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'rotana', id, 0.98 FROM vat_categories WHERE code = 'STD-HOTEL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'airbnb', id, 0.90 FROM vat_categories WHERE code = 'STD-HOTEL'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Utilities Keywords
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'dewa', id, 0.99 FROM vat_categories WHERE code = 'STD-UTILITIES'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'electricity', id, 0.95 FROM vat_categories WHERE code = 'STD-UTILITIES'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'water bill', id, 0.95 FROM vat_categories WHERE code = 'STD-UTILITIES'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'sewa', id, 0.99 FROM vat_categories WHERE code = 'STD-UTILITIES'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'fewa', id, 0.99 FROM vat_categories WHERE code = 'STD-UTILITIES'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Telecom Keywords
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'etisalat', id, 0.99 FROM vat_categories WHERE code = 'STD-TELECOM'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'du', id, 0.95 FROM vat_categories WHERE code = 'STD-TELECOM'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'virgin mobile', id, 0.98 FROM vat_categories WHERE code = 'STD-TELECOM'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'mobile bill', id, 0.90 FROM vat_categories WHERE code = 'STD-TELECOM'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'internet', id, 0.85 FROM vat_categories WHERE code = 'STD-TELECOM'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Healthcare Keywords (Zero-Rated)
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'hospital', id, 0.90 FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'clinic', id, 0.85 FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'mediclinic', id, 0.95 FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'aster', id, 0.90 FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'nmc', id, 0.90 FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'pharmacy', id, 0.80 FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'medical', id, 0.75 FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'doctor', id, 0.80 FROM vat_categories WHERE code = 'ZERO-HEALTHCARE'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- International Transport Keywords (Zero-Rated)
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'emirates airline', id, 0.98 FROM vat_categories WHERE code = 'ZERO-INTL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'etihad', id, 0.95 FROM vat_categories WHERE code = 'ZERO-INTL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'flydubai', id, 0.90 FROM vat_categories WHERE code = 'ZERO-INTL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'international flight', id, 0.95 FROM vat_categories WHERE code = 'ZERO-INTL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'dhl', id, 0.85 FROM vat_categories WHERE code = 'ZERO-INTL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'fedex', id, 0.85 FROM vat_categories WHERE code = 'ZERO-INTL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'aramex', id, 0.80 FROM vat_categories WHERE code = 'ZERO-INTL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Local Transport Keywords (Exempt)
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'metro', id, 0.95 FROM vat_categories WHERE code = 'EXEMPT-LOCAL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'rta', id, 0.90 FROM vat_categories WHERE code = 'EXEMPT-LOCAL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'taxi', id, 0.85 FROM vat_categories WHERE code = 'EXEMPT-LOCAL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'careem', id, 0.80 FROM vat_categories WHERE code = 'EXEMPT-LOCAL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'uber', id, 0.80 FROM vat_categories WHERE code = 'EXEMPT-LOCAL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'bus', id, 0.75 FROM vat_categories WHERE code = 'EXEMPT-LOCAL-TRANSPORT'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Residential Rent Keywords (Exempt)
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'residential rent', id, 0.95 FROM vat_categories WHERE code = 'EXEMPT-RESIDENTIAL-RENT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'apartment rent', id, 0.90 FROM vat_categories WHERE code = 'EXEMPT-RESIDENTIAL-RENT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'villa rent', id, 0.90 FROM vat_categories WHERE code = 'EXEMPT-RESIDENTIAL-RENT'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'housing rent', id, 0.90 FROM vat_categories WHERE code = 'EXEMPT-RESIDENTIAL-RENT'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- Financial Services Keywords (Exempt)
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'bank interest', id, 0.90 FROM vat_categories WHERE code = 'EXEMPT-FINANCIAL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'loan interest', id, 0.90 FROM vat_categories WHERE code = 'EXEMPT-FINANCIAL'
ON CONFLICT (keyword, category_id) DO NOTHING;
INSERT INTO vat_keywords (keyword, category_id, confidence_score)
SELECT 'forex margin', id, 0.85 FROM vat_categories WHERE code = 'EXEMPT-FINANCIAL'
ON CONFLICT (keyword, category_id) DO NOTHING;

-- =============================================
-- SEED DATA: VALIDATION RULES
-- =============================================

INSERT INTO vat_validation_rules (rule_code, rule_name, description, expected_rate_type, condition_field, condition_operator, condition_value, warning_message, severity) VALUES
  ('RULE-001', 'Healthcare Must Be Zero-Rated', 'Healthcare services from licensed providers should be zero-rated', 'zero-rated', 'category', 'contains', 'healthcare,hospital,clinic,medical', 'Healthcare services are typically zero-rated (0%) if provided by licensed practitioners. Did you mean to select 5%?', 'warning'),
  ('RULE-002', 'Residential Rent Is Exempt', 'Residential property rent should be exempt with no VAT', 'exempt', 'category', 'contains', 'residential rent,apartment rent,housing', 'Residential rent is VAT exempt. You should not charge VAT on residential property rentals.', 'error'),
  ('RULE-003', 'Local Transport Exempt', 'Metro, bus, taxi within UAE are exempt', 'exempt', 'category', 'contains', 'metro,local taxi,bus fare,rta', 'Local passenger transport (metro, bus, taxi) is VAT exempt in UAE.', 'warning'),
  ('RULE-004', 'International Flight Zero-Rated', 'International flights should be zero-rated', 'zero-rated', 'category', 'contains', 'international flight,emirates,etihad', 'International transportation is zero-rated (0%), not standard-rated (5%).', 'warning'),
  ('RULE-005', 'First Residential Supply', 'First supply of new residential property within 3 years is zero-rated', 'zero-rated', 'category', 'contains', 'first supply,new residential,developer sale', 'First supply of residential property within 3 years of completion is zero-rated.', 'info'),
  ('RULE-006', 'Entertainment 50% Limit', 'Entertainment expenses have 50% input VAT recovery limit', 'standard', 'category', 'contains', 'entertainment,client dinner,party', 'Note: Entertainment expenses have a 50% limit on input VAT recovery.', 'info'),
  ('RULE-007', 'Service Charges Standard', 'Service charges are always 5% even on residential', 'standard', 'category', 'contains', 'service charge,maintenance fee', 'Service charges are standard-rated at 5%, even on residential properties.', 'info')
ON CONFLICT (rule_code) DO NOTHING;

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================

CREATE INDEX IF NOT EXISTS idx_vat_categories_code ON vat_categories(code);
CREATE INDEX IF NOT EXISTS idx_vat_categories_rate_type ON vat_categories(rate_type);
CREATE INDEX IF NOT EXISTS idx_vat_keywords_keyword ON vat_keywords(keyword);
CREATE INDEX IF NOT EXISTS idx_vat_keywords_category ON vat_keywords(category_id);
CREATE INDEX IF NOT EXISTS idx_vat_known_vendors_name ON vat_known_vendors(vendor_name);

-- =============================================
-- ROW LEVEL SECURITY (Public read access)
-- =============================================

ALTER TABLE vat_rate_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE vat_validation_rules ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read vat_rate_types" ON vat_rate_types;
DROP POLICY IF EXISTS "Public read vat_categories" ON vat_categories;
DROP POLICY IF EXISTS "Public read vat_subcategories" ON vat_subcategories;
DROP POLICY IF EXISTS "Public read vat_keywords" ON vat_keywords;
DROP POLICY IF EXISTS "Public read vat_validation_rules" ON vat_validation_rules;

-- Allow public read access (VAT rates are public info)
CREATE POLICY "Public read vat_rate_types" ON vat_rate_types FOR SELECT USING (true);
CREATE POLICY "Public read vat_categories" ON vat_categories FOR SELECT USING (true);
CREATE POLICY "Public read vat_subcategories" ON vat_subcategories FOR SELECT USING (true);
CREATE POLICY "Public read vat_keywords" ON vat_keywords FOR SELECT USING (true);
CREATE POLICY "Public read vat_validation_rules" ON vat_validation_rules FOR SELECT USING (true);

-- Known vendors can be added by authenticated users
ALTER TABLE vat_known_vendors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated users can read vendors" ON vat_known_vendors;
DROP POLICY IF EXISTS "Authenticated users can add vendors" ON vat_known_vendors;
CREATE POLICY "Authenticated users can read vendors" ON vat_known_vendors FOR SELECT USING (true);
CREATE POLICY "Authenticated users can add vendors" ON vat_known_vendors FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

