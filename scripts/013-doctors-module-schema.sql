-- Doctors Module Schema
-- Complete database schema for doctor workflows and patient management

-- Doctor Profiles and Specializations
CREATE TABLE doctor_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    medical_license_number VARCHAR(50) UNIQUE NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    sub_specialization VARCHAR(100),
    qualification TEXT,
    experience_years INTEGER,
    consultation_fee DECIMAL(10,2),
    follow_up_fee DECIMAL(10,2),
    department_id INTEGER REFERENCES departments(id),
    room_number VARCHAR(20),
    phone_extension VARCHAR(10),
    emergency_contact VARCHAR(15),
    bio TEXT,
    profile_image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Schedules
CREATE TABLE doctor_schedules (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    department_id INTEGER REFERENCES departments(id),
    max_patients INTEGER DEFAULT 20,
    consultation_duration INTEGER DEFAULT 15, -- minutes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Clinical Notes
CREATE TABLE clinical_notes (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    visit_id INTEGER, -- Reference to appointment/visit
    note_type VARCHAR(50) NOT NULL, -- 'consultation', 'follow_up', 'emergency', 'discharge'
    chief_complaint TEXT,
    history_present_illness TEXT,
    past_medical_history TEXT,
    family_history TEXT,
    social_history TEXT,
    review_of_systems TEXT,
    physical_examination TEXT,
    vital_signs JSONB,
    assessment TEXT,
    plan TEXT,
    diagnosis_codes TEXT[], -- ICD-10 codes
    procedure_codes TEXT[], -- CPT codes
    follow_up_instructions TEXT,
    next_visit_date DATE,
    voice_note_url VARCHAR(255),
    template_used VARCHAR(100),
    is_signed BOOLEAN DEFAULT false,
    signed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Orders (Lab, Radiology, Medications)
CREATE TABLE doctor_orders (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    clinical_note_id INTEGER REFERENCES clinical_notes(id),
    order_type VARCHAR(50) NOT NULL, -- 'lab', 'radiology', 'medication', 'procedure'
    order_category VARCHAR(100),
    order_details JSONB NOT NULL,
    priority VARCHAR(20) DEFAULT 'routine', -- 'stat', 'urgent', 'routine'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scheduled_for TIMESTAMP,
    completed_at TIMESTAMP,
    results JSONB,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinical Templates for Common Documentation
CREATE TABLE clinical_templates (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    template_name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50), -- 'consultation', 'procedure', 'discharge'
    specialty VARCHAR(100),
    template_content JSONB NOT NULL,
    is_shared BOOLEAN DEFAULT false,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Communication Log
CREATE TABLE doctor_communications (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    patient_id INTEGER REFERENCES patients(id),
    communication_type VARCHAR(50), -- 'call', 'sms', 'email', 'whatsapp'
    subject VARCHAR(200),
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_status VARCHAR(50),
    response_received BOOLEAN DEFAULT false,
    response_text TEXT,
    response_at TIMESTAMP
);

-- Doctor Performance Metrics
CREATE TABLE doctor_metrics (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    metric_date DATE NOT NULL,
    patients_seen INTEGER DEFAULT 0,
    consultations_completed INTEGER DEFAULT 0,
    emergency_calls INTEGER DEFAULT 0,
    average_consultation_time INTEGER, -- minutes
    patient_satisfaction_score DECIMAL(3,2),
    no_show_rate DECIMAL(5,2),
    follow_up_compliance_rate DECIMAL(5,2),
    prescription_adherence_rate DECIMAL(5,2),
    readmission_rate DECIMAL(5,2),
    revenue_generated DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Assistant Interactions
CREATE TABLE ai_assistant_logs (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    patient_id INTEGER REFERENCES patients(id),
    interaction_type VARCHAR(50), -- 'diagnosis_suggestion', 'drug_interaction', 'clinical_guideline'
    query_text TEXT,
    ai_response JSONB,
    confidence_score DECIMAL(3,2),
    doctor_feedback VARCHAR(50), -- 'helpful', 'not_helpful', 'partially_helpful'
    used_suggestion BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Task Management
CREATE TABLE doctor_tasks (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    patient_id INTEGER REFERENCES patients(id),
    task_type VARCHAR(50), -- 'follow_up', 'review_results', 'callback', 'referral'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    due_date DATE,
    due_time TIME,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    completed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor Alerts and Notifications
CREATE TABLE doctor_alerts (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctor_profiles(id),
    patient_id INTEGER REFERENCES patients(id),
    alert_type VARCHAR(50), -- 'critical_result', 'drug_allergy', 'appointment_reminder', 'task_due'
    severity VARCHAR(20), -- 'critical', 'high', 'medium', 'low'
    title VARCHAR(200) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_doctor_profiles_user_id ON doctor_profiles(user_id);
CREATE INDEX idx_doctor_profiles_department ON doctor_profiles(department_id);
CREATE INDEX idx_doctor_schedules_doctor ON doctor_schedules(doctor_id);
CREATE INDEX idx_clinical_notes_patient ON clinical_notes(patient_id);
CREATE INDEX idx_clinical_notes_doctor ON clinical_notes(doctor_id);
CREATE INDEX idx_clinical_notes_date ON clinical_notes(created_at);
CREATE INDEX idx_doctor_orders_patient ON doctor_orders(patient_id);
CREATE INDEX idx_doctor_orders_doctor ON doctor_orders(doctor_id);
CREATE INDEX idx_doctor_orders_status ON doctor_orders(status);
CREATE INDEX idx_doctor_tasks_doctor ON doctor_tasks(doctor_id);
CREATE INDEX idx_doctor_tasks_due_date ON doctor_tasks(due_date);
CREATE INDEX idx_doctor_alerts_doctor ON doctor_alerts(doctor_id);
CREATE INDEX idx_doctor_alerts_unread ON doctor_alerts(doctor_id, is_read);

-- Sample data for testing
INSERT INTO doctor_profiles (user_id, medical_license_number, specialization, qualification, experience_years, consultation_fee, follow_up_fee, department_id) VALUES
(1, 'MH12345', 'Internal Medicine', 'MBBS, MD Internal Medicine', 15, 800.00, 500.00, 1),
(2, 'MH12346', 'Cardiology', 'MBBS, MD, DM Cardiology', 12, 1200.00, 800.00, 2),
(3, 'MH12347', 'Pediatrics', 'MBBS, MD Pediatrics', 8, 700.00, 400.00, 3);

-- Sample clinical templates
INSERT INTO clinical_templates (doctor_id, template_name, template_type, specialty, template_content) VALUES
(1, 'Hypertension Follow-up', 'consultation', 'Internal Medicine', 
 '{"chief_complaint": "Follow-up for hypertension", "assessment": "Hypertension - controlled/uncontrolled", "plan": "Continue current medications, lifestyle modifications, follow-up in 3 months"}'),
(1, 'Diabetes Management', 'consultation', 'Internal Medicine',
 '{"chief_complaint": "Diabetes follow-up", "assessment": "Type 2 Diabetes Mellitus", "plan": "HbA1c monitoring, medication adjustment, dietary counseling"}'),
(2, 'Chest Pain Evaluation', 'consultation', 'Cardiology',
 '{"chief_complaint": "Chest pain", "assessment": "Rule out acute coronary syndrome", "plan": "ECG, Troponins, Echo if indicated"}');
