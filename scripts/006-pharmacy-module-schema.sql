-- Pharmacy Module Schema
-- Medicine Master Data
CREATE TABLE medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_name VARCHAR(255),
    manufacturer VARCHAR(255),
    category VARCHAR(100),
    dosage_form VARCHAR(50), -- tablet, capsule, syrup, injection
    strength VARCHAR(50),
    unit VARCHAR(20), -- mg, ml, etc
    mrp DECIMAL(10,2),
    purchase_rate DECIMAL(10,2),
    selling_rate DECIMAL(10,2),
    tax_percentage DECIMAL(5,2) DEFAULT 12.00,
    is_prescription_required BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicine Inventory with Batch Tracking
CREATE TABLE medicine_inventory (
    id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(id),
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_received INTEGER NOT NULL,
    quantity_available INTEGER NOT NULL,
    purchase_rate DECIMAL(10,2),
    selling_rate DECIMAL(10,2),
    supplier_id INTEGER,
    received_date DATE DEFAULT CURRENT_DATE,
    location VARCHAR(100), -- rack/shelf location
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescription Dispensing
CREATE TABLE prescription_dispensing (
    id SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES prescriptions(id),
    patient_id INTEGER REFERENCES patients(id),
    pharmacist_id INTEGER REFERENCES users(id),
    dispensing_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2),
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    payment_method VARCHAR(50), -- cash, card, upi, insurance
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed
    is_partial_dispensing BOOLEAN DEFAULT false,
    notes TEXT,
    receipt_sent_whatsapp BOOLEAN DEFAULT false,
    receipt_printed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dispensed Medicine Details
CREATE TABLE dispensed_medicines (
    id SERIAL PRIMARY KEY,
    dispensing_id INTEGER REFERENCES prescription_dispensing(id),
    prescription_medicine_id INTEGER REFERENCES prescription_medicines(id),
    medicine_id INTEGER REFERENCES medicines(id),
    inventory_id INTEGER REFERENCES medicine_inventory(id),
    quantity_prescribed INTEGER,
    quantity_dispensed INTEGER,
    unit_price DECIMAL(10,2),
    total_price DECIMAL(10,2),
    is_substitute BOOLEAN DEFAULT false,
    substitute_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Medication Tracking for Reminders
CREATE TABLE patient_medication_tracking (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    medicine_id INTEGER REFERENCES medicines(id),
    dispensing_id INTEGER REFERENCES prescription_dispensing(id),
    start_date DATE,
    end_date DATE,
    duration_days INTEGER,
    reminder_sent BOOLEAN DEFAULT false,
    completion_reminder_sent BOOLEAN DEFAULT false,
    follow_up_required BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Notifications Log
CREATE TABLE whatsapp_notifications (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    phone_number VARCHAR(15),
    message_type VARCHAR(50), -- receipt, reminder, availability, promotion
    message_content TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, failed
    sent_at TIMESTAMP,
    reference_id INTEGER, -- dispensing_id or other reference
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Movement Tracking
CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(id),
    inventory_id INTEGER REFERENCES medicine_inventory(id),
    movement_type VARCHAR(20), -- in, out, adjustment, expired
    quantity INTEGER,
    reference_type VARCHAR(50), -- purchase, dispensing, adjustment, expiry
    reference_id INTEGER,
    notes TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Demand Forecasting
CREATE TABLE demand_forecasting (
    id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES medicines(id),
    forecast_date DATE,
    predicted_demand INTEGER,
    confidence_score DECIMAL(5,2),
    seasonal_factor DECIMAL(5,2),
    trend_factor DECIMAL(5,2),
    actual_demand INTEGER,
    accuracy_score DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Reports Cache
CREATE TABLE pharmacy_reports_cache (
    id SERIAL PRIMARY KEY,
    report_type VARCHAR(50),
    report_date DATE,
    report_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_medicine_inventory_medicine_id ON medicine_inventory(medicine_id);
CREATE INDEX idx_medicine_inventory_expiry ON medicine_inventory(expiry_date);
CREATE INDEX idx_prescription_dispensing_patient ON prescription_dispensing(patient_id);
CREATE INDEX idx_prescription_dispensing_date ON prescription_dispensing(dispensing_date);
CREATE INDEX idx_patient_medication_tracking_patient ON patient_medication_tracking(patient_id);
CREATE INDEX idx_whatsapp_notifications_patient ON whatsapp_notifications(patient_id);
CREATE INDEX idx_stock_movements_medicine ON stock_movements(medicine_id);

-- Insert sample medicines
INSERT INTO medicines (name, generic_name, brand_name, manufacturer, category, dosage_form, strength, unit, mrp, purchase_rate, selling_rate) VALUES
('Paracetamol 500mg', 'Paracetamol', 'Crocin', 'GSK', 'Analgesic', 'Tablet', '500', 'mg', 25.00, 18.00, 22.00),
('Amoxicillin 250mg', 'Amoxicillin', 'Amoxil', 'GSK', 'Antibiotic', 'Capsule', '250', 'mg', 45.00, 32.00, 40.00),
('Omeprazole 20mg', 'Omeprazole', 'Omez', 'Dr Reddy', 'PPI', 'Capsule', '20', 'mg', 35.00, 25.00, 32.00),
('Metformin 500mg', 'Metformin', 'Glycomet', 'USV', 'Antidiabetic', 'Tablet', '500', 'mg', 28.00, 20.00, 25.00),
('Amlodipine 5mg', 'Amlodipine', 'Amlong', 'Micro Labs', 'Antihypertensive', 'Tablet', '5', 'mg', 32.00, 22.00, 28.00);

-- Insert sample inventory
INSERT INTO medicine_inventory (medicine_id, batch_number, expiry_date, quantity_received, quantity_available, purchase_rate, selling_rate) VALUES
(1, 'PCM001', '2025-12-31', 1000, 850, 18.00, 22.00),
(2, 'AMX001', '2025-06-30', 500, 320, 32.00, 40.00),
(3, 'OMZ001', '2025-09-15', 300, 180, 25.00, 32.00),
(4, 'MET001', '2026-03-20', 800, 650, 20.00, 25.00),
(5, 'AML001', '2025-11-10', 400, 280, 22.00, 28.00);
