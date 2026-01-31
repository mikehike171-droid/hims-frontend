-- Update patient_vitals table to better support outpatient workflow
ALTER TABLE patient_vitals ADD COLUMN visit_type VARCHAR(20) DEFAULT 'outpatient'; -- outpatient, inpatient, emergency
ALTER TABLE patient_vitals ADD COLUMN consultation_status VARCHAR(20) DEFAULT 'pending'; -- pending, in_progress, completed
ALTER TABLE patient_vitals ADD COLUMN doctor_reviewed BOOLEAN DEFAULT false;
ALTER TABLE patient_vitals ADD COLUMN doctor_review_notes TEXT;
ALTER TABLE patient_vitals ADD COLUMN priority_level INTEGER DEFAULT 1; -- 1=normal, 2=attention, 3=urgent

-- Create vitals alerts table for better tracking
CREATE TABLE vitals_alerts (
    id SERIAL PRIMARY KEY,
    vitals_id INTEGER REFERENCES patient_vitals(id),
    alert_type VARCHAR(50), -- critical, warning, info
    vital_name VARCHAR(50), -- temperature, blood_pressure, heart_rate, etc.
    alert_message TEXT,
    recommended_action TEXT,
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_by INTEGER REFERENCES users(id),
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update queue_tokens to include vitals status
ALTER TABLE queue_tokens ADD COLUMN vitals_completed BOOLEAN DEFAULT false;
ALTER TABLE queue_tokens ADD COLUMN vitals_id INTEGER REFERENCES patient_vitals(id);
ALTER TABLE queue_tokens ADD COLUMN has_critical_vitals BOOLEAN DEFAULT false;

-- Create outpatient workflow tracking
CREATE TABLE outpatient_workflow (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    appointment_id INTEGER REFERENCES appointments(id),
    queue_token_id INTEGER REFERENCES queue_tokens(id),
    
    -- Workflow steps
    registration_completed BOOLEAN DEFAULT false,
    vitals_completed BOOLEAN DEFAULT false,
    doctor_consultation_started BOOLEAN DEFAULT false,
    doctor_consultation_completed BOOLEAN DEFAULT false,
    prescription_generated BOOLEAN DEFAULT false,
    
    -- Timestamps
    registration_at TIMESTAMP,
    vitals_at TIMESTAMP,
    consultation_started_at TIMESTAMP,
    consultation_completed_at TIMESTAMP,
    prescription_at TIMESTAMP,
    
    -- Status
    current_step VARCHAR(50) DEFAULT 'registration',
    overall_status VARCHAR(20) DEFAULT 'in_progress',
    
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample outpatient workflow data
INSERT INTO outpatient_workflow (patient_id, appointment_id, registration_completed, vitals_completed, current_step, registration_at, vitals_at) VALUES
(1, 1, true, true, 'waiting_for_doctor', '2024-01-20 09:00:00', '2024-01-20 09:15:00'),
(2, 2, true, false, 'vitals_pending', '2024-01-20 09:30:00', NULL),
(3, 3, true, true, 'consultation_in_progress', '2024-01-20 10:00:00', '2024-01-20 10:10:00');

-- Insert sample vitals with alerts
INSERT INTO patient_vitals (patient_id, appointment_id, nurse_id, temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation, visit_type, consultation_status, location_id) VALUES
(1, 1, 1, 38.2, 160, 95, 105, 22, 94, 'outpatient', 'pending', 1),
(2, 2, 1, 36.8, 120, 80, 75, 16, 98, 'outpatient', 'pending', 1),
(3, 3, 1, 39.1, 180, 110, 120, 24, 92, 'outpatient', 'pending', 1);

-- Insert corresponding alerts
INSERT INTO vitals_alerts (vitals_id, alert_type, vital_name, alert_message, recommended_action) VALUES
(1, 'warning', 'temperature', 'Elevated temperature: 38.2°C', 'Monitor for signs of infection, consider fever management'),
(1, 'warning', 'blood_pressure', 'Hypertension Stage 1: 160/95 mmHg', 'Recheck BP, assess cardiovascular risk factors'),
(1, 'warning', 'heart_rate', 'Mild tachycardia: 105 bpm', 'Monitor heart rate, check for underlying causes'),
(1, 'warning', 'oxygen_saturation', 'Low oxygen saturation: 94%', 'Consider oxygen supplementation if symptoms present'),
(3, 'critical', 'temperature', 'High fever: 39.1°C', 'Immediate fever management required, investigate cause'),
(3, 'critical', 'blood_pressure', 'Hypertensive crisis: 180/110 mmHg', 'Immediate medical attention required'),
(3, 'critical', 'heart_rate', 'Tachycardia: 120 bpm', 'Cardiac assessment required'),
(3, 'critical', 'oxygen_saturation', 'Hypoxemia: 92%', 'Oxygen therapy may be required');
