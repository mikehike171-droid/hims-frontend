-- Settings and User Management Schema
-- This script creates tables for comprehensive user, role, and system management

-- Locations/Branches Table
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    country VARCHAR(50) DEFAULT 'India',
    phone VARCHAR(20),
    email VARCHAR(100),
    is_main_branch BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    location_id INTEGER REFERENCES locations(id),
    head_user_id INTEGER, -- Will reference users table
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    department_id INTEGER REFERENCES departments(id),
    is_system_role BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions Table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    module VARCHAR(50) NOT NULL, -- patients, prescriptions, pharmacy, etc.
    action VARCHAR(20) NOT NULL, -- read, write, delete, approve
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions Junction Table
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Enhanced Users Table (extending existing users table)
ALTER TABLE users ADD COLUMN IF NOT EXISTS employee_id VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id INTEGER REFERENCES departments(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_id INTEGER REFERENCES locations(id);
ALTER TABLE users ADD COLUMN IF NOT EXISTS designation VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS joining_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS salary DECIMAL(10,2);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image VARCHAR(255);

-- User Roles Junction Table
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by INTEGER REFERENCES users(id),
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, role_id)
);

-- User Permissions (Individual permissions beyond role)
CREATE TABLE user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
    granted_by INTEGER REFERENCES users(id),
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    UNIQUE(user_id, permission_id)
);

-- System Settings Table
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- general, security, notifications, etc.
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    data_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Can be accessed by non-admin users
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category, setting_key)
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(50) NOT NULL, -- login, create, update, delete, etc.
    table_name VARCHAR(50),
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint for department head
ALTER TABLE departments ADD CONSTRAINT fk_department_head 
    FOREIGN KEY (head_user_id) REFERENCES users(id);

-- Insert default locations
INSERT INTO locations (name, code, address_line1, city, state, pincode, phone, email, is_main_branch) VALUES
('Pranam Main Hospital', 'PMH001', '123 Medical Street', 'Mumbai', 'Maharashtra', '400001', '+91-22-12345678', 'main@pranamhms.com', TRUE),
('Pranam Branch - Andheri', 'PMH002', '456 Health Avenue', 'Mumbai', 'Maharashtra', '400058', '+91-22-87654321', 'andheri@pranamhms.com', FALSE),
('Pranam Branch - Pune', 'PMH003', '789 Care Road', 'Pune', 'Maharashtra', '411001', '+91-20-11223344', 'pune@pranamhms.com', FALSE);

-- Insert default departments
INSERT INTO departments (name, code, description, location_id) VALUES
('Administration', 'ADMIN', 'Hospital Administration and Management', 1),
('Emergency', 'EMRG', 'Emergency and Trauma Care', 1),
('Cardiology', 'CARD', 'Heart and Cardiovascular Care', 1),
('Neurology', 'NEURO', 'Brain and Nervous System Care', 1),
('Orthopedics', 'ORTHO', 'Bone and Joint Care', 1),
('Pediatrics', 'PEDIA', 'Child Healthcare', 1),
('Gynecology', 'GYNO', 'Women Healthcare', 1),
('Pharmacy', 'PHARM', 'Medication Management', 1),
('Laboratory', 'LAB', 'Diagnostic Services', 1),
('Radiology', 'RADIO', 'Medical Imaging', 1),
('Nursing', 'NURSE', 'Patient Care and Support', 1),
('IT Support', 'IT', 'Information Technology Support', 1);

-- Insert default roles
INSERT INTO roles (name, code, description, department_id, is_system_role) VALUES
('Super Admin', 'SUPER_ADMIN', 'Full system access', 1, TRUE),
('Hospital Admin', 'HOSPITAL_ADMIN', 'Hospital management access', 1, TRUE),
('Department Head', 'DEPT_HEAD', 'Department management access', NULL, TRUE),
('Doctor', 'DOCTOR', 'Medical practitioner access', NULL, TRUE),
('Nurse', 'NURSE', 'Nursing staff access', 11, TRUE),
('Pharmacist', 'PHARMACIST', 'Pharmacy management access', 8, TRUE),
('Lab Technician', 'LAB_TECH', 'Laboratory operations access', 9, TRUE),
('Receptionist', 'RECEPTIONIST', 'Front desk operations access', 1, TRUE),
('Billing Staff', 'BILLING', 'Billing and finance access', 1, TRUE),
('IT Support', 'IT_SUPPORT', 'Technical support access', 12, TRUE);

