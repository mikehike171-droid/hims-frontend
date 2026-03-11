-- Complete Pharmacy Module Database Schema

-- Medicine Master Table
CREATE TABLE medicines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_name VARCHAR(255),
    manufacturer VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL, -- tablet, capsule, syrup, injection, etc.
    strength VARCHAR(50) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- mg, ml, gm, etc.
    mrp DECIMAL(10,2) NOT NULL,
    purchase_rate DECIMAL(10,2) NOT NULL,
    selling_rate DECIMAL(10,2) NOT NULL,
    tax_percentage DECIMAL(5,2) DEFAULT 12.00,
    is_prescription_required BOOLEAN DEFAULT true,
    minimum_stock_level INTEGER DEFAULT 10,
    maximum_stock_level INTEGER DEFAULT 1000,
    rack_location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medicine Inventory with Batch Tracking
CREATE TABLE medicine_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID REFERENCES medicines(id),
    batch_number VARCHAR(100) NOT NULL,
    manufacturing_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    quantity_received INTEGER NOT NULL,
    quantity_available INTEGER NOT NULL,
    quantity_sold INTEGER DEFAULT 0,
    quantity_expired INTEGER DEFAULT 0,
    quantity_returned INTEGER DEFAULT 0,
    purchase_rate DECIMAL(10,2) NOT NULL,
    selling_rate DECIMAL(10,2) NOT NULL,
    supplier_name VARCHAR(255),
    supplier_invoice VARCHAR(100),
    received_date DATE DEFAULT CURRENT_DATE,
    location VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active', -- active, expired, recalled, damaged
    alert_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(medicine_id, batch_number)
);

-- Sales Transactions (Both Prescription and Direct Sales)
CREATE TABLE pharmacy_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_type VARCHAR(20) NOT NULL, -- prescription, direct_sale
    prescription_id UUID, -- NULL for direct sales
    patient_id UUID, -- NULL for non-patient sales
    patient_name VARCHAR(255),
    patient_phone VARCHAR(20),
    customer_name VARCHAR(255), -- For non-patient sales
    customer_phone VARCHAR(20), -- For non-patient sales
    pharmacist_id UUID,
    pharmacist_name VARCHAR(255),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    discount_reason VARCHAR(255),
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50), -- cash, card, upi, insurance
    payment_status VARCHAR(20) DEFAULT 'completed',
    is_partial_dispensing BOOLEAN DEFAULT false,
    notes TEXT,
    receipt_number VARCHAR(100) UNIQUE,
    whatsapp_sent BOOLEAN DEFAULT false,
    print_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sale Items Details
CREATE TABLE pharmacy_sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id UUID REFERENCES pharmacy_sales(id),
    medicine_id UUID REFERENCES medicines(id),
    inventory_id UUID REFERENCES medicine_inventory(id),
    medicine_name VARCHAR(255) NOT NULL,
    batch_number VARCHAR(100),
    expiry_date DATE,
    quantity_prescribed INTEGER, -- NULL for direct sales
    quantity_sold INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    is_substitute BOOLEAN DEFAULT false,
    substitute_reason TEXT,
    dosage_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Medication Tracking for Reminders
