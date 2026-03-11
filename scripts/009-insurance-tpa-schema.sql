-- Insurance & TPA Module Schema
-- This creates all tables needed for comprehensive insurance and TPA management

-- TPA Master Table
CREATE TABLE tpa_master (
    id SERIAL PRIMARY KEY,
    tpa_name VARCHAR(255) NOT NULL,
    tpa_code VARCHAR(50) UNIQUE NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    processing_time_sla INTEGER DEFAULT 72, -- in hours
    claim_email VARCHAR(255),
    portal_url VARCHAR(500),
    api_endpoint VARCHAR(500),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insurance Company Master
CREATE TABLE insurance_companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_code VARCHAR(50) UNIQUE NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    policy_types JSON, -- ['Corporate', 'Retail', 'Government', 'Individual']
    required_documents JSON, -- Document requirements per policy type
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- TPA-Insurance Company Linking
CREATE TABLE tpa_insurance_mapping (
    id SERIAL PRIMARY KEY,
    tpa_id INTEGER REFERENCES tpa_master(id),
    insurance_company_id INTEGER REFERENCES insurance_companies(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rate Agreements
CREATE TABLE rate_agreements (
    id SERIAL PRIMARY KEY,
    tpa_id INTEGER REFERENCES tpa_master(id),
    insurance_company_id INTEGER REFERENCES insurance_companies(id),
    package_code VARCHAR(100),
    package_name VARCHAR(255),
    agreed_rate DECIMAL(10,2),
    room_category ENUM('general', 'semi_private', 'private', 'deluxe', 'suite'),
    pre_approval_required BOOLEAN DEFAULT true,
    coverage_limit DECIMAL(10,2),
    co_payment_percentage DECIMAL(5,2) DEFAULT 0,
    deductible_amount DECIMAL(10,2) DEFAULT 0,
    valid_from DATE,
    valid_to DATE,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Patient Insurance Details
CREATE TABLE patient_insurance (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    insurance_company_id INTEGER REFERENCES insurance_companies(id),
    tpa_id INTEGER REFERENCES tpa_master(id),
    policy_number VARCHAR(100) NOT NULL,
    insured_name VARCHAR(255),
    insured_id_card_no VARCHAR(100),
    policy_type ENUM('Corporate', 'Retail', 'Government', 'Individual'),
    policy_start_date DATE,
    policy_end_date DATE,
    sum_insured DECIMAL(10,2),
    sum_available DECIMAL(10,2),
    co_payment_percentage DECIMAL(5,2) DEFAULT 0,
    deductible_amount DECIMAL(10,2) DEFAULT 0,
    room_category_eligible ENUM('general', 'semi_private', 'private', 'deluxe', 'suite'),
    policy_document_url VARCHAR(500),
    id_proof_url VARCHAR(500),
    is_primary BOOLEAN DEFAULT true,
    status ENUM('active', 'inactive', 'expired') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pre-Authorization Requests
CREATE TABLE pre_authorization_requests (
    id SERIAL PRIMARY KEY,
    auth_number VARCHAR(100) UNIQUE NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    patient_insurance_id INTEGER REFERENCES patient_insurance(id),
    tpa_id INTEGER REFERENCES tpa_master(id),
    insurance_company_id INTEGER REFERENCES insurance_companies(id),
    doctor_id INTEGER REFERENCES doctors(id),
    admission_type ENUM('emergency', 'planned', 'day_care'),
    diagnosis_primary VARCHAR(500),
    diagnosis_secondary TEXT,
    icd_codes JSON,
    proposed_procedure VARCHAR(500),
    procedure_codes JSON,
    estimated_los INTEGER, -- Length of stay in days
    estimated_room_charges DECIMAL(10,2),
    estimated_doctor_charges DECIMAL(10,2),
    estimated_investigation_charges DECIMAL(10,2),
    estimated_medicine_charges DECIMAL(10,2),
    estimated_other_charges DECIMAL(10,2),
    total_estimated_amount DECIMAL(10,2),
    room_category_requested ENUM('general', 'semi_private', 'private', 'deluxe', 'suite'),
    tpa_coordinator VARCHAR(255),
    submission_mode ENUM('email', 'portal', 'api', 'manual'),
    submitted_at TIMESTAMP,
    status ENUM('draft', 'submitted', 'in_review', 'query_raised', 'approved', 'partially_approved', 'rejected') DEFAULT 'draft',
    approved_amount DECIMAL(10,2),
    approved_room_category ENUM('general', 'semi_private', 'private', 'deluxe', 'suite'),
    approval_letter_url VARCHAR(500),
    rejection_reason TEXT,
    query_details TEXT,
    sla_due_date TIMESTAMP,
    priority ENUM('urgent', 'high', 'normal', 'low') DEFAULT 'normal',
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Pre-Auth Documents
CREATE TABLE pre_auth_documents (
    id SERIAL PRIMARY KEY,
    pre_auth_id INTEGER REFERENCES pre_authorization_requests(id),
    document_type ENUM('consultation_notes', 'lab_reports', 'radiology_reports', 'previous_discharge_summary', 'fitness_certificate', 'other'),
    document_name VARCHAR(255),
    document_url VARCHAR(500),
    is_mandatory BOOLEAN DEFAULT false,
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims Management
CREATE TABLE insurance_claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    pre_auth_id INTEGER REFERENCES pre_authorization_requests(id),
    patient_id INTEGER REFERENCES patients(id),
    patient_insurance_id INTEGER REFERENCES patient_insurance(id),
    tpa_id INTEGER REFERENCES tpa_master(id),
    insurance_company_id INTEGER REFERENCES insurance_companies(id),
    admission_id INTEGER, -- Reference to admission table when created
    discharge_date DATE,
    final_bill_amount DECIMAL(10,2),
    claimed_amount DECIMAL(10,2),
    approved_amount DECIMAL(10,2),
    settled_amount DECIMAL(10,2),
    deduction_amount DECIMAL(10,2),
    deduction_reason TEXT,
    submission_mode ENUM('email', 'portal', 'api', 'courier'),
    submitted_at TIMESTAMP,
    tpa_executive VARCHAR(255),
    status ENUM('draft', 'submitted', 'query_raised', 'resubmitted', 'approved', 'partially_approved', 'rejected', 'settled') DEFAULT 'draft',
    settlement_date DATE,
    payment_reference VARCHAR(255),
    sla_due_date TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Claim Documents
CREATE TABLE claim_documents (
    id SERIAL PRIMARY KEY,
    claim_id INTEGER REFERENCES insurance_claims(id),
    document_type ENUM('final_bill', 'discharge_summary', 'lab_reports', 'radiology_reports', 'prescription', 'implant_stickers', 'investigation_reports', 'other'),
    document_name VARCHAR(255),
    document_url VARCHAR(500),
    is_mandatory BOOLEAN DEFAULT false,
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Query Management
CREATE TABLE insurance_queries (
    id SERIAL PRIMARY KEY,
    reference_type ENUM('pre_auth', 'claim'),
    reference_id INTEGER, -- pre_auth_id or claim_id
    query_type ENUM('missing_signature', 'incomplete_summary', 'ineligible_expense', 'documentation_incomplete', 'medical_necessity', 'other'),
    query_description TEXT,
    query_raised_by VARCHAR(255),
    query_raised_at TIMESTAMP,
    response_description TEXT,
    response_documents JSON, -- URLs of uploaded documents
    responded_by INTEGER REFERENCES users(id),
    responded_at TIMESTAMP,
    status ENUM('open', 'responded', 'resolved', 'escalated') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Status History for Audit Trail
CREATE TABLE insurance_status_history (
    id SERIAL PRIMARY KEY,
    reference_type ENUM('pre_auth', 'claim'),
    reference_id INTEGER,
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    changed_by INTEGER REFERENCES users(id),
    change_reason TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notification Templates
CREATE TABLE notification_templates (
    id SERIAL PRIMARY KEY,
    template_name VARCHAR(255) NOT NULL,
    template_type ENUM('whatsapp', 'sms', 'email'),
    event_trigger VARCHAR(255), -- pre_auth_submitted, claim_approved, etc.
    template_content TEXT,
    variables JSON, -- Available variables for the template
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Data Insertion

-- Insert TPA Masters
INSERT INTO tpa_master (tpa_name, tpa_code, contact_person, phone, email, processing_time_sla, claim_email) VALUES
('Medi Assist India TPA Pvt Ltd', 'MEDI', 'Rajesh Kumar', '+91-80-12345678', 'claims@mediassist.in', 72, 'preauth@mediassist.in'),
('Vidal Health TPA Pvt Ltd', 'VIDAL', 'Priya Sharma', '+91-44-87654321', 'support@vidalhealth.com', 48, 'claims@vidalhealth.com'),
('Good Health TPA Services', 'GOOD', 'Amit Patel', '+91-22-11223344', 'info@goodhealth.co.in', 96, 'claims@goodhealth.co.in'),
('Paramount Health Services', 'PARAM', 'Sunita Reddy', '+91-40-55667788', 'contact@paramounttpa.com', 72, 'preauth@paramounttpa.com');

-- Insert Insurance Companies
INSERT INTO insurance_companies (company_name, company_code, contact_person, phone, email, policy_types, required_documents) VALUES
('ICICI Lombard General Insurance', 'ICICI', 'Vikram Singh', '+91-22-66815050', 'health@icicilombard.com', 
 '["Corporate", "Retail", "Individual"]', 
 '{"Corporate": ["Policy Copy", "Employee ID", "Salary Certificate"], "Retail": ["Policy Copy", "ID Proof", "Address Proof"], "Individual": ["Policy Copy", "ID Proof", "Medical Reports"]}'),
('HDFC ERGO General Insurance', 'HDFC', 'Meera Joshi', '+91-22-66316161', 'health@hdfcergo.com',
 '["Corporate", "Retail", "Government"]',
 '{"Corporate": ["Policy Copy", "HR Letter", "Salary Slip"], "Retail": ["Policy Copy", "PAN Card", "Aadhaar"], "Government": ["Policy Copy", "Service Certificate", "ID Proof"]}'),
('Star Health and Allied Insurance', 'STAR', 'Ravi Krishnan', '+91-44-28288282', 'customercare@starhealth.in',
 '["Individual", "Family", "Senior Citizen"]',
 '{"Individual": ["Policy Copy", "Age Proof", "Medical History"], "Family": ["Policy Copy", "Family Details", "Medical Reports"], "Senior Citizen": ["Policy Copy", "Age Certificate", "Health Checkup"]}');

-- Insert TPA-Insurance Mappings
INSERT INTO tpa_insurance_mapping (tpa_id, insurance_company_id) VALUES
(1, 1), (1, 2), (2, 1), (2, 3), (3, 2), (4, 1), (4, 3);

-- Insert Sample Rate Agreements
INSERT INTO rate_agreements (tpa_id, insurance_company_id, package_code, package_name, agreed_rate, room_category, coverage_limit, valid_from, valid_to) VALUES
(1, 1, 'NORM_DEL', 'Normal Delivery Package', 25000.00, 'general', 50000.00, '2024-01-01', '2024-12-31'),
(1, 1, 'CAESAR_DEL', 'Caesarean Delivery Package', 45000.00, 'semi_private', 80000.00, '2024-01-01', '2024-12-31'),
(2, 2, 'CATARACT', 'Cataract Surgery Package', 35000.00, 'private', 60000.00, '2024-01-01', '2024-12-31'),
(3, 3, 'APPENDIX', 'Appendectomy Package', 40000.00, 'general', 70000.00, '2024-01-01', '2024-12-31');

-- Insert Notification Templates
INSERT INTO notification_templates (template_name, template_type, event_trigger, template_content, variables) VALUES
('Pre-Auth Submitted', 'whatsapp', 'pre_auth_submitted', 
 'Dear {patient_name}, your insurance pre-authorization request #{auth_number} has been submitted to {tpa_name}. Expected response within {sla_hours} hours. - Pranam Hospitals',
 '["patient_name", "auth_number", "tpa_name", "sla_hours"]'),
('Pre-Auth Approved', 'whatsapp', 'pre_auth_approved',
 'Good news! Your pre-authorization #{auth_number} has been approved for ₹{approved_amount}. Room category: {room_category}. - Pranam Hospitals',
 '["auth_number", "approved_amount", "room_category"]'),
('Claim Submitted', 'whatsapp', 'claim_submitted',
 'Your insurance claim #{claim_number} for ₹{claimed_amount} has been submitted to {tpa_name}. We will update you on the status. - Pranam Hospitals',
 '["claim_number", "claimed_amount", "tpa_name"]'),
('Query Raised', 'whatsapp', 'query_raised',
 'Query raised on your insurance request #{reference_number}. Reason: {query_reason}. Please contact us for resolution. - Pranam Hospitals',
 '["reference_number", "query_reason"]');

-- Create indexes for better performance
CREATE INDEX idx_patient_insurance_patient_id ON patient_insurance(patient_id);
CREATE INDEX idx_pre_auth_patient_id ON pre_authorization_requests(patient_id);
CREATE INDEX idx_pre_auth_status ON pre_authorization_requests(status);
CREATE INDEX idx_pre_auth_tpa_id ON pre_authorization_requests(tpa_id);
CREATE INDEX idx_claims_patient_id ON insurance_claims(patient_id);
CREATE INDEX idx_claims_status ON insurance_claims(status);
CREATE INDEX idx_claims_tpa_id ON insurance_claims(tpa_id);
CREATE INDEX idx_queries_reference ON insurance_queries(reference_type, reference_id);
