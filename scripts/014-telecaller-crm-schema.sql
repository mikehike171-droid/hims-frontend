-- Telecaller/CRM Module Schema
-- This schema supports the complete telecaller workflow including patient search, booking, and payment tracking

-- Telecaller Roles and Permissions
CREATE TABLE telecaller_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO telecaller_roles (name, description, permissions) VALUES
('telecaller', 'Basic Telecaller', '{"can_call": true, "can_book": true, "can_view_patient": true}'),
('senior_telecaller', 'Senior Telecaller', '{"can_call": true, "can_book": true, "can_view_patient": true, "can_manage_campaigns": true}'),
('team_lead', 'Team Lead', '{"can_call": true, "can_book": true, "can_view_patient": true, "can_manage_campaigns": true, "can_view_reports": true}'),
('manager', 'Manager', '{"can_call": true, "can_book": true, "can_view_patient": true, "can_manage_campaigns": true, "can_view_reports": true, "can_manage_users": true}');

-- Telecaller Users
CREATE TABLE telecaller_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    role_id INTEGER REFERENCES telecaller_roles(id),
    employee_id VARCHAR(20) UNIQUE,
    extension_number VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaigns
CREATE TABLE telecaller_campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL, -- 'health_package', 'vaccine', 'follow_up', 'general'
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'active', 'paused', 'completed'
    start_date DATE,
    end_date DATE,
    target_count INTEGER DEFAULT 0,
    completed_count INTEGER DEFAULT 0,
    conversion_count INTEGER DEFAULT 0,
    revenue_target DECIMAL(10,2) DEFAULT 0,
    revenue_achieved DECIMAL(10,2) DEFAULT 0,
    created_by INTEGER REFERENCES telecaller_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Campaign Templates