-- Insert default permissions
INSERT INTO permissions (module, action, description) VALUES
-- Patient Management
('patients', 'read', 'View patient information'),
('patients', 'write', 'Create and update patient records'),
('patients', 'delete', 'Delete patient records'),
('patients', 'approve', 'Approve patient registrations'),

-- Prescriptions
('prescriptions', 'read', 'View prescriptions'),
('prescriptions', 'write', 'Create and update prescriptions'),
('prescriptions', 'delete', 'Delete prescriptions'),
('prescriptions', 'approve', 'Approve prescriptions'),

-- Pharmacy
('pharmacy', 'read', 'View pharmacy data'),
('pharmacy', 'write', 'Manage pharmacy operations'),
('pharmacy', 'delete', 'Delete pharmacy records'),
('pharmacy', 'approve', 'Approve pharmacy transactions'),

-- Laboratory
('laboratory', 'read', 'View lab results and orders'),
('laboratory', 'write', 'Create and update lab orders'),
('laboratory', 'delete', 'Delete lab records'),
('laboratory', 'approve', 'Approve lab results'),

-- Billing
('billing', 'read', 'View billing information'),
('billing', 'write', 'Create and update bills'),
('billing', 'delete', 'Delete billing records'),
('billing', 'approve', 'Approve billing transactions'),

-- Reports
('reports', 'read', 'View reports'),
('reports', 'write', 'Generate custom reports'),
('reports', 'delete', 'Delete reports'),
('reports', 'approve', 'Approve report access'),

-- Settings
('settings', 'read', 'View system settings'),
('settings', 'write', 'Modify system settings'),
('settings', 'delete', 'Delete system configurations'),
('settings', 'approve', 'Approve system changes'),

-- User Management
('users', 'read', 'View user information'),
('users', 'write', 'Create and update users'),
('users', 'delete', 'Delete users'),
('users', 'approve', 'Approve user accounts');

-- Insert default system settings
INSERT INTO system_settings (category, setting_key, setting_value, data_type, description, is_public) VALUES
-- General Settings
('general', 'hospital_name', 'Pranam Hospital Management System', 'string', 'Hospital name displayed in the system', TRUE),
('general', 'hospital_logo', '/images/pranam-logo.png', 'string', 'Hospital logo path', TRUE),
('general', 'timezone', 'Asia/Kolkata', 'string', 'System timezone', TRUE),
('general', 'currency', 'INR', 'string', 'Default currency', TRUE),
('general', 'date_format', 'DD/MM/YYYY', 'string', 'Date display format', TRUE),

-- Security Settings
('security', 'password_min_length', '8', 'number', 'Minimum password length', FALSE),
('security', 'password_require_uppercase', 'true', 'boolean', 'Require uppercase in password', FALSE),
('security', 'password_require_numbers', 'true', 'boolean', 'Require numbers in password', FALSE),
('security', 'password_require_symbols', 'false', 'boolean', 'Require symbols in password', FALSE),
('security', 'session_timeout', '30', 'number', 'Session timeout in minutes', FALSE),
('security', 'max_login_attempts', '5', 'number', 'Maximum login attempts before lockout', FALSE),
('security', 'enable_2fa', 'false', 'boolean', 'Enable two-factor authentication', FALSE),

-- Notification Settings
('notifications', 'email_enabled', 'true', 'boolean', 'Enable email notifications', FALSE),
('notifications', 'sms_enabled', 'false', 'boolean', 'Enable SMS notifications', FALSE),
('notifications', 'push_enabled', 'true', 'boolean', 'Enable push notifications', FALSE),
('notifications', 'email_from', 'noreply@pranamhms.com', 'string', 'Default email sender', FALSE),

-- System Settings
('system', 'maintenance_mode', 'false', 'boolean', 'System maintenance mode', FALSE),
('system', 'backup_frequency', 'daily', 'string', 'Database backup frequency', FALSE),
('system', 'max_file_upload_size', '10', 'number', 'Maximum file upload size in MB', FALSE),
('system', 'enable_audit_logs', 'true', 'boolean', 'Enable audit logging', FALSE);

-- Create indexes for better performance
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_users_location ON users(location_id);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role_id);
CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
