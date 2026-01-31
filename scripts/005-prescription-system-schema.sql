-- Enhanced Prescriptions System
CREATE TABLE prescription_templates (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(id),
    template_name VARCHAR(255) NOT NULL,
    diagnosis VARCHAR(255),
    template_data JSONB, -- JSON structure for medicines, tests, etc.
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drug Master Database
CREATE TABLE drug_master (
    id SERIAL PRIMARY KEY,
    drug_name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_names TEXT[], -- Array of brand names
    drug_class VARCHAR(100),
    therapeutic_category VARCHAR(100),
    strength VARCHAR(100),
    dosage_forms TEXT[], -- tablet, capsule, syrup, injection, etc.
    route_of_administration TEXT[], -- oral, iv, im, topical, etc.
    contraindications TEXT[],
    side_effects TEXT[],
    drug_interactions JSONB, -- JSON array of interacting drugs
    pregnancy_category VARCHAR(10),
    is_controlled_substance BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Tests Master
CREATE TABLE lab_tests_master (
    id SERIAL PRIMARY KEY,
    test_name VARCHAR(255) NOT NULL,
    test_code VARCHAR(50) UNIQUE,
    category VARCHAR(100), -- blood, urine, imaging, etc.
    normal_ranges JSONB, -- JSON with age/gender specific ranges
    sample_type VARCHAR(100),
    fasting_required BOOLEAN DEFAULT false,
    preparation_instructions TEXT,
    cost DECIMAL(10,2),
    turnaround_time_hours INTEGER,
    is_active BOOLEAN DEFAULT true
);

-- Enhanced Prescriptions Table
ALTER TABLE prescriptions ADD COLUMN template_used INTEGER REFERENCES prescription_templates(id);
ALTER TABLE prescriptions ADD COLUMN chief_complaint TEXT;
ALTER TABLE prescriptions ADD COLUMN examination_findings TEXT;
ALTER TABLE prescriptions ADD COLUMN vital_signs_reviewed BOOLEAN DEFAULT false;
ALTER TABLE prescriptions ADD COLUMN payment_amount DECIMAL(10,2);
ALTER TABLE prescriptions ADD COLUMN voice_notes_transcript TEXT;
ALTER TABLE prescriptions ADD COLUMN follow_up_date DATE;
ALTER TABLE prescriptions ADD COLUMN follow_up_instructions TEXT;
ALTER TABLE prescriptions ADD COLUMN referral_doctor_id INTEGER REFERENCES doctors(id);
ALTER TABLE prescriptions ADD COLUMN referral_department_id INTEGER REFERENCES departments(id);
ALTER TABLE prescriptions ADD COLUMN referral_reason TEXT;
ALTER TABLE prescriptions ADD COLUMN delivery_method VARCHAR(20) DEFAULT 'print'; -- print, whatsapp, email, both
ALTER TABLE prescriptions ADD COLUMN whatsapp_sent BOOLEAN DEFAULT false;
ALTER TABLE prescriptions ADD COLUMN email_sent BOOLEAN DEFAULT false;

-- Enhanced Prescription Items
ALTER TABLE prescription_items ADD COLUMN drug_id INTEGER REFERENCES drug_master(id);
ALTER TABLE prescription_items ADD COLUMN route VARCHAR(50);
ALTER TABLE prescription_items ADD COLUMN strength VARCHAR(100);
ALTER TABLE prescription_items ADD COLUMN dosage_form VARCHAR(50);
ALTER TABLE prescription_items ADD COLUMN before_after_food VARCHAR(20); -- before, after, with
ALTER TABLE prescription_items ADD COLUMN special_instructions TEXT;
ALTER TABLE prescription_items ADD COLUMN is_generic BOOLEAN DEFAULT false;

-- Lab Orders
CREATE TABLE lab_orders (
    id SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES prescriptions(id),
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    test_id INTEGER REFERENCES lab_tests_master(id),
    test_name VARCHAR(255),
    urgency VARCHAR(20) DEFAULT 'routine', -- routine, urgent, stat
    special_instructions TEXT,
    cost DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'ordered', -- ordered, collected, processing, completed
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    collected_at TIMESTAMP,
    result_available_at TIMESTAMP
);

-- Drug Allergy Interactions
CREATE TABLE drug_allergy_interactions (
    id SERIAL PRIMARY KEY,
    drug_id INTEGER REFERENCES drug_master(id),
    allergen VARCHAR(255),
    severity VARCHAR(20), -- mild, moderate, severe, contraindicated
    reaction_type TEXT
);

-- Prescription History View for Doctors
CREATE VIEW doctor_prescription_history AS
SELECT 
    p.id,
    p.prescription_number,
    p.patient_id,
    pat.first_name || ' ' || COALESCE(pat.last_name, '') as patient_name,
    p.diagnosis,
    p.created_at,
    p.follow_up_date,
    COUNT(pi.id) as medicine_count,
    COUNT(lo.id) as lab_test_count,
    p.status
FROM prescriptions p
JOIN patients pat ON p.patient_id = pat.id
LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
LEFT JOIN lab_orders lo ON p.id = lo.prescription_id
GROUP BY p.id, pat.first_name, pat.last_name;

-- Insert sample drug data
INSERT INTO drug_master (drug_name, generic_name, brand_names, drug_class, therapeutic_category, strength, dosage_forms, route_of_administration, contraindications, side_effects, drug_interactions) VALUES
('Paracetamol', 'Acetaminophen', ARRAY['Crocin', 'Dolo', 'Calpol'], 'Analgesic', 'Pain Relief', '500mg', ARRAY['Tablet', 'Syrup'], ARRAY['Oral'], ARRAY['Liver disease'], ARRAY['Nausea', 'Skin rash'], '{"interacting_drugs": ["Warfarin", "Alcohol"]}'),
('Amoxicillin', 'Amoxicillin', ARRAY['Novamox', 'Amoxil'], 'Antibiotic', 'Anti-infective', '500mg', ARRAY['Capsule', 'Syrup'], ARRAY['Oral'], ARRAY['Penicillin allergy'], ARRAY['Diarrhea', 'Nausea', 'Skin rash'], '{"interacting_drugs": ["Warfarin", "Methotrexate"]}'),
('Omeprazole', 'Omeprazole', ARRAY['Prilosec', 'Omez'], 'PPI', 'Gastric', '20mg', ARRAY['Capsule'], ARRAY['Oral'], ARRAY['Hypersensitivity'], ARRAY['Headache', 'Diarrhea'], '{"interacting_drugs": ["Clopidogrel", "Warfarin"]}'),
('Metformin', 'Metformin', ARRAY['Glucophage', 'Glycomet'], 'Biguanide', 'Antidiabetic', '500mg', ARRAY['Tablet'], ARRAY['Oral'], ARRAY['Kidney disease', 'Heart failure'], ARRAY['Nausea', 'Diarrhea'], '{"interacting_drugs": ["Alcohol", "Contrast agents"]}');

-- Insert sample lab tests
INSERT INTO lab_tests_master (test_name, test_code, category, normal_ranges, sample_type, fasting_required, cost, turnaround_time_hours) VALUES
('Complete Blood Count', 'CBC', 'Blood', '{"hemoglobin": {"male": "13.5-17.5", "female": "12.0-15.5"}, "wbc": "4000-11000"}', 'Blood', false, 300.00, 4),
('Fasting Blood Sugar', 'FBS', 'Blood', '{"normal": "70-100", "prediabetic": "100-125", "diabetic": ">125"}', 'Blood', true, 150.00, 2),
('Lipid Profile', 'LIPID', 'Blood', '{"total_cholesterol": "<200", "ldl": "<100", "hdl": ">40"}', 'Blood', true, 500.00, 6),
('Thyroid Function Test', 'TFT', 'Blood', '{"tsh": "0.4-4.0", "t3": "80-200", "t4": "5.0-12.0"}', 'Blood', false, 800.00, 24),
('Urine Routine', 'URINE', 'Urine', '{"protein": "negative", "glucose": "negative", "rbc": "0-2"}', 'Urine', false, 200.00, 2);

-- Insert sample prescription templates
INSERT INTO prescription_templates (doctor_id, template_name, diagnosis, template_data) VALUES
(1, 'Common Cold', 'Upper Respiratory Tract Infection', '{"medicines": [{"name": "Paracetamol", "dose": "500mg", "frequency": "TID", "duration": "5 days"}], "tests": [], "advice": "Rest, plenty of fluids"}'),
(1, 'Hypertension Follow-up', 'Essential Hypertension', '{"medicines": [{"name": "Amlodipine", "dose": "5mg", "frequency": "OD", "duration": "30 days"}], "tests": ["Lipid Profile"], "advice": "Low salt diet, regular exercise"}');
