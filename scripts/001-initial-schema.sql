-- Core Tables for Multi-Location HMS

-- Locations/Branches
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users and Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    permissions JSONB,
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role_id INTEGER REFERENCES roles(id),
    location_id INTEGER REFERENCES locations(id),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    patient_id VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(10),
    address TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    family_head_phone VARCHAR(20), -- Links family members
    insurance_details JSONB,
    company_discount_tag VARCHAR(100),
    referrer_doctor_id INTEGER,
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Queue Management
CREATE TABLE queue_tokens (
    id SERIAL PRIMARY KEY,
    token_number VARCHAR(20) NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    department VARCHAR(100),
    priority_level INTEGER DEFAULT 1, -- AI-determined priority
    estimated_wait_time INTEGER, -- in minutes
    status VARCHAR(20) DEFAULT 'waiting', -- waiting, called, completed, cancelled
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Departments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10),
    location_id INTEGER REFERENCES locations(id),
    is_active BOOLEAN DEFAULT true
);

-- Doctors
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    specialization VARCHAR(100),
    license_number VARCHAR(100),
    department_id INTEGER REFERENCES departments(id),
    consultation_fee DECIMAL(10,2),
    is_available BOOLEAN DEFAULT true,
    location_id INTEGER REFERENCES locations(id)
);

-- Insert sample data
INSERT INTO locations (name, code, address, phone, email) VALUES 
('Pranam Main Hospital', 'PMH', '123 Medical Center Rd, City', '+91-9876543210', 'main@pranamhospitals.com'),
('Pranam Branch - North', 'PBN', '456 North Ave, City', '+91-9876543211', 'north@pranamhospitals.com');

INSERT INTO roles (name, permissions) VALUES 
('Super Admin', '{"all": true}'),
('Doctor', '{"patients": "read_write", "prescriptions": "read_write", "queue": "read"}'),
('Nurse', '{"patients": "read", "vitals": "read_write", "queue": "read"}'),
('Receptionist', '{"patients": "read_write", "queue": "read_write", "billing": "read"}'),
('Pharmacist', '{"prescriptions": "read", "inventory": "read_write"}');
