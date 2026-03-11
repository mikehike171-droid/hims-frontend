-- Enhanced follow-ups schema for doctor and pharmacy related activities

-- Follow-up categories for better organization
CREATE TABLE IF NOT EXISTS telecaller_followup_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    priority_level INTEGER DEFAULT 1, -- 1=low, 2=medium, 3=high
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert follow-up categories
INSERT INTO telecaller_followup_categories (name, description, priority_level) VALUES
('post_consultation', 'Follow-up calls after doctor consultations', 2),
('medication_adherence', 'Check medication compliance and adherence', 3),
('prescription_refill', 'Remind patients about prescription refills', 2),
('lab_compliance', 'Follow-up on pending lab tests from doctor visits', 3),
('appointment_missed', 'Follow-up with patients who missed appointments', 2),
('payment_consultation', 'Payment collection for consultation fees', 1),
('health_package_completion', 'Follow-up on incomplete health packages', 2),
('specialist_referral', 'Follow-up on specialist referrals from doctors', 2);

-- Enhanced telecaller followups table
DROP TABLE IF EXISTS telecaller_followups;
CREATE TABLE telecaller_followups (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    telecaller_id INTEGER REFERENCES telecaller_users(id),
    category_id INTEGER REFERENCES telecaller_followup_categories(id),
    
    -- Reference data
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_id INTEGER, -- Reference to appointments table
    prescription_id INTEGER, -- Reference to prescriptions table
    lab_order_id INTEGER, -- Reference to lab orders
    consultation_date DATE,
    
    -- Follow-up details
    followup_type VARCHAR(50), -- 'post_visit', 'medication_check', 'lab_reminder', 'payment_due', etc.
    scheduled_date TIMESTAMP,
    due_date DATE,
    priority VARCHAR(10) DEFAULT 'medium', -- 'high', 'medium', 'low'
    
    -- Communication preferences
    preferred_channel VARCHAR(20) DEFAULT 'phone', -- 'phone', 'whatsapp', 'sms', 'email'
    preferred_time_start TIME DEFAULT '09:00:00',
    preferred_time_end TIME DEFAULT '18:00:00',
    
    -- Status tracking
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'attempted', 'completed', 'cancelled', 'rescheduled'
    attempts_count INTEGER DEFAULT 0,
    last_attempt_date TIMESTAMP,
    completion_date TIMESTAMP,
    
    -- Follow-up content
    message_template TEXT,
    notes TEXT,
    outcome VARCHAR(50), -- 'contacted', 'not_reachable', 'completed_action', 'needs_reschedule', etc.
    next_action VARCHAR(100),
    next_followup_date DATE,
    
    -- Medication specific fields
    medication_name VARCHAR(200),
    prescription_date DATE,
    days_supply INTEGER,
    refill_due_date DATE,
    adherence_percentage INTEGER,
    
    -- Lab specific fields
    lab_test_name VARCHAR(200),
    lab_ordered_date DATE,
    lab_due_date DATE,
    lab_status VARCHAR(20), -- 'pending', 'overdue', 'completed'
    
    -- Payment specific fields
    outstanding_amount DECIMAL(10,2),
    payment_type VARCHAR(50), -- 'consultation_fee', 'lab_payment', 'procedure_payment'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctor consultation follow-ups view
CREATE OR REPLACE VIEW doctor_consultation_followups AS
SELECT 
    f.id,
    f.patient_id,
    p.first_name || ' ' || p.last_name as patient_name,
    p.phone,
    p.email,
    f.doctor_id,
    d.first_name || ' ' || d.last_name as doctor_name,
    dept.name as department_name,
    f.consultation_date,
    f.followup_type,
    f.scheduled_date,
    f.due_date,
    f.priority,
    f.status,
    f.attempts_count,
    f.notes,
    f.outcome,
    f.next_action,
    fc.name as category_name,
    fc.description as category_description
FROM telecaller_followups f
LEFT JOIN patients p ON f.patient_id = p.id
LEFT JOIN doctors doc ON f.doctor_id = doc.id
LEFT JOIN users d ON doc.user_id = d.id
LEFT JOIN departments dept ON doc.department_id = dept.id
LEFT JOIN telecaller_followup_categories fc ON f.category_id = fc.id
WHERE f.category_id IN (
    SELECT id FROM telecaller_followup_categories 
    WHERE name IN ('post_consultation', 'lab_compliance', 'specialist_referral', 'payment_consultation')
);

-- Pharmacy follow-ups view
CREATE OR REPLACE VIEW pharmacy_followups AS
SELECT 
    f.id,
    f.patient_id,
    p.first_name || ' ' || p.last_name as patient_name,
    p.phone,
    p.email,
    f.medication_name,
    f.prescription_date,
    f.days_supply,
    f.refill_due_date,
    f.adherence_percentage,
    f.followup_type,
    f.scheduled_date,
    f.due_date,
    f.priority,
    f.status,
    f.attempts_count,
    f.notes,
    f.outcome,
    f.next_action,
    fc.name as category_name,
    CASE 
        WHEN f.refill_due_date < CURRENT_DATE THEN 'overdue'
        WHEN f.refill_due_date <= CURRENT_DATE + INTERVAL '3 days' THEN 'due_soon'
        ELSE 'upcoming'
    END as refill_status
FROM telecaller_followups f
LEFT JOIN patients p ON f.patient_id = p.id
LEFT JOIN telecaller_followup_categories fc ON f.category_id = fc.id
WHERE f.category_id IN (
    SELECT id FROM telecaller_followup_categories 
    WHERE name IN ('medication_adherence', 'prescription_refill')
);

-- Sample follow-up data
INSERT INTO telecaller_followups (
    patient_id, category_id, doctor_id, followup_type, consultation_date, 
    scheduled_date, due_date, priority, message_template, notes
) VALUES
-- Post consultation follow-ups
(1, 1, 1, 'post_visit', '2024-01-10', '2024-01-13 10:00:00', '2024-01-13', 'medium', 
 'Hello {patient_name}, this is a follow-up call regarding your recent visit to Dr. {doctor_name}. How are you feeling?',
 'Check patient recovery and medication compliance'),
 
(2, 1, 2, 'post_visit', '2024-01-12', '2024-01-15 14:00:00', '2024-01-15', 'medium',
 'Hi {patient_name}, following up on your consultation with Dr. {doctor_name}. Any concerns or questions?',
 'Routine post-consultation check'),

-- Medication adherence follow-ups  
(1, 2, 1, 'medication_check', '2024-01-10', '2024-01-20 11:00:00', '2024-01-20', 'high',
 'Hello {patient_name}, are you taking your prescribed medications regularly? Any side effects?',
 'Patient prescribed Amlodipine - check adherence'),

(3, 2, 3, 'medication_check', '2024-01-08', '2024-01-18 09:30:00', '2024-01-18', 'high',
 'Hi {patient_name}, this is about your diabetes medication. How are you managing your doses?',
 'Diabetes medication adherence check'),

-- Prescription refill reminders
(1, 3, 1, 'refill_reminder', '2024-01-10', '2024-01-25 16:00:00', '2024-01-25', 'medium',
 'Hello {patient_name}, your prescription for {medication_name} is due for refill. Would you like to order?',
 'Amlodipine refill due'),

-- Lab compliance follow-ups
(2, 4, 2, 'lab_reminder', '2024-01-12', '2024-01-16 10:30:00', '2024-01-16', 'high',
 'Hi {patient_name}, Dr. {doctor_name} ordered some lab tests for you. Have you completed them?',
 'Lipid profile and HbA1c pending'),

-- Payment follow-ups
(4, 6, 4, 'payment_due', '2024-01-14', '2024-01-17 15:00:00', '2024-01-17', 'low',
 'Hello {patient_name}, you have a pending consultation fee of ₹{amount}. Can we help you with payment?',
 'Pediatric consultation fee pending');

-- Update medication specific data
UPDATE telecaller_followups SET 
    medication_name = 'Amlodipine 5mg',
    prescription_date = '2024-01-10',
    days_supply = 30,
    refill_due_date = '2024-02-09',
    adherence_percentage = 85
WHERE id = 3;

UPDATE telecaller_followups SET 
    medication_name = 'Metformin 500mg',
    prescription_date = '2024-01-08',
    days_supply = 30,
    refill_due_date = '2024-02-07',
    adherence_percentage = 70
WHERE id = 4;

UPDATE telecaller_followups SET 
    medication_name = 'Amlodipine 5mg',
    prescription_date = '2024-01-10',
    days_supply = 30,
    refill_due_date = '2024-02-09'
WHERE id = 5;

-- Update lab specific data
UPDATE telecaller_followups SET 
    lab_test_name = 'Lipid Profile, HbA1c',
    lab_ordered_date = '2024-01-12',
    lab_due_date = '2024-01-16',
    lab_status = 'overdue'
WHERE id = 6;

-- Update payment specific data
UPDATE telecaller_followups SET 
    outstanding_amount = 500.00,
    payment_type = 'consultation_fee'
WHERE id = 7;

-- Create indexes for better performance
CREATE INDEX idx_telecaller_followups_patient_id ON telecaller_followups(patient_id);
CREATE INDEX idx_telecaller_followups_doctor_id ON telecaller_followups(doctor_id);
CREATE INDEX idx_telecaller_followups_category_id ON telecaller_followups(category_id);
CREATE INDEX idx_telecaller_followups_status ON telecaller_followups(status);
CREATE INDEX idx_telecaller_followups_due_date ON telecaller_followups(due_date);
CREATE INDEX idx_telecaller_followups_scheduled_date ON telecaller_followups(scheduled_date);
CREATE INDEX idx_telecaller_followups_priority ON telecaller_followups(priority);
