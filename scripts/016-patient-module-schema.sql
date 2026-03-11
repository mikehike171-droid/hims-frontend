-- Patient Module Schema
-- Complete patient portal and mobile app database structure

-- Patient Profiles and Identity
CREATE TABLE patient_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    otp_verified BOOLEAN DEFAULT FALSE,
    abha_id VARCHAR(50),
    social_login_provider VARCHAR(50),
    social_login_id VARCHAR(255),
    profile_type VARCHAR(20) DEFAULT 'primary', -- primary, dependent
    primary_patient_id UUID REFERENCES patient_profiles(id),
    relationship VARCHAR(50), -- for dependents
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Consent Management
CREATE TABLE patient_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id),
    consent_type VARCHAR(50) NOT NULL, -- lab_sharing, pharmacy_sharing, insurance_sharing, whatsapp_communication
    consent_given BOOLEAN DEFAULT FALSE,
    consent_date TIMESTAMP,
    revoked_date TIMESTAMP,
    purpose TEXT,
    data_categories TEXT[], -- array of data types
    third_parties TEXT[], -- who can access
    expiry_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Health History
CREATE TABLE patient_health_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id),
    category VARCHAR(50) NOT NULL, -- habits, allergies, past_illnesses, surgeries, family_history, menstrual, devices
    subcategory VARCHAR(100),
    value TEXT NOT NULL,
    severity VARCHAR(20), -- mild, moderate, severe
    start_date DATE,
    end_date DATE,
    notes TEXT,
    attachments JSONB, -- file references
    verified_by_doctor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Notifications and Preferences
CREATE TABLE patient_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id),
    type VARCHAR(50) NOT NULL, -- appointment_reminder, lab_ready, medication_reminder, bill_due
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    channel VARCHAR(20) NOT NULL, -- whatsapp, sms, email, push
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, read, failed
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    metadata JSONB, -- additional data like appointment_id, prescription_id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patient_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id),
    notification_type VARCHAR(50) NOT NULL,
    whatsapp_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    advance_hours INTEGER DEFAULT 24, -- how many hours before to send reminder
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Support Tickets
CREATE TABLE patient_support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    patient_id UUID REFERENCES patient_profiles(id),
    category VARCHAR(50) NOT NULL, -- billing, appointments, pharmacy, lab, technical
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open', -- open, in_progress, resolved, closed
    assigned_to UUID, -- staff member
    resolution TEXT,
    attachments JSONB, -- file references
    sla_due_at TIMESTAMP,
    resolved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patient_support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES patient_support_tickets(id),
    sender_type VARCHAR(20) NOT NULL, -- patient, staff
    sender_id UUID NOT NULL,
    message TEXT NOT NULL,
    attachments JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Analytics and Tracking
CREATE TABLE patient_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id),
    metric_type VARCHAR(50) NOT NULL, -- weight, bmi, steps, blood_pressure, glucose
    value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    recorded_date DATE NOT NULL,
    source VARCHAR(50), -- manual, device, wearable
    device_id VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Medication Adherence
CREATE TABLE patient_medication_adherence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id),
    prescription_id UUID, -- reference to prescription
    medication_name VARCHAR(255) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    taken_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- pending, taken, missed, snoozed
    reminder_sent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Access Logs (for security and compliance)
CREATE TABLE patient_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id),
    action VARCHAR(100) NOT NULL, -- login, view_report, download_prescription, share_data
    resource_type VARCHAR(50), -- report, prescription, bill
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    location_info JSONB, -- city, country if available
    success BOOLEAN DEFAULT TRUE,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient App Sessions
CREATE TABLE patient_app_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patient_profiles(id),
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_type VARCHAR(20), -- mobile, web, tablet
    device_id VARCHAR(255),
    fcm_token VARCHAR(255), -- for push notifications
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_patient_profiles_phone ON patient_profiles(phone);
CREATE INDEX idx_patient_profiles_patient_id ON patient_profiles(patient_id);
CREATE INDEX idx_patient_consents_patient_id ON patient_consents(patient_id);
CREATE INDEX idx_patient_health_history_patient_id ON patient_health_history(patient_id);
CREATE INDEX idx_patient_notifications_patient_id ON patient_notifications(patient_id);
CREATE INDEX idx_patient_notifications_status ON patient_notifications(status);
CREATE INDEX idx_patient_support_tickets_patient_id ON patient_support_tickets(patient_id);
CREATE INDEX idx_patient_support_tickets_status ON patient_support_tickets(status);
CREATE INDEX idx_patient_analytics_patient_id ON patient_analytics(patient_id);
CREATE INDEX idx_patient_medication_adherence_patient_id ON patient_medication_adherence(patient_id);
CREATE INDEX idx_patient_access_logs_patient_id ON patient_access_logs(patient_id);
CREATE INDEX idx_patient_app_sessions_patient_id ON patient_app_sessions(patient_id);
CREATE INDEX idx_patient_app_sessions_token ON patient_app_sessions(session_token);
