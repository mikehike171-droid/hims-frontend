-- Lab Management Module Schema

-- Lab Departments
CREATE TABLE lab_departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    location_id INTEGER REFERENCES locations(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Master
CREATE TABLE lab_tests (
    id SERIAL PRIMARY KEY,
    test_code VARCHAR(20) UNIQUE NOT NULL,
    test_name VARCHAR(200) NOT NULL,
    department_id INTEGER REFERENCES lab_departments(id),
    sample_type VARCHAR(100) NOT NULL, -- Blood, Urine, Stool, etc.
    container_type VARCHAR(100) NOT NULL, -- EDTA, Plain, Fluoride, etc.
    method VARCHAR(200),
    units VARCHAR(50),
    tat_hours INTEGER DEFAULT 24, -- Turnaround Time in hours
    price DECIMAL(10,2),
    ai_smart_range_enabled BOOLEAN DEFAULT false,
    reference_ranges JSONB, -- Age/Gender specific ranges
    critical_ranges JSONB, -- Critical value ranges
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Groups/Profiles (CBC, LFT, etc.)
CREATE TABLE lab_test_groups (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL,
    group_code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Group Items
CREATE TABLE lab_test_group_items (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES lab_test_groups(id),
    test_id INTEGER REFERENCES lab_tests(id),
    is_mandatory BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Orders/Requisitions
CREATE TABLE lab_orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    source_type VARCHAR(20) NOT NULL, -- OPD, IPD, Emergency, Walk-in
    priority VARCHAR(20) DEFAULT 'Routine', -- Routine, Urgent, STAT
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_completion TIMESTAMP,
    total_amount DECIMAL(10,2),
    status VARCHAR(30) DEFAULT 'Ordered', -- Ordered, Collected, Processing, Completed, Cancelled
    location_id INTEGER REFERENCES locations(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Order Items
CREATE TABLE lab_order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES lab_orders(id),
    test_id INTEGER REFERENCES lab_tests(id),
    test_group_id INTEGER REFERENCES lab_test_groups(id),
    sample_id VARCHAR(50),
    status VARCHAR(30) DEFAULT 'Ordered',
    collection_date TIMESTAMP,
    collection_location VARCHAR(100),
    phlebotomist_id INTEGER REFERENCES users(id),
    processing_date TIMESTAMP,
    validation_date TIMESTAMP,
    report_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample Tracking
CREATE TABLE lab_samples (
    id SERIAL PRIMARY KEY,
    sample_id VARCHAR(50) UNIQUE NOT NULL,
    order_item_id INTEGER REFERENCES lab_order_items(id),
    barcode VARCHAR(100),
    collection_status VARCHAR(30) DEFAULT 'Pending', -- Pending, Collected, In_Transit, Received, Processing
    collection_date TIMESTAMP,
    received_date TIMESTAMP,
    processing_start TIMESTAMP,
    processing_end TIMESTAMP,
    collected_by INTEGER REFERENCES users(id),
    received_by INTEGER REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Test Results
CREATE TABLE lab_test_results (
    id SERIAL PRIMARY KEY,
    order_item_id INTEGER REFERENCES lab_order_items(id),
    test_id INTEGER REFERENCES lab_tests(id),
    result_value VARCHAR(500),
    result_numeric DECIMAL(15,5), -- For numeric calculations
    units VARCHAR(50),
    reference_range VARCHAR(200),
    is_abnormal BOOLEAN DEFAULT false,
    is_critical BOOLEAN DEFAULT false,
    ai_flag_reason TEXT, -- AI analysis reason
    interpretation TEXT,
    entered_by INTEGER REFERENCES users(id),
    validated_by INTEGER REFERENCES users(id),
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    validation_date TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lab Reports
CREATE TABLE lab_reports (
    id SERIAL PRIMARY KEY,
    report_number VARCHAR(50) UNIQUE NOT NULL,
    order_id INTEGER REFERENCES lab_orders(id),
    report_type VARCHAR(50) DEFAULT 'Standard',
    report_data JSONB, -- Complete report data
    pdf_path VARCHAR(500),
    status VARCHAR(30) DEFAULT 'Draft', -- Draft, Approved, Released, Revised
    generated_date TIMESTAMP,
    approved_by INTEGER REFERENCES users(id),
    approved_date TIMESTAMP,
    revision_number INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report Delivery Log
CREATE TABLE lab_report_deliveries (
    id SERIAL PRIMARY KEY,
    report_id INTEGER REFERENCES lab_reports(id),
    delivery_method VARCHAR(50), -- WhatsApp, Email, Portal, Print
    recipient_contact VARCHAR(200),
    delivery_status VARCHAR(30), -- Sent, Delivered, Read, Failed
    delivery_date TIMESTAMP,
    read_date TIMESTAMP,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Analysis Log
CREATE TABLE lab_ai_analysis (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    test_id INTEGER REFERENCES lab_tests(id),
    current_value DECIMAL(15,5),
    previous_values JSONB, -- Historical values
    trend_analysis VARCHAR(500),
    risk_score INTEGER, -- 1-10 scale
    recommendations TEXT,
    alert_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO lab_departments (name, code, location_id) VALUES 
('Clinical Pathology', 'CP', 1),
('Biochemistry', 'BC', 1),
('Microbiology', 'MB', 1),
('Hematology', 'HM', 1),
('Immunology', 'IM', 1);

-- Sample tests
INSERT INTO lab_tests (test_code, test_name, department_id, sample_type, container_type, method, units, tat_hours, price, reference_ranges, critical_ranges) VALUES 
('HB001', 'Hemoglobin', 4, 'Blood', 'EDTA', 'Automated Analyzer', 'g/dL', 2, 150.00, 
 '{"male": {"min": 13.5, "max": 17.5}, "female": {"min": 12.0, "max": 15.5}}',
 '{"min": 7.0, "max": 20.0}'),
('GLU001', 'Random Blood Sugar', 2, 'Blood', 'Fluoride', 'GOD-POD Method', 'mg/dL', 1, 100.00,
 '{"normal": {"min": 70, "max": 140}}',
 '{"min": 50, "max": 400}'),
('CRE001', 'Serum Creatinine', 2, 'Blood', 'Plain', 'Enzymatic Method', 'mg/dL', 4, 200.00,
 '{"male": {"min": 0.7, "max": 1.3}, "female": {"min": 0.6, "max": 1.1}}',
 '{"min": 0.1, "max": 15.0}');

-- Sample test groups
INSERT INTO lab_test_groups (group_name, group_code, description, price) VALUES 
('Complete Blood Count', 'CBC', 'Complete blood count with differential', 500.00),
('Liver Function Test', 'LFT', 'Complete liver function assessment', 800.00),
('Kidney Function Test', 'KFT', 'Renal function assessment', 600.00);
