-- Inpatient & Bed Management Schema
-- This schema supports comprehensive inpatient care management

-- Wards table
CREATE TABLE wards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    ward_type VARCHAR(50) NOT NULL, -- 'general', 'icu', 'isolation', 'pediatric', 'maternity'
    floor_number INTEGER,
    capacity INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table
CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    ward_id INTEGER REFERENCES wards(id),
    room_number VARCHAR(20) NOT NULL,
    room_type VARCHAR(50) NOT NULL, -- 'single', 'double', 'shared', 'icu'
    capacity INTEGER NOT NULL DEFAULT 1,
    gender_restriction VARCHAR(10), -- 'male', 'female', 'mixed'
    is_isolation BOOLEAN DEFAULT false,
    amenities JSONB, -- AC, TV, bathroom type, etc.
    daily_rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Beds table
CREATE TABLE beds (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id),
    bed_number VARCHAR(20) NOT NULL,
    bed_type VARCHAR(50) NOT NULL, -- 'standard', 'electric', 'icu', 'pediatric'
    status VARCHAR(20) DEFAULT 'vacant', -- 'occupied', 'vacant', 'cleaning', 'maintenance', 'blocked'
    is_active BOOLEAN DEFAULT true,
    last_cleaned_at TIMESTAMP,
    maintenance_due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inpatient admissions table
