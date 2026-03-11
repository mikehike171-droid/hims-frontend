-- Complete Pharmacy System Schema with all requested features
-- This includes dispensing, billing, discounts, WhatsApp integration, AI forecasting, and reports

-- Drop existing tables if they exist
DROP TABLE IF EXISTS pharmacy_whatsapp_logs CASCADE;
DROP TABLE IF EXISTS pharmacy_ai_forecasts CASCADE;
DROP TABLE IF EXISTS pharmacy_follow_up_tasks CASCADE;
DROP TABLE IF EXISTS pharmacy_medication_tracking CASCADE;
DROP TABLE IF EXISTS pharmacy_bounce_analysis CASCADE;
DROP TABLE IF EXISTS pharmacy_discount_rules CASCADE;
DROP TABLE IF EXISTS pharmacy_billing_items CASCADE;
DROP TABLE IF EXISTS pharmacy_billing CASCADE;
DROP TABLE IF EXISTS pharmacy_dispensing_items CASCADE;
DROP TABLE IF EXISTS pharmacy_dispensing CASCADE;
DROP TABLE IF EXISTS pharmacy_inventory_movements CASCADE;
DROP TABLE IF EXISTS pharmacy_medicines CASCADE;

-- Pharmacy Medicines Master
CREATE TABLE pharmacy_medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255) NOT NULL,
    strength VARCHAR(100) NOT NULL,
    dosage_form VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    available_stock INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
    mrp DECIMAL(10,2) NOT NULL,
    is_prescription_required BOOLEAN DEFAULT false,
    reorder_level INTEGER DEFAULT 10,
    max_stock_level INTEGER DEFAULT 1000,
    storage_conditions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Inventory Movements
