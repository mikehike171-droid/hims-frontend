-- Billing & Accounts Module Schema
-- Complete feature set for HMS billing system

-- Service Master
CREATE TABLE service_master (
    id SERIAL PRIMARY KEY,
    service_code VARCHAR(20) UNIQUE NOT NULL,
    service_name VARCHAR(200) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    category VARCHAR(50) NOT NULL, -- 'consultation', 'procedure', 'investigation', 'pharmacy', 'room'
    sub_category VARCHAR(100),
    description TEXT,
    unit VARCHAR(20) DEFAULT 'each', -- 'each', 'hour', 'day', 'ml', 'mg'
    base_rate DECIMAL(10,2) NOT NULL DEFAULT 0,
    doctor_share_percentage DECIMAL(5,2) DEFAULT 0,
    tax_slab_id INTEGER REFERENCES tax_slabs(id),
    is_package_inclusion BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    hsn_sac_code VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Tax/GST Configuration
CREATE TABLE tax_slabs (
    id SERIAL PRIMARY KEY,
    slab_name VARCHAR(50) NOT NULL,
    hsn_sac_code VARCHAR(20),
    cgst_rate DECIMAL(5,2) DEFAULT 0,
    sgst_rate DECIMAL(5,2) DEFAULT 0,
    igst_rate DECIMAL(5,2) DEFAULT 0,
    cess_rate DECIMAL(5,2) DEFAULT 0,
    is_exempted BOOLEAN DEFAULT false,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Price Lists
CREATE TABLE price_lists (
    id SERIAL PRIMARY KEY,
    list_name VARCHAR(100) NOT NULL,
    list_type VARCHAR(50) NOT NULL, -- 'standard', 'corporate', 'insurance', 'emergency', 'night'
    description TEXT,
    effective_from DATE NOT NULL,
    effective_to DATE,
    branch_id INTEGER REFERENCES locations(id),
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Price List Items
CREATE TABLE price_list_items (
    id SERIAL PRIMARY KEY,
    price_list_id INTEGER REFERENCES price_lists(id),
    service_id INTEGER REFERENCES service_master(id),
    rate DECIMAL(10,2) NOT NULL,
    markup_percentage DECIMAL(5,2) DEFAULT 0,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Package Master
CREATE TABLE packages (
    id SERIAL PRIMARY KEY,
    package_code VARCHAR(20) UNIQUE NOT NULL,
    package_name VARCHAR(200) NOT NULL,
    package_type VARCHAR(50) NOT NULL, -- 'delivery', 'surgery', 'health_check'
    department_id INTEGER REFERENCES departments(id),
    description TEXT,
    base_rate DECIMAL(10,2) NOT NULL,
    length_of_stay INTEGER DEFAULT 0, -- in days
    room_class VARCHAR(50),
    inclusions TEXT,
    exclusions TEXT,
    terms_conditions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Package Inclusions
CREATE TABLE package_inclusions (
    id SERIAL PRIMARY KEY,
    package_id INTEGER REFERENCES packages(id),
    service_id INTEGER REFERENCES service_master(id),
    quantity INTEGER DEFAULT 1,
    is_included BOOLEAN DEFAULT true, -- true for inclusion, false for exclusion
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discount Rules
CREATE TABLE discount_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- 'percentage', 'fixed_amount'
    discount_value DECIMAL(10,2) NOT NULL,
    max_discount_cap DECIMAL(10,2),
    applicable_roles TEXT[], -- array of role names
    reason_codes TEXT[],
    requires_approval BOOLEAN DEFAULT false,
    approval_level INTEGER DEFAULT 1,
    applicable_services TEXT[], -- service categories or specific services
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Rounding Rules
CREATE TABLE rounding_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- 'bill_level', 'line_item'
    rounding_method VARCHAR(20) NOT NULL, -- 'round_off', 'round_up', 'round_down'
    rounding_to DECIMAL(5,2) DEFAULT 1.00, -- round to nearest 1.00, 0.50, etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing Encounters
CREATE TABLE billing_encounters (
    id SERIAL PRIMARY KEY,
    encounter_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    encounter_type VARCHAR(20) NOT NULL, -- 'OP', 'IP', 'Emergency'
    admission_id INTEGER REFERENCES admissions(id), -- for IP billing
    appointment_id INTEGER REFERENCES appointments(id), -- for OP billing
    bill_date DATE NOT NULL DEFAULT CURRENT_DATE,
    bill_time TIME NOT NULL DEFAULT CURRENT_TIME,
    branch_id INTEGER REFERENCES locations(id),
    department_id INTEGER REFERENCES departments(id),
    primary_doctor_id INTEGER REFERENCES users(id),
    package_id INTEGER REFERENCES packages(id),
    price_list_id INTEGER REFERENCES price_lists(id),
    
    -- Financial Summary
    gross_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) DEFAULT 0,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    balance_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Insurance/TPA Details
    insurance_company_id INTEGER REFERENCES insurance_companies(id),
    tpa_id INTEGER REFERENCES tpa_companies(id),
    pre_auth_number VARCHAR(100),
    pre_auth_amount DECIMAL(12,2) DEFAULT 0,
    patient_share DECIMAL(12,2) DEFAULT 0,
    insurance_share DECIMAL(12,2) DEFAULT 0,
    copay_percentage DECIMAL(5,2) DEFAULT 0,
    deductible_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Status and Control
    bill_status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'final', 'cancelled', 'refunded'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'partial', 'paid', 'overdue'
    is_discharged BOOLEAN DEFAULT false,
    discharge_date TIMESTAMP,
    
    -- Audit
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    
    -- GST Invoice Details
    invoice_number VARCHAR(50),
    invoice_date DATE,
    gstin VARCHAR(15),
    place_of_supply VARCHAR(50)
);

-- Billing Line Items
CREATE TABLE billing_line_items (
    id SERIAL PRIMARY KEY,
    encounter_id INTEGER REFERENCES billing_encounters(id),
    service_id INTEGER REFERENCES service_master(id),
    service_date DATE NOT NULL,
    service_time TIME,
    quantity DECIMAL(10,3) DEFAULT 1,
    unit_rate DECIMAL(10,2) NOT NULL,
    gross_amount DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    taxable_amount DECIMAL(10,2) NOT NULL,
    
    -- Tax Breakdown
    cgst_rate DECIMAL(5,2) DEFAULT 0,
    cgst_amount DECIMAL(10,2) DEFAULT 0,
    sgst_rate DECIMAL(5,2) DEFAULT 0,
    sgst_amount DECIMAL(10,2) DEFAULT 0,
    igst_rate DECIMAL(5,2) DEFAULT 0,
    igst_amount DECIMAL(10,2) DEFAULT 0,
    cess_rate DECIMAL(5,2) DEFAULT 0,
    cess_amount DECIMAL(10,2) DEFAULT 0,
    
    net_amount DECIMAL(10,2) NOT NULL,
    
    -- Package and Doctor Details
    is_package_inclusion BOOLEAN DEFAULT false,
    doctor_id INTEGER REFERENCES users(id),
    doctor_share_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Source Integration
    source_module VARCHAR(50), -- 'manual', 'pharmacy', 'lab', 'radiology', 'ot'
    source_reference_id INTEGER,
    
    -- Status
    item_status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'refunded'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Payment Transactions
CREATE TABLE payment_transactions (
    id SERIAL PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    encounter_id INTEGER REFERENCES billing_encounters(id),
    transaction_type VARCHAR(20) NOT NULL, -- 'payment', 'refund', 'advance', 'adjustment'
    payment_mode VARCHAR(50) NOT NULL, -- 'cash', 'card', 'upi', 'wallet', 'gateway', 'cheque', 'dd'
    amount DECIMAL(12,2) NOT NULL,
    
    -- Payment Details
    reference_number VARCHAR(100), -- card/upi/gateway reference
    bank_name VARCHAR(100),
    cheque_number VARCHAR(50),
    cheque_date DATE,
    gateway_response TEXT,
    
    -- Status
    transaction_status VARCHAR(20) DEFAULT 'success', -- 'success', 'failed', 'pending', 'cancelled'
    
    -- Cashier Details
    cashier_id INTEGER REFERENCES users(id),
    shift_id INTEGER,
    counter_id INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Advance/Deposit Management
CREATE TABLE patient_deposits (
    id SERIAL PRIMARY KEY,
    deposit_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    encounter_id INTEGER REFERENCES billing_encounters(id),
    deposit_type VARCHAR(20) NOT NULL, -- 'advance', 'security', 'refundable'
    amount DECIMAL(12,2) NOT NULL,
    utilized_amount DECIMAL(12,2) DEFAULT 0,
    balance_amount DECIMAL(12,2) NOT NULL,
    
    -- Payment Details
    payment_mode VARCHAR(50) NOT NULL,
    reference_number VARCHAR(100),
    
    -- Status
    deposit_status VARCHAR(20) DEFAULT 'active', -- 'active', 'utilized', 'refunded', 'transferred'
    
    -- Transfer Details (for inter-encounter transfers)
    transferred_to_encounter_id INTEGER REFERENCES billing_encounters(id),
    transfer_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Credit Notes
CREATE TABLE credit_notes (
    id SERIAL PRIMARY KEY,
    credit_note_number VARCHAR(50) UNIQUE NOT NULL,
    encounter_id INTEGER REFERENCES billing_encounters(id),
    original_invoice_number VARCHAR(50),
    credit_type VARCHAR(20) NOT NULL, -- 'refund', 'cancellation', 'correction', 'discount'
    reason TEXT NOT NULL,
    gross_amount DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL,
    
    -- Approval
    requires_approval BOOLEAN DEFAULT true,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    approval_remarks TEXT,
    
    -- Status
    credit_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'processed'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Debit Notes
CREATE TABLE debit_notes (
    id SERIAL PRIMARY KEY,
    debit_note_number VARCHAR(50) UNIQUE NOT NULL,
    encounter_id INTEGER REFERENCES billing_encounters(id),
    debit_type VARCHAR(20) NOT NULL, -- 'additional_charge', 'penalty', 'correction'
    reason TEXT NOT NULL,
    gross_amount DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL,
    
    -- Approval
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Cashier Shifts
CREATE TABLE cashier_shifts (
    id SERIAL PRIMARY KEY,
    shift_number VARCHAR(50) UNIQUE NOT NULL,
    cashier_id INTEGER REFERENCES users(id),
    counter_id INTEGER,
    branch_id INTEGER REFERENCES locations(id),
    
    -- Shift Timing
    shift_start_time TIMESTAMP NOT NULL,
    shift_end_time TIMESTAMP,
    
    -- Opening Balance
    opening_cash DECIMAL(12,2) DEFAULT 0,
    opening_remarks TEXT,
    
    -- Closing Balance
    closing_cash DECIMAL(12,2) DEFAULT 0,
    system_cash DECIMAL(12,2) DEFAULT 0,
    variance_amount DECIMAL(12,2) DEFAULT 0,
    closing_remarks TEXT,
    
    -- Collections Summary
    total_collections DECIMAL(12,2) DEFAULT 0,
    cash_collections DECIMAL(12,2) DEFAULT 0,
    card_collections DECIMAL(12,2) DEFAULT 0,
    upi_collections DECIMAL(12,2) DEFAULT 0,
    other_collections DECIMAL(12,2) DEFAULT 0,
    
    -- Refunds
    total_refunds DECIMAL(12,2) DEFAULT 0,
    
    -- Status
    shift_status VARCHAR(20) DEFAULT 'open', -- 'open', 'closed', 'reconciled'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_by INTEGER REFERENCES users(id),
    closed_at TIMESTAMP
);

-- Approval Workflows
CREATE TABLE approval_requests (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(50) NOT NULL, -- 'discount', 'refund', 'rate_override', 'write_off'
    reference_table VARCHAR(50) NOT NULL,
    reference_id INTEGER NOT NULL,
    requested_amount DECIMAL(12,2),
    reason TEXT NOT NULL,
    
    -- Requester
    requested_by INTEGER REFERENCES users(id),
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Approver
    approver_level INTEGER DEFAULT 1,
    assigned_to INTEGER REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    approval_remarks TEXT,
    
    -- Status
    request_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payer Contracts (Insurance/Corporate)
CREATE TABLE payer_contracts (
    id SERIAL PRIMARY KEY,
    payer_type VARCHAR(20) NOT NULL, -- 'insurance', 'tpa', 'corporate'
    payer_id INTEGER NOT NULL, -- references insurance_companies or corporate_clients
    contract_number VARCHAR(100) UNIQUE NOT NULL,
    contract_name VARCHAR(200) NOT NULL,
    
    -- Contract Period
    effective_from DATE NOT NULL,
    effective_to DATE NOT NULL,
    
    -- Financial Terms
    credit_limit DECIMAL(15,2) DEFAULT 0,
    credit_days INTEGER DEFAULT 30,
    copay_percentage DECIMAL(5,2) DEFAULT 0,
    deductible_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Room Class Limits
    room_class_limit VARCHAR(50),
    room_rent_limit DECIMAL(10,2) DEFAULT 0,
    
    -- Billing Terms
    billing_cycle VARCHAR(20) DEFAULT 'monthly', -- 'weekly', 'monthly', 'quarterly'
    payment_terms TEXT,
    
    -- Status
    contract_status VARCHAR(20) DEFAULT 'active', -- 'active', 'expired', 'terminated'
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Payer Rate Cards
CREATE TABLE payer_rate_cards (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES payer_contracts(id),
    service_id INTEGER REFERENCES service_master(id),
    rate_type VARCHAR(20) NOT NULL, -- 'fixed', 'percentage', 'package'
    rate_value DECIMAL(10,2) NOT NULL,
    max_payable_amount DECIMAL(10,2),
    
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Claims Management
CREATE TABLE insurance_claims (
    id SERIAL PRIMARY KEY,
    claim_number VARCHAR(100) UNIQUE NOT NULL,
    encounter_id INTEGER REFERENCES billing_encounters(id),
    insurance_company_id INTEGER REFERENCES insurance_companies(id),
    tpa_id INTEGER REFERENCES tpa_companies(id),
    
    -- Claim Details
    claim_type VARCHAR(20) NOT NULL, -- 'cashless', 'reimbursement'
    claim_amount DECIMAL(12,2) NOT NULL,
    approved_amount DECIMAL(12,2) DEFAULT 0,
    settled_amount DECIMAL(12,2) DEFAULT 0,
    deduction_amount DECIMAL(12,2) DEFAULT 0,
    
    -- Dates
    claim_date DATE NOT NULL,
    submission_date DATE,
    approval_date DATE,
    settlement_date DATE,
    
    -- Status
    claim_status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'settled', 'rejected'
    
    -- Deduction Details
    deduction_reasons TEXT[],
    deduction_remarks TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Billing Audit Log
CREATE TABLE billing_audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    
    -- User and Session
    user_id INTEGER REFERENCES users(id),
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    
    -- Timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Additional Context
    remarks TEXT,
    module_name VARCHAR(50)
);

-- Indexes for Performance
CREATE INDEX idx_billing_encounters_patient ON billing_encounters(patient_id);
CREATE INDEX idx_billing_encounters_date ON billing_encounters(bill_date);
CREATE INDEX idx_billing_encounters_status ON billing_encounters(bill_status);
CREATE INDEX idx_billing_line_items_encounter ON billing_line_items(encounter_id);
CREATE INDEX idx_billing_line_items_service ON billing_line_items(service_id);
CREATE INDEX idx_payment_transactions_encounter ON payment_transactions(encounter_id);
CREATE INDEX idx_payment_transactions_date ON payment_transactions(created_at);
CREATE INDEX idx_service_master_code ON service_master(service_code);
CREATE INDEX idx_service_master_dept ON service_master(department_id);
CREATE INDEX idx_price_list_items_service ON price_list_items(service_id);
CREATE INDEX idx_insurance_claims_encounter ON insurance_claims(encounter_id);
CREATE INDEX idx_billing_audit_log_table_record ON billing_audit_log(table_name, record_id);

-- Sample Data
INSERT INTO tax_slabs (slab_name, cgst_rate, sgst_rate, igst_rate, effective_from) VALUES
('GST 0%', 0, 0, 0, '2023-01-01'),
('GST 5%', 2.5, 2.5, 5, '2023-01-01'),
('GST 12%', 6, 6, 12, '2023-01-01'),
('GST 18%', 9, 9, 18, '2023-01-01'),
('GST 28%', 14, 14, 28, '2023-01-01');

INSERT INTO service_master (service_code, service_name, department_id, category, base_rate, doctor_share_percentage, tax_slab_id) VALUES
('CONS001', 'General Consultation', 1, 'consultation', 500.00, 60.00, 1),
('CONS002', 'Specialist Consultation', 2, 'consultation', 800.00, 65.00, 1),
('LAB001', 'Complete Blood Count', 3, 'investigation', 300.00, 0.00, 2),
('RAD001', 'Chest X-Ray', 4, 'investigation', 400.00, 0.00, 2),
('PROC001', 'Minor Surgery', 5, 'procedure', 5000.00, 40.00, 3),
('ROOM001', 'General Ward Bed', 6, 'room', 1500.00, 0.00, 1),
('ROOM002', 'Private Room', 6, 'room', 3000.00, 0.00, 1),
('ROOM003', 'ICU Bed', 7, 'room', 5000.00, 0.00, 1);

INSERT INTO price_lists (list_name, list_type, effective_from, is_default) VALUES
('Standard Rate Card', 'standard', '2023-01-01', true),
('Corporate Rate Card', 'corporate', '2023-01-01', false),
('Insurance Rate Card', 'insurance', '2023-01-01', false),
('Emergency Rate Card', 'emergency', '2023-01-01', false);

INSERT INTO discount_rules (rule_name, rule_type, discount_value, max_discount_cap, applicable_roles, reason_codes, requires_approval) VALUES
('Staff Discount', 'percentage', 20.00, 1000.00, ARRAY['staff'], ARRAY['STAFF_DISCOUNT'], false),
('Senior Citizen Discount', 'percentage', 10.00, 500.00, ARRAY['cashier', 'billing_executive'], ARRAY['SENIOR_CITIZEN'], false),
('Emergency Discount', 'percentage', 15.00, 2000.00, ARRAY['doctor', 'admin'], ARRAY['EMERGENCY_CASE'], true);

-- Triggers for Audit Trail
CREATE OR REPLACE FUNCTION billing_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO billing_audit_log (table_name, record_id, action, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), NEW.created_by);
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO billing_audit_log (table_name, record_id, action, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), NEW.updated_by);
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO billing_audit_log (table_name, record_id, action, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), OLD.updated_by);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to key tables
CREATE TRIGGER billing_encounters_audit AFTER INSERT OR UPDATE OR DELETE ON billing_encounters
    FOR EACH ROW EXECUTE FUNCTION billing_audit_trigger();

CREATE TRIGGER billing_line_items_audit AFTER INSERT OR UPDATE OR DELETE ON billing_line_items
    FOR EACH ROW EXECUTE FUNCTION billing_audit_trigger();

CREATE TRIGGER payment_transactions_audit AFTER INSERT OR UPDATE OR DELETE ON payment_transactions
    FOR EACH ROW EXECUTE FUNCTION billing_audit_trigger();
