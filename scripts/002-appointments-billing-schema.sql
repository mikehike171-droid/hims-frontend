-- Appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    appointment_type VARCHAR(50) DEFAULT 'consultation', -- consultation, follow-up, emergency
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled, no-show
    notes TEXT,
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Billing and Payments
CREATE TABLE bills (
    id SERIAL PRIMARY KEY,
    bill_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    appointment_id INTEGER REFERENCES appointments(id),
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, partial, cancelled
    payment_method VARCHAR(50), -- cash, card, upi, insurance
    discount_type VARCHAR(50), -- company, insurance, senior_citizen, staff
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

-- Bill Items
CREATE TABLE bill_items (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER REFERENCES bills(id),
    item_type VARCHAR(50), -- consultation, medicine, test, procedure
    item_name VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    doctor_id INTEGER REFERENCES doctors(id)
);

-- Prescriptions
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    prescription_number VARCHAR(50) UNIQUE NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_id INTEGER REFERENCES appointments(id),
    bill_id INTEGER REFERENCES bills(id),
    diagnosis TEXT,
    notes TEXT,
    follow_up_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- active, completed, cancelled
    location_id INTEGER REFERENCES locations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescription Items (Medicines)
CREATE TABLE prescription_items (
    id SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES prescriptions(id),
    medicine_name VARCHAR(255),
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    instructions TEXT,
    quantity INTEGER
);

-- Discount Rules
CREATE TABLE discount_rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- percentage, fixed_amount
    value DECIMAL(10,2),
    applicable_to VARCHAR(50), -- consultation, medicine, all
    conditions JSONB, -- JSON conditions for eligibility
    is_active BOOLEAN DEFAULT true,
    location_id INTEGER REFERENCES locations(id)
);

-- Update queue_tokens table to include payment status
ALTER TABLE queue_tokens ADD COLUMN appointment_id INTEGER REFERENCES appointments(id);
ALTER TABLE queue_tokens ADD COLUMN payment_status VARCHAR(20) DEFAULT 'pending';
ALTER TABLE queue_tokens ADD COLUMN bill_id INTEGER REFERENCES bills(id);

-- Insert sample data
INSERT INTO discount_rules (name, type, value, applicable_to, conditions) VALUES 
('Senior Citizen Discount', 'percentage', 10.00, 'all', '{"age_above": 60}'),
('Staff Discount', 'percentage', 20.00, 'all', '{"employee": true}'),
('TCS Employee', 'percentage', 15.00, 'consultation', '{"company": "TCS"}'),
('Emergency Discount', 'fixed_amount', 500.00, 'consultation', '{"emergency": true}');

INSERT INTO departments (name, code, location_id) VALUES 
('Cardiology', 'CARD', 1),
('Orthopedics', 'ORTHO', 1),
('General Medicine', 'GM', 1),
('Pediatrics', 'PED', 1),
('Emergency', 'ER', 1),
('Dermatology', 'DERM', 1);

INSERT INTO doctors (user_id, specialization, license_number, department_id, consultation_fee, location_id) VALUES 
(2, 'Cardiology', 'LIC001', 1, 800.00, 1),
(3, 'Orthopedics', 'LIC002', 2, 700.00, 1),
(4, 'General Medicine', 'LIC003', 3, 500.00, 1),
(5, 'Pediatrics', 'LIC004', 4, 600.00, 1);