CREATE TABLE inpatient_admissions (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    ip_number VARCHAR(50) UNIQUE NOT NULL,
    admission_date TIMESTAMP NOT NULL,
    admission_type VARCHAR(50) NOT NULL, -- 'emergency', 'planned', 'transfer'
    referring_doctor_id INTEGER REFERENCES doctors(id),
    attending_doctor_id INTEGER REFERENCES doctors(id),
    bed_id INTEGER REFERENCES beds(id),
    admission_diagnosis TEXT,
    chief_complaint TEXT,
    history_present_illness TEXT,
    past_medical_history TEXT,
    family_history TEXT,
    social_history TEXT,
    allergies TEXT,
    current_medications TEXT,
    admission_notes TEXT,
    estimated_discharge_date DATE,
    actual_discharge_date TIMESTAMP,
    discharge_type VARCHAR(50), -- 'home', 'transfer', 'ama', 'death'
    discharge_summary TEXT,
    total_amount DECIMAL(12,2) DEFAULT 0,
    insurance_claim_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'discharged', 'transferred'
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bed transfers table
CREATE TABLE bed_transfers (
    id SERIAL PRIMARY KEY,
    admission_id INTEGER REFERENCES inpatient_admissions(id),
    from_bed_id INTEGER REFERENCES beds(id),
    to_bed_id INTEGER REFERENCES beds(id),
    transfer_date TIMESTAMP NOT NULL,
    transfer_reason TEXT NOT NULL,
    transfer_type VARCHAR(50) NOT NULL, -- 'medical', 'administrative', 'emergency'
    priority VARCHAR(20) DEFAULT 'normal', -- 'emergency', 'high', 'normal', 'low'
    requested_by INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'requested', -- 'requested', 'approved', 'completed', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor progress notes
CREATE TABLE doctor_progress_notes (
    id SERIAL PRIMARY KEY,
    admission_id INTEGER REFERENCES inpatient_admissions(id),
    doctor_id INTEGER REFERENCES doctors(id),
    note_date TIMESTAMP NOT NULL,
    note_type VARCHAR(50) DEFAULT 'progress', -- 'admission', 'progress', 'discharge', 'transfer'
    subjective TEXT, -- Patient's complaints and symptoms
    objective TEXT, -- Physical examination findings
    assessment TEXT, -- Clinical assessment and diagnosis
    plan TEXT, -- Treatment plan and orders
    additional_notes TEXT,
    is_voice_transcribed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Nursing notes table
CREATE TABLE nursing_notes (
    id SERIAL PRIMARY KEY,
    admission_id INTEGER REFERENCES inpatient_admissions(id),
    nurse_id INTEGER REFERENCES users(id),
    shift VARCHAR(20) NOT NULL, -- 'morning', 'evening', 'night'
    note_date TIMESTAMP NOT NULL,
    pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
    general_condition TEXT,
    vital_signs JSONB, -- temperature, bp, pulse, spo2, respiratory_rate
    intake_output JSONB, -- fluid intake, urine output, etc.
    medications_given JSONB, -- list of medications administered
    patient_response TEXT,
    nursing_interventions TEXT,
    observations TEXT,
    family_interaction TEXT,
    discharge_planning_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discharge predictions (AI-powered)
CREATE TABLE discharge_predictions (
    id SERIAL PRIMARY KEY,
    admission_id INTEGER REFERENCES inpatient_admissions(id),
    predicted_discharge_date DATE,
    confidence_score DECIMAL(5,2), -- 0-100%
    factors_considered JSONB, -- diagnosis, los, vitals, lab_trends
    is_ready_for_discharge BOOLEAN DEFAULT false,
    prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    model_version VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admission notifications
CREATE TABLE admission_notifications (
    id SERIAL PRIMARY KEY,
    admission_id INTEGER REFERENCES inpatient_admissions(id),
    notification_type VARCHAR(50) NOT NULL, -- 'admission', 'transfer', 'discharge', 'emergency'
    recipient_name VARCHAR(100),
    recipient_phone VARCHAR(20),
    recipient_email VARCHAR(100),
    delivery_method VARCHAR(20) NOT NULL, -- 'sms', 'whatsapp', 'email'
    message_template VARCHAR(50),
    custom_message TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed'
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bed maintenance log
CREATE TABLE bed_maintenance_log (
    id SERIAL PRIMARY KEY,
    bed_id INTEGER REFERENCES beds(id),
    maintenance_type VARCHAR(50) NOT NULL, -- 'cleaning', 'repair', 'inspection', 'replacement'
    performed_by INTEGER REFERENCES users(id),
    maintenance_date TIMESTAMP NOT NULL,
    description TEXT,
    cost DECIMAL(10,2),
    next_maintenance_date DATE,
    status VARCHAR(20) DEFAULT 'completed', -- 'scheduled', 'in_progress', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_inpatient_admissions_patient_id ON inpatient_admissions(patient_id);
CREATE INDEX idx_inpatient_admissions_status ON inpatient_admissions(status);
CREATE INDEX idx_inpatient_admissions_admission_date ON inpatient_admissions(admission_date);
CREATE INDEX idx_beds_status ON beds(status);
CREATE INDEX idx_bed_transfers_admission_id ON bed_transfers(admission_id);
CREATE INDEX idx_doctor_progress_notes_admission_id ON doctor_progress_notes(admission_id);
CREATE INDEX idx_nursing_notes_admission_id ON nursing_notes(admission_id);

-- Sample data
INSERT INTO wards (name, description, ward_type, floor_number, capacity) VALUES
('General Ward A', 'General medical ward', 'general', 1, 20),
('ICU', 'Intensive Care Unit', 'icu', 2, 10),
('Pediatric Ward', 'Children ward', 'pediatric', 1, 15),
('Maternity Ward', 'Maternity and obstetrics', 'maternity', 3, 12),
('Isolation Ward', 'Infectious disease isolation', 'isolation', 4, 8);

INSERT INTO rooms (ward_id, room_number, room_type, capacity, gender_restriction, daily_rate) VALUES
(1, '101', 'double', 2, 'male', 1500.00),
(1, '102', 'double', 2, 'female', 1500.00),
(1, '103', 'single', 1, 'mixed', 2500.00),
(2, '201', 'icu', 1, 'mixed', 5000.00),
(2, '202', 'icu', 1, 'mixed', 5000.00),
(3, '301', 'shared', 4, 'mixed', 1200.00),
(4, '401', 'single', 1, 'female', 3000.00),
(5, '501', 'isolation', 1, 'mixed', 4000.00);

INSERT INTO beds (room_id, bed_number, bed_type, status) VALUES
(1, '101A', 'standard', 'occupied'),
(1, '101B', 'standard', 'vacant'),
(2, '102A', 'standard', 'occupied'),
(2, '102B', 'standard', 'cleaning'),
(3, '103A', 'electric', 'vacant'),
(4, '201A', 'icu', 'occupied'),
(5, '202A', 'icu', 'vacant'),
(6, '301A', 'pediatric', 'occupied'),
(6, '301B', 'pediatric', 'vacant'),
(6, '301C', 'pediatric', 'vacant'),
(6, '301D', 'pediatric', 'maintenance'),
(7, '401A', 'electric', 'occupied'),
(8, '501A', 'isolation', 'vacant');
