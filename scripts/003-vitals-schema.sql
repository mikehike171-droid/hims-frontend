-- Patient Vitals
CREATE TABLE patient_vitals (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    appointment_id INTEGER REFERENCES appointments(id),
    nurse_id INTEGER REFERENCES users(id),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Vital Signs
    temperature DECIMAL(4,1), -- in Celsius
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    heart_rate INTEGER, -- beats per minute
    respiratory_rate INTEGER, -- breaths per minute
    oxygen_saturation DECIMAL(5,2), -- SpO2 percentage
    weight DECIMAL(5,2), -- in kg
    height DECIMAL(5,2), -- in cm
    bmi DECIMAL(4,1), -- calculated BMI
    
    -- Additional Measurements
    blood_glucose DECIMAL(5,1), -- mg/dL
    pain_scale INTEGER CHECK (pain_scale >= 0 AND pain_scale <= 10),
    
    -- Assessment Notes
    general_appearance TEXT,
    consciousness_level VARCHAR(50), -- alert, drowsy, confused, unconscious
    mobility_status VARCHAR(50), -- ambulatory, wheelchair, bedbound
    
    -- AI Analysis
    ai_risk_score INTEGER CHECK (ai_risk_score >= 0 AND ai_risk_score <= 100),
    ai_alerts JSONB, -- JSON array of AI-generated alerts
    abnormal_flags JSONB, -- JSON object of abnormal vital flags
    
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Allergies
CREATE TABLE patient_allergies (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    allergy_type VARCHAR(50), -- drug, food, environmental, other
    allergen VARCHAR(255) NOT NULL,
    severity VARCHAR(20), -- mild, moderate, severe, life-threatening
    reaction TEXT, -- description of allergic reaction
    onset_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    recorded_by INTEGER REFERENCES users(id),
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nursing Assessments
CREATE TABLE nursing_assessments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    appointment_id INTEGER REFERENCES appointments(id),
    nurse_id INTEGER REFERENCES users(id),
    assessment_type VARCHAR(50), -- admission, routine, discharge, emergency
    
    -- Assessment Categories
    neurological_assessment JSONB,
    cardiovascular_assessment JSONB,
    respiratory_assessment JSONB,
    gastrointestinal_assessment JSONB,
    genitourinary_assessment JSONB,
    musculoskeletal_assessment JSONB,
    integumentary_assessment JSONB,
    
    -- Risk Assessments
    fall_risk_score INTEGER,
    pressure_ulcer_risk_score INTEGER,
    nutrition_risk_score INTEGER,
    
    -- Care Plans
    nursing_diagnosis TEXT,
    care_plan TEXT,
    interventions TEXT,
    patient_education TEXT,
    
    -- Voice Notes
    voice_notes_transcript TEXT,
    voice_notes_audio_url TEXT,
    
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vital Signs Reference Ranges (for AI alerts)
CREATE TABLE vital_ranges (
    id SERIAL PRIMARY KEY,
    vital_name VARCHAR(50) NOT NULL,
    age_group VARCHAR(20), -- infant, child, adult, elderly
    gender VARCHAR(10),
    normal_min DECIMAL(8,2),
    normal_max DECIMAL(8,2),
    critical_min DECIMAL(8,2),
    critical_max DECIMAL(8,2),
    unit VARCHAR(20),
    is_active BOOLEAN DEFAULT true
);

-- Insert reference ranges
INSERT INTO vital_ranges (vital_name, age_group, gender, normal_min, normal_max, critical_min, critical_max, unit) VALUES
('temperature', 'adult', 'all', 36.1, 37.2, 35.0, 40.0, '°C'),
('systolic_bp', 'adult', 'all', 90, 140, 70, 180, 'mmHg'),
('diastolic_bp', 'adult', 'all', 60, 90, 40, 110, 'mmHg'),
('heart_rate', 'adult', 'all', 60, 100, 40, 150, 'bpm'),
('respiratory_rate', 'adult', 'all', 12, 20, 8, 30, 'breaths/min'),
('oxygen_saturation', 'adult', 'all', 95, 100, 85, 100, '%'),
('blood_glucose', 'adult', 'all', 70, 140, 40, 400, 'mg/dL');

-- Sample data
INSERT INTO patient_allergies (patient_id, allergy_type, allergen, severity, reaction, recorded_by, location_id) VALUES
(1, 'drug', 'Penicillin', 'severe', 'Skin rash, difficulty breathing', 1, 1),
(1, 'food', 'Peanuts', 'moderate', 'Hives, swelling', 1, 1),
(2, 'drug', 'Aspirin', 'mild', 'Stomach upset', 1, 1);