CREATE TABLE pharmacy_inventory_movements (
    id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES pharmacy_medicines(id),
    movement_type VARCHAR(50) NOT NULL, -- 'IN', 'OUT', 'ADJUSTMENT', 'EXPIRED', 'DAMAGED'
    quantity INTEGER NOT NULL,
    reference_type VARCHAR(50), -- 'PURCHASE', 'SALE', 'DISPENSING', 'ADJUSTMENT'
    reference_id INTEGER,
    reason TEXT,
    performed_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Dispensing (Prescription-based)
CREATE TABLE pharmacy_dispensing (
    id SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES prescriptions(id),
    patient_id INTEGER REFERENCES patients(id),
    pharmacist_id INTEGER REFERENCES users(id),
    dispensing_type VARCHAR(50) DEFAULT 'prescription', -- 'prescription', 'direct_sale'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'partial', 'completed', 'cancelled'
    total_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    discount_reason TEXT,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) DEFAULT 0,
    payment_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed', 'failed'
    payment_method VARCHAR(50),
    notes TEXT,
    whatsapp_sent BOOLEAN DEFAULT false,
    receipt_printed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Dispensing Items
CREATE TABLE pharmacy_dispensing_items (
    id SERIAL PRIMARY KEY,
    dispensing_id INTEGER REFERENCES pharmacy_dispensing(id),
    medicine_id INTEGER REFERENCES pharmacy_medicines(id),
    quantity_prescribed INTEGER NOT NULL,
    quantity_dispensed INTEGER NOT NULL DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    dosage_instructions TEXT,
    frequency VARCHAR(50),
    duration VARCHAR(50),
    is_partial_dispensing BOOLEAN DEFAULT false,
    partial_reason TEXT,
    is_substitute BOOLEAN DEFAULT false,
    substitute_medicine_id INTEGER REFERENCES pharmacy_medicines(id),
    substitute_reason TEXT,
    additional_quantity INTEGER DEFAULT 0,
    additional_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Billing (Unified billing for both prescription and direct sales)
CREATE TABLE pharmacy_billing (
    id SERIAL PRIMARY KEY,
    receipt_number VARCHAR(100) UNIQUE NOT NULL,
    patient_id INTEGER REFERENCES patients(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_address TEXT,
    billing_type VARCHAR(50) NOT NULL, -- 'prescription', 'direct_sale'
    prescription_id INTEGER REFERENCES prescriptions(id),
    dispensing_id INTEGER REFERENCES pharmacy_dispensing(id),
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_reason TEXT,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'completed',
    paid_amount DECIMAL(10,2) DEFAULT 0,
    change_amount DECIMAL(10,2) DEFAULT 0,
    pharmacist_id INTEGER REFERENCES users(id),
    whatsapp_sent BOOLEAN DEFAULT false,
    receipt_printed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Billing Items
CREATE TABLE pharmacy_billing_items (
    id SERIAL PRIMARY KEY,
    billing_id INTEGER REFERENCES pharmacy_billing(id),
    medicine_id INTEGER REFERENCES pharmacy_medicines(id),
    medicine_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    batch_number VARCHAR(100),
    expiry_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Discount Rules
CREATE TABLE pharmacy_discount_rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL, -- 'percentage', 'fixed'
    discount_value DECIMAL(10,2) NOT NULL,
    applicable_to VARCHAR(50) DEFAULT 'all', -- 'all', 'prescription', 'direct_sale', 'category'
    category_filter VARCHAR(100),
    conditions JSONB, -- Store complex conditions as JSON
    is_active BOOLEAN DEFAULT true,
    valid_from DATE,
    valid_until DATE,
    usage_limit INTEGER,
    usage_count INTEGER DEFAULT 0,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Bounce Analysis (Track prescription bounces)
CREATE TABLE pharmacy_bounce_analysis (
    id SERIAL PRIMARY KEY,
    prescription_id INTEGER REFERENCES prescriptions(id),
    medicine_id INTEGER REFERENCES pharmacy_medicines(id),
    patient_id INTEGER REFERENCES patients(id),
    bounce_reason VARCHAR(255) NOT NULL, -- 'out_of_stock', 'expired', 'not_available', 'patient_declined'
    bounce_date DATE NOT NULL,
    estimated_loss DECIMAL(10,2),
    alternative_suggested BOOLEAN DEFAULT false,
    alternative_medicine_id INTEGER REFERENCES pharmacy_medicines(id),
    follow_up_required BOOLEAN DEFAULT true,
    follow_up_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Medication Tracking (For WhatsApp reminders)
CREATE TABLE pharmacy_medication_tracking (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    medicine_id INTEGER REFERENCES pharmacy_medicines(id),
    medicine_name VARCHAR(255) NOT NULL,
    dispensing_id INTEGER REFERENCES pharmacy_dispensing(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INTEGER NOT NULL,
    daily_dosage INTEGER NOT NULL,
    total_quantity INTEGER NOT NULL,
    remaining_days INTEGER,
    completion_reminder_sent BOOLEAN DEFAULT false,
    completion_reminder_date DATE,
    stock_available_reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Follow-up Tasks
CREATE TABLE pharmacy_follow_up_tasks (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    prescription_id INTEGER REFERENCES prescriptions(id),
    task_type VARCHAR(100) NOT NULL, -- 'partial_dispensing_followup', 'medicine_promotion', 'stock_available'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
    assigned_to VARCHAR(100), -- 'pharmacist', 'telecaller'
    task_details JSONB, -- Store task-specific details
    due_date DATE,
    completed_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Forecasting for Stock Management
CREATE TABLE pharmacy_ai_forecasts (
    id SERIAL PRIMARY KEY,
    medicine_id INTEGER REFERENCES pharmacy_medicines(id),
    medicine_name VARCHAR(255) NOT NULL,
    current_stock INTEGER NOT NULL,
    predicted_demand INTEGER NOT NULL,
    forecast_period_days INTEGER DEFAULT 30,
    recommended_order_quantity INTEGER DEFAULT 0,
    risk_level VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    confidence_percentage DECIMAL(5,2) NOT NULL,
    factors_considered JSONB, -- Store factors like seasonality, trends, etc.
    forecast_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Integration Logs
CREATE TABLE pharmacy_whatsapp_logs (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id),
    patient_phone VARCHAR(20) NOT NULL,
    message_type VARCHAR(100) NOT NULL, -- 'receipt', 'reminder', 'stock_alert', 'follow_up'
    message_content TEXT NOT NULL,
    reference_type VARCHAR(50), -- 'billing', 'dispensing', 'reminder'
    reference_id INTEGER,
    delivery_status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'delivered', 'read', 'failed'
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP
);

-- Insert sample discount rules
INSERT INTO pharmacy_discount_rules (name, description, discount_type, discount_value, applicable_to, conditions, is_active, created_by) VALUES
('Senior Citizen Discount', '10% discount for customers above 60 years', 'percentage', 10.00, 'all', '{"age_above": 60}', true, 1),
('Staff Discount', '20% discount for hospital staff', 'percentage', 20.00, 'all', '{"employee": true}', true, 1),
('TCS Employee Discount', '15% discount for TCS employees', 'percentage', 15.00, 'all', '{"company": "TCS"}', true, 1),
('Emergency Discount', 'Fixed ₹500 discount for emergency cases', 'fixed', 500.00, 'all', '{"emergency": true}', true, 1),
('Insurance Co-pay', '80% coverage for insured patients', 'percentage', 80.00, 'all', '{"insurance": true}', true, 1),
('Bulk Purchase Discount', '5% discount on orders above ₹2000', 'percentage', 5.00, 'all', '{"minimum_amount": 2000}', true, 1);

-- Insert sample medicines
INSERT INTO pharmacy_medicines (name, generic_name, strength, dosage_form, manufacturer, category, batch_number, expiry_date, available_stock, unit_price, mrp, is_prescription_required, reorder_level) VALUES
('Paracetamol 500mg', 'Paracetamol', '500mg', 'Tablet', 'GSK', 'Analgesic', 'BATCH001', '2025-12-31', 150, 22.00, 25.00, false, 50),
('Amoxicillin 250mg', 'Amoxicillin', '250mg', 'Capsule', 'GSK', 'Antibiotic', 'BATCH002', '2025-06-30', 75, 75.00, 85.00, true, 30),
('Omeprazole 20mg', 'Omeprazole', '20mg', 'Capsule', 'Dr Reddy', 'PPI', 'BATCH003', '2025-09-15', 0, 38.00, 45.00, true, 25),
('Pantoprazole 40mg', 'Pantoprazole', '40mg', 'Tablet', 'Sun Pharma', 'PPI', 'BATCH004', '2025-11-20', 120, 42.00, 48.00, true, 25),
('Cetirizine 10mg', 'Cetirizine', '10mg', 'Tablet', 'UCB', 'Antihistamine', 'BATCH005', '2025-11-20', 200, 24.00, 28.00, false, 40),
('Vitamin D3 60K', 'Cholecalciferol', '60000 IU', 'Capsule', 'Sun Pharma', 'Vitamin', 'BATCH006', '2025-08-15', 0, 45.00, 52.00, false, 20),
('Vitamin D3 1000 IU', 'Cholecalciferol', '1000 IU', 'Tablet', 'Cipla', 'Vitamin', 'BATCH007', '2025-10-30', 85, 35.00, 40.00, false, 30),
('Cough Syrup', 'Dextromethorphan', '100ml', 'Syrup', 'Cipla', 'Cough & Cold', 'BATCH008', '2025-06-30', 3, 85.00, 95.00, false, 15),
('Insulin Injection 100IU', 'Human Insulin', '100IU/ml', 'Injection', 'Novo Nordisk', 'Diabetes', 'BATCH009', '2025-04-30', 0, 450.00, 520.00, true, 10),
('Metformin 500mg', 'Metformin', '500mg', 'Tablet', 'Sun Pharma', 'Diabetes', 'BATCH010', '2025-12-31', 180, 40.00, 45.00, true, 50);

-- Insert sample AI forecasts
INSERT INTO pharmacy_ai_forecasts (medicine_id, medicine_name, current_stock, predicted_demand, forecast_period_days, recommended_order_quantity, risk_level, confidence_percentage, factors_considered, forecast_date) VALUES
(1, 'Paracetamol 500mg', 45, 180, 30, 200, 'critical', 92.5, '{"seasonal_factor": 1.2, "trend": "increasing", "recent_sales": 150}', CURRENT_DATE),
(2, 'Amoxicillin 250mg', 120, 150, 30, 100, 'high', 87.3, '{"seasonal_factor": 1.0, "trend": "stable", "recent_sales": 120}', CURRENT_DATE),
(5, 'Cetirizine 10mg', 200, 80, 30, 0, 'low', 78.9, '{"seasonal_factor": 0.8, "trend": "decreasing", "recent_sales": 60}', CURRENT_DATE),
(8, 'Cough Syrup', 85, 120, 30, 60, 'medium', 84.2, '{"seasonal_factor": 1.1, "trend": "increasing", "recent_sales": 95}', CURRENT_DATE);

-- Create indexes for better performance
CREATE INDEX idx_pharmacy_medicines_name ON pharmacy_medicines(name);
CREATE INDEX idx_pharmacy_medicines_generic ON pharmacy_medicines(generic_name);
CREATE INDEX idx_pharmacy_medicines_category ON pharmacy_medicines(category);
CREATE INDEX idx_pharmacy_medicines_expiry ON pharmacy_medicines(expiry_date);
CREATE INDEX idx_pharmacy_medicines_stock ON pharmacy_medicines(available_stock);

CREATE INDEX idx_pharmacy_dispensing_patient ON pharmacy_dispensing(patient_id);
CREATE INDEX idx_pharmacy_dispensing_prescription ON pharmacy_dispensing(prescription_id);
CREATE INDEX idx_pharmacy_dispensing_status ON pharmacy_dispensing(status);
CREATE INDEX idx_pharmacy_dispensing_date ON pharmacy_dispensing(created_at);

CREATE INDEX idx_pharmacy_billing_receipt ON pharmacy_billing(receipt_number);
CREATE INDEX idx_pharmacy_billing_patient ON pharmacy_billing(patient_id);
CREATE INDEX idx_pharmacy_billing_phone ON pharmacy_billing(customer_phone);
CREATE INDEX idx_pharmacy_billing_date ON pharmacy_billing(created_at);

CREATE INDEX idx_pharmacy_medication_tracking_patient ON pharmacy_medication_tracking(patient_id);
CREATE INDEX idx_pharmacy_medication_tracking_end_date ON pharmacy_medication_tracking(end_date);

CREATE INDEX idx_pharmacy_follow_up_status ON pharmacy_follow_up_tasks(status);
CREATE INDEX idx_pharmacy_follow_up_due_date ON pharmacy_follow_up_tasks(due_date);

CREATE INDEX idx_pharmacy_whatsapp_logs_phone ON pharmacy_whatsapp_logs(patient_phone);
CREATE INDEX idx_pharmacy_whatsapp_logs_type ON pharmacy_whatsapp_logs(message_type);
CREATE INDEX idx_pharmacy_whatsapp_logs_date ON pharmacy_whatsapp_logs(sent_at);

-- Create triggers for automatic updates
CREATE OR REPLACE FUNCTION update_pharmacy_medicine_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Update stock when dispensing items
        IF TG_TABLE_NAME = 'pharmacy_dispensing_items' THEN
            UPDATE pharmacy_medicines 
            SET available_stock = available_stock - NEW.quantity_dispensed,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.medicine_id;
        END IF;
        
        -- Update stock when billing items (for direct sales)
        IF TG_TABLE_NAME = 'pharmacy_billing_items' THEN
            UPDATE pharmacy_medicines 
            SET available_stock = available_stock - NEW.quantity,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = NEW.medicine_id;
        END IF;
        
        RETURN NEW;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER trigger_update_stock_dispensing
    AFTER INSERT ON pharmacy_dispensing_items
    FOR EACH ROW EXECUTE FUNCTION update_pharmacy_medicine_stock();

CREATE TRIGGER trigger_update_stock_billing
    AFTER INSERT ON pharmacy_billing_items
    FOR EACH ROW EXECUTE FUNCTION update_pharmacy_medicine_stock();

-- Function to generate receipt numbers
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TEXT AS $$
DECLARE
    receipt_num TEXT;
BEGIN
    receipt_num := 'RCP' || EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::BIGINT;
    RETURN receipt_num;
END;
$$ LANGUAGE plpgsql;

-- Function to check low stock and create alerts
CREATE OR REPLACE FUNCTION check_low_stock_alerts()
RETURNS TABLE(medicine_name TEXT, current_stock INTEGER, reorder_level INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT pm.name, pm.available_stock, pm.reorder_level
    FROM pharmacy_medicines pm
    WHERE pm.available_stock <= pm.reorder_level
    AND pm.available_stock > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to check expiring medicines
CREATE OR REPLACE FUNCTION check_expiring_medicines(days_ahead INTEGER DEFAULT 30)
RETURNS TABLE(medicine_name TEXT, batch_number TEXT, expiry_date DATE, days_to_expiry INTEGER, stock INTEGER) AS $$
BEGIN
    RETURN QUERY
    SELECT pm.name, pm.batch_number, pm.expiry_date, 
           (pm.expiry_date - CURRENT_DATE)::INTEGER as days_to_expiry,
           pm.available_stock
    FROM pharmacy_medicines pm
    WHERE pm.expiry_date <= CURRENT_DATE + INTERVAL '1 day' * days_ahead
    AND pm.available_stock > 0
    ORDER BY pm.expiry_date ASC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE pharmacy_medicines IS 'Master table for all pharmacy medicines with stock management';
COMMENT ON TABLE pharmacy_dispensing IS 'Prescription-based medicine dispensing records';
COMMENT ON TABLE pharmacy_billing IS 'Unified billing for both prescription and direct sales';
COMMENT ON TABLE pharmacy_discount_rules IS 'Configurable discount rules for automatic application';
COMMENT ON TABLE pharmacy_medication_tracking IS 'Track patient medications for WhatsApp reminders';
COMMENT ON TABLE pharmacy_follow_up_tasks IS 'Follow-up tasks for telecallers and pharmacists';
COMMENT ON TABLE pharmacy_ai_forecasts IS 'AI-driven stock demand forecasting';
COMMENT ON TABLE pharmacy_whatsapp_logs IS 'WhatsApp message delivery logs';
COMMENT ON TABLE pharmacy_bounce_analysis IS 'Track and analyze prescription bounces';