CREATE TABLE patient_medication_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    medicine_id UUID REFERENCES medicines(id),
    medicine_name VARCHAR(255) NOT NULL,
    sale_id UUID REFERENCES pharmacy_sales(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INTEGER NOT NULL,
    daily_dosage INTEGER NOT NULL,
    total_quantity INTEGER NOT NULL,
    remaining_days INTEGER,
    completion_reminder_sent BOOLEAN DEFAULT false,
    completion_reminder_date DATE,
    follow_up_required BOOLEAN DEFAULT true,
    follow_up_completed BOOLEAN DEFAULT false,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Alerts and Notifications
CREATE TABLE stock_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID REFERENCES medicines(id),
    inventory_id UUID REFERENCES medicine_inventory(id),
    alert_type VARCHAR(50) NOT NULL, -- low_stock, expiry_soon, expired, out_of_stock
    alert_message TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    current_stock INTEGER,
    minimum_stock INTEGER,
    expiry_date DATE,
    days_to_expiry INTEGER,
    is_acknowledged BOOLEAN DEFAULT false,
    acknowledged_by UUID,
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Notifications Log
CREATE TABLE whatsapp_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_type VARCHAR(50) NOT NULL, -- receipt, medication_reminder, availability_alert, follow_up, promotion
    patient_id UUID,
    patient_phone VARCHAR(20) NOT NULL,
    patient_name VARCHAR(255),
    message_content TEXT NOT NULL,
    template_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending', -- pending, sent, delivered, failed, read
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    error_message TEXT,
    reference_id UUID, -- sale_id, tracking_id, etc.
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Demand Forecasting
CREATE TABLE demand_forecasting (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_id UUID REFERENCES medicines(id),
    medicine_name VARCHAR(255) NOT NULL,
    forecast_date DATE NOT NULL,
    forecast_period VARCHAR(20) NOT NULL, -- weekly, monthly, quarterly
    current_stock INTEGER NOT NULL,
    predicted_demand INTEGER NOT NULL,
    confidence_score DECIMAL(5,2) NOT NULL, -- 0-100
    seasonal_factor DECIMAL(5,2) DEFAULT 1.0,
    trend_factor DECIMAL(5,2) DEFAULT 1.0,
    historical_avg DECIMAL(8,2),
    recommended_order_quantity INTEGER,
    risk_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    actual_demand INTEGER,
    accuracy_score DECIMAL(5,2),
    model_version VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescription Bounce Tracking
CREATE TABLE prescription_bounces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prescription_id UUID NOT NULL,
    patient_id UUID NOT NULL,
    patient_name VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255),
    bounce_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    bounce_reason VARCHAR(100) NOT NULL, -- out_of_stock, price_issue, patient_no_show, insurance_issue
    bounce_details TEXT,
    medicines_unavailable JSONB, -- Array of medicine details
    estimated_loss DECIMAL(10,2),
    follow_up_required BOOLEAN DEFAULT true,
    follow_up_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pharmacy Staff Notifications
CREATE TABLE staff_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_type VARCHAR(50) NOT NULL, -- follow_up, promotion, reorder, alert
    staff_id UUID,
    staff_name VARCHAR(255),
    priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high, urgent
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_required VARCHAR(100),
    reference_id UUID,
    reference_type VARCHAR(50), -- patient, medicine, sale, etc.
    is_read BOOLEAN DEFAULT false,
    is_completed BOOLEAN DEFAULT false,
    due_date DATE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers Management
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    gst_number VARCHAR(20),
    drug_license VARCHAR(100),
    payment_terms INTEGER DEFAULT 30, -- days
    credit_limit DECIMAL(12,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(100) UNIQUE NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    order_date DATE DEFAULT CURRENT_DATE,
    expected_delivery_date DATE,
    total_amount DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'draft', -- draft, sent, approved, received, cancelled
    created_by UUID,
    approved_by UUID,
    received_by UUID,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Order Items
CREATE TABLE purchase_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID REFERENCES purchase_orders(id),
    medicine_id UUID REFERENCES medicines(id),
    quantity_ordered INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    quantity_received INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_medicine_inventory_medicine_id ON medicine_inventory(medicine_id);
CREATE INDEX idx_medicine_inventory_expiry_date ON medicine_inventory(expiry_date);
CREATE INDEX idx_medicine_inventory_batch ON medicine_inventory(batch_number);
CREATE INDEX idx_pharmacy_sales_patient_id ON pharmacy_sales(patient_id);
CREATE INDEX idx_pharmacy_sales_date ON pharmacy_sales(sale_date);
CREATE INDEX idx_pharmacy_sales_type ON pharmacy_sales(sale_type);
CREATE INDEX idx_patient_medication_tracking_patient ON patient_medication_tracking(patient_id);
CREATE INDEX idx_patient_medication_tracking_end_date ON patient_medication_tracking(end_date);
CREATE INDEX idx_whatsapp_notifications_phone ON whatsapp_notifications(patient_phone);
CREATE INDEX idx_whatsapp_notifications_status ON whatsapp_notifications(status);
CREATE INDEX idx_stock_alerts_type ON stock_alerts(alert_type);
CREATE INDEX idx_demand_forecasting_medicine ON demand_forecasting(medicine_id);
CREATE INDEX idx_prescription_bounces_date ON prescription_bounces(bounce_date);

-- Insert sample medicines
INSERT INTO medicines (name, generic_name, brand_name, manufacturer, category, dosage_form, strength, unit, mrp, purchase_rate, selling_rate, is_prescription_required, minimum_stock_level) VALUES
('Paracetamol 500mg', 'Paracetamol', 'Crocin', 'GSK', 'Analgesic', 'Tablet', '500', 'mg', 25.00, 18.00, 22.00, false, 100),
('Amoxicillin 250mg', 'Amoxicillin', 'Amoxil', 'GSK', 'Antibiotic', 'Capsule', '250', 'mg', 85.00, 65.00, 75.00, true, 50),
('Omeprazole 20mg', 'Omeprazole', 'Omez', 'Dr Reddy', 'PPI', 'Capsule', '20', 'mg', 45.00, 32.00, 38.00, true, 30),
('Metformin 500mg', 'Metformin', 'Glycomet', 'USV', 'Antidiabetic', 'Tablet', '500', 'mg', 35.00, 25.00, 30.00, true, 80),
('Amlodipine 5mg', 'Amlodipine', 'Amlong', 'Micro Labs', 'Antihypertensive', 'Tablet', '5', 'mg', 42.00, 30.00, 36.00, true, 60),
('Cetirizine 10mg', 'Cetirizine', 'Zyrtec', 'UCB', 'Antihistamine', 'Tablet', '10', 'mg', 28.00, 20.00, 24.00, false, 40),
('Azithromycin 500mg', 'Azithromycin', 'Azithral', 'Alembic', 'Antibiotic', 'Tablet', '500', 'mg', 120.00, 90.00, 105.00, true, 25),
('Pantoprazole 40mg', 'Pantoprazole', 'Pantop', 'Aristo', 'PPI', 'Tablet', '40', 'mg', 55.00, 40.00, 48.00, true, 35),
('Losartan 50mg', 'Losartan', 'Losar', 'Cipla', 'Antihypertensive', 'Tablet', '50', 'mg', 65.00, 48.00, 56.00, true, 45),
('Atorvastatin 20mg', 'Atorvastatin', 'Atorva', 'Zydus', 'Statin', 'Tablet', '20', 'mg', 95.00, 70.00, 82.00, true, 30);

-- Insert sample inventory with different batches and expiry dates
INSERT INTO medicine_inventory (medicine_id, batch_number, manufacturing_date, expiry_date, quantity_received, quantity_available, purchase_rate, selling_rate, supplier_name) 
SELECT 
    id,
    'BATCH' || LPAD((ROW_NUMBER() OVER())::text, 4, '0'),
    CURRENT_DATE - INTERVAL '6 months',
    CASE 
        WHEN ROW_NUMBER() OVER() % 4 = 1 THEN CURRENT_DATE + INTERVAL '3 months'  -- Some expiring soon
        WHEN ROW_NUMBER() OVER() % 4 = 2 THEN CURRENT_DATE + INTERVAL '1 year'
        WHEN ROW_NUMBER() OVER() % 4 = 3 THEN CURRENT_DATE + INTERVAL '2 years'
        ELSE CURRENT_DATE + INTERVAL '18 months'
    END,
    CASE 
        WHEN minimum_stock_level < 50 THEN 500
        ELSE 1000
    END,
    CASE 
        WHEN ROW_NUMBER() OVER() % 5 = 1 THEN 5  -- Some low stock items
        WHEN ROW_NUMBER() OVER() % 5 = 2 THEN minimum_stock_level - 5  -- Below minimum
        ELSE FLOOR(RANDOM() * 300 + minimum_stock_level)::integer
    END,
    purchase_rate,
    selling_rate,
    'Sample Supplier ' || (ROW_NUMBER() OVER() % 3 + 1)
FROM medicines;

-- Insert sample demand forecasting data
INSERT INTO demand_forecasting (medicine_id, medicine_name, forecast_date, forecast_period, current_stock, predicted_demand, confidence_score, seasonal_factor, trend_factor, recommended_order_quantity, risk_level)
SELECT 
    m.id,
    m.name,
    CURRENT_DATE,
    'monthly',
    COALESCE(inv.quantity_available, 0),
    FLOOR(RANDOM() * 200 + 50)::integer,
    FLOOR(RANDOM() * 30 + 70)::integer, -- 70-100% confidence
    ROUND((RANDOM() * 0.4 + 0.8)::numeric, 2), -- 0.8-1.2 seasonal factor
    ROUND((RANDOM() * 0.3 + 0.9)::numeric, 2), -- 0.9-1.2 trend factor
    CASE 
        WHEN COALESCE(inv.quantity_available, 0) < m.minimum_stock_level THEN m.minimum_stock_level * 2
        ELSE FLOOR(RANDOM() * 100 + 50)::integer
    END,
    CASE 
        WHEN COALESCE(inv.quantity_available, 0) < m.minimum_stock_level THEN 'high'
        WHEN COALESCE(inv.quantity_available, 0) < m.minimum_stock_level * 1.5 THEN 'medium'
        ELSE 'low'
    END
FROM medicines m
LEFT JOIN medicine_inventory inv ON m.id = inv.medicine_id;

-- Create triggers for automatic stock alerts
CREATE OR REPLACE FUNCTION check_stock_alerts()
RETURNS TRIGGER AS $$
BEGIN
    -- Check for low stock
    IF NEW.quantity_available <= (SELECT minimum_stock_level FROM medicines WHERE id = NEW.medicine_id) THEN
        INSERT INTO stock_alerts (medicine_id, inventory_id, alert_type, alert_message, severity, current_stock, minimum_stock)
        VALUES (
            NEW.medicine_id,
            NEW.id,
            'low_stock',
            'Stock level is below minimum threshold',
            CASE 
                WHEN NEW.quantity_available = 0 THEN 'critical'
                WHEN NEW.quantity_available <= (SELECT minimum_stock_level FROM medicines WHERE id = NEW.medicine_id) * 0.5 THEN 'high'
                ELSE 'medium'
            END,
            NEW.quantity_available,
            (SELECT minimum_stock_level FROM medicines WHERE id = NEW.medicine_id)
        )
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- Check for expiry alerts
    IF NEW.expiry_date <= CURRENT_DATE + INTERVAL '30 days' AND NEW.quantity_available > 0 THEN
        INSERT INTO stock_alerts (medicine_id, inventory_id, alert_type, alert_message, severity, expiry_date, days_to_expiry)
        VALUES (
            NEW.medicine_id,
            NEW.id,
            CASE 
                WHEN NEW.expiry_date <= CURRENT_DATE THEN 'expired'
                WHEN NEW.expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'expiry_soon'
                ELSE 'expiry_soon'
            END,
            CASE 
                WHEN NEW.expiry_date <= CURRENT_DATE THEN 'Medicine has expired'
                ELSE 'Medicine expiring in ' || (NEW.expiry_date - CURRENT_DATE) || ' days'
            END,
            CASE 
                WHEN NEW.expiry_date <= CURRENT_DATE THEN 'critical'
                WHEN NEW.expiry_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'high'
                ELSE 'medium'
            END,
            NEW.expiry_date,
            NEW.expiry_date - CURRENT_DATE
        )
        ON CONFLICT DO NOTHING;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_stock_alerts
    AFTER INSERT OR UPDATE ON medicine_inventory
    FOR EACH ROW
    EXECUTE FUNCTION check_stock_alerts();

-- Function to update medication tracking
CREATE OR REPLACE FUNCTION update_medication_tracking()
RETURNS TRIGGER AS $$
BEGIN
    -- Update remaining days for all active medication tracking
    UPDATE patient_medication_tracking 
    SET 
        remaining_days = end_date - CURRENT_DATE,
        updated_at = CURRENT_TIMESTAMP
    WHERE end_date >= CURRENT_DATE;
    
    -- Mark for completion reminders (3 days before end)
    UPDATE patient_medication_tracking 
    SET completion_reminder_sent = false
    WHERE end_date - CURRENT_DATE <= 3 
    AND end_date - CURRENT_DATE > 0
    AND completion_reminder_sent = false;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create a daily job trigger (in real implementation, use cron job)
-- This is just for demonstration
CREATE OR REPLACE FUNCTION daily_medication_check()
RETURNS void AS $$
BEGIN
    PERFORM update_medication_tracking();
END;
$$ LANGUAGE plpgsql;