CREATE TABLE telecaller_campaign_templates (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES telecaller_campaigns(id),
    channel VARCHAR(20) NOT NULL, -- 'phone', 'whatsapp', 'sms', 'email'
    template_name VARCHAR(100),
    content TEXT NOT NULL,
    variables JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task Queues
CREATE TABLE telecaller_tasks (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    campaign_id INTEGER REFERENCES telecaller_campaigns(id),
    assigned_to INTEGER REFERENCES telecaller_users(id),
    task_type VARCHAR(50) NOT NULL, -- 'new_lead', 'follow_up', 'lab_reminder', 'rx_reminder', 'appointment_reminder', 'payment_reminder'
    priority VARCHAR(10) DEFAULT 'medium', -- 'high', 'medium', 'low'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    due_date TIMESTAMP,
    scheduled_time TIMESTAMP,
    context_data JSONB DEFAULT '{}', -- Additional context like lab_id, prescription_id, etc.
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Call Logs
CREATE TABLE telecaller_call_logs (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES telecaller_tasks(id),
    patient_id INTEGER REFERENCES patients(id),
    telecaller_id INTEGER REFERENCES telecaller_users(id),
    phone_number VARCHAR(20),
    call_start_time TIMESTAMP,
    call_end_time TIMESTAMP,
    duration INTEGER, -- in seconds
    outcome VARCHAR(50), -- 'booked', 'info_given', 'call_later', 'not_reachable', 'declined', 'wrong_number'
    notes TEXT,
    recording_url VARCHAR(500),
    follow_up_date TIMESTAMP,
    follow_up_channel VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointment Bookings via Telecaller
CREATE TABLE telecaller_bookings (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    telecaller_id INTEGER REFERENCES telecaller_users(id),
    call_log_id INTEGER REFERENCES telecaller_call_logs(id),
    doctor_id INTEGER REFERENCES doctors(id),
    department_id INTEGER REFERENCES departments(id),
    branch_id INTEGER REFERENCES branches(id),
    appointment_date DATE,
    appointment_time TIME,
    token_number VARCHAR(10),
    appointment_type VARCHAR(50) DEFAULT 'consultation',
    consultation_fee DECIMAL(8,2),
    booking_fee DECIMAL(8,2) DEFAULT 0,
    total_amount DECIMAL(8,2),
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'partial', 'paid', 'cancelled'
    payment_method VARCHAR(20), -- 'cash', 'card', 'upi', 'online', 'pending'
    payment_link VARCHAR(500),
    confirmation_sent BOOLEAN DEFAULT false,
    reminder_sent BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'booked', -- 'booked', 'confirmed', 'completed', 'no_show', 'cancelled'
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payment Tracking
CREATE TABLE telecaller_payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES telecaller_bookings(id),
    patient_id INTEGER REFERENCES patients(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_type VARCHAR(50), -- 'booking_fee', 'consultation_fee', 'advance_payment'
    payment_method VARCHAR(20),
    payment_reference VARCHAR(100),
    payment_date TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
    gateway_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Follow-up Schedules
CREATE TABLE telecaller_followups (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    telecaller_id INTEGER REFERENCES telecaller_users(id),
    parent_call_id INTEGER REFERENCES telecaller_call_logs(id),
    followup_type VARCHAR(50), -- 'appointment_reminder', 'lab_reminder', 'rx_reminder', 'post_visit', 'payment_reminder'
    scheduled_date TIMESTAMP,
    channel VARCHAR(20), -- 'phone', 'whatsapp', 'sms', 'email'
    status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'failed'
    message_template TEXT,
    completion_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Tracking
CREATE TABLE telecaller_compliance (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    compliance_type VARCHAR(50), -- 'lab_completion', 'rx_adherence', 'appointment_attendance'
    reference_id INTEGER, -- lab_order_id, prescription_id, appointment_id
    due_date DATE,
    completion_date DATE,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'overdue', 'cancelled'
    reminder_count INTEGER DEFAULT 0,
    last_reminder_date TIMESTAMP,
    telecaller_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Metrics
CREATE TABLE telecaller_metrics (
    id SERIAL PRIMARY KEY,
    telecaller_id INTEGER REFERENCES telecaller_users(id),
    date DATE,
    calls_made INTEGER DEFAULT 0,
    calls_connected INTEGER DEFAULT 0,
    appointments_booked INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue_influenced DECIMAL(10,2) DEFAULT 0,
    talk_time INTEGER DEFAULT 0, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Consent Management
CREATE TABLE telecaller_consent (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    phone_consent BOOLEAN DEFAULT true,
    whatsapp_consent BOOLEAN DEFAULT false,
    sms_consent BOOLEAN DEFAULT true,
    email_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    preferred_language VARCHAR(20) DEFAULT 'english',
    preferred_time_start TIME DEFAULT '09:00:00',
    preferred_time_end TIME DEFAULT '18:00:00',
    dnd_status BOOLEAN DEFAULT false,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Integration Events (for cross-module communication)
CREATE TABLE telecaller_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL, -- 'lab.order.created', 'pharmacy.rx.created', 'appointment.no_show', etc.
    source_module VARCHAR(50),
    reference_id INTEGER,
    patient_id INTEGER REFERENCES patients(id),
    event_data JSONB,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Branches table (if not exists)
CREATE TABLE IF NOT EXISTS branches (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample branches
INSERT INTO branches (name, address, phone, email) VALUES
('Main Branch - MG Road', '123 MG Road, Bangalore, Karnataka 560001', '+91-80-12345678', 'mgroad@pranamhms.com'),
('Branch - Koramangala', '456 Koramangala, Bangalore, Karnataka 560034', '+91-80-12345679', 'koramangala@pranamhms.com'),
('Branch - Whitefield', '789 Whitefield, Bangalore, Karnataka 560066', '+91-80-12345680', 'whitefield@pranamhms.com');

-- Departments table (if not exists)
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample departments
INSERT INTO departments (name, description) VALUES
('Cardiology', 'Heart and cardiovascular system'),
('Dermatology', 'Skin, hair, and nail conditions'),
('Orthopedics', 'Bones, joints, and muscles'),
('Pediatrics', 'Medical care for infants, children, and adolescents'),
('Neurology', 'Nervous system disorders'),
('General Medicine', 'Primary healthcare and general medical conditions');

-- Doctors table (if not exists)
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    employee_id VARCHAR(20) UNIQUE,
    department_id INTEGER REFERENCES departments(id),
    specialization VARCHAR(100),
    qualification VARCHAR(200),
    experience_years INTEGER,
    consultation_fee DECIMAL(8,2),
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample doctors
INSERT INTO doctors (employee_id, department_id, specialization, qualification, experience_years, consultation_fee) VALUES
('DOC001', 1, 'Interventional Cardiology', 'MD Cardiology, DM Interventional Cardiology', 15, 800.00),
('DOC002', 2, 'Cosmetic Dermatology', 'MD Dermatology, Fellowship in Cosmetic Dermatology', 10, 600.00),
('DOC003', 3, 'Joint Replacement', 'MS Orthopedics, Fellowship in Joint Replacement', 12, 700.00),
('DOC004', 4, 'Pediatric Cardiology', 'MD Pediatrics, DM Pediatric Cardiology', 8, 500.00),
('DOC005', 5, 'Stroke Medicine', 'DM Neurology, Fellowship in Stroke Medicine', 14, 1000.00),
('DOC006', 6, 'Internal Medicine', 'MD Internal Medicine', 20, 400.00);

-- Create indexes for better performance
CREATE INDEX idx_telecaller_tasks_patient_id ON telecaller_tasks(patient_id);
CREATE INDEX idx_telecaller_tasks_assigned_to ON telecaller_tasks(assigned_to);
CREATE INDEX idx_telecaller_tasks_status ON telecaller_tasks(status);
CREATE INDEX idx_telecaller_tasks_due_date ON telecaller_tasks(due_date);
CREATE INDEX idx_telecaller_call_logs_patient_id ON telecaller_call_logs(patient_id);
CREATE INDEX idx_telecaller_call_logs_telecaller_id ON telecaller_call_logs(telecaller_id);
CREATE INDEX idx_telecaller_bookings_patient_id ON telecaller_bookings(patient_id);
CREATE INDEX idx_telecaller_bookings_payment_status ON telecaller_bookings(payment_status);
CREATE INDEX idx_telecaller_payments_booking_id ON telecaller_payments(booking_id);
CREATE INDEX idx_telecaller_payments_status ON telecaller_payments(status);
CREATE INDEX idx_telecaller_compliance_patient_id ON telecaller_compliance(patient_id);
CREATE INDEX idx_telecaller_compliance_status ON telecaller_compliance(status);
CREATE INDEX idx_telecaller_events_processed ON telecaller_events(processed);
