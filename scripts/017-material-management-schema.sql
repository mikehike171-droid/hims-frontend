-- Material Management Module Schema
-- Comprehensive inventory management for Pharmacy & Store

-- =============================================
-- 1. MASTERS & CATALOGS
-- =============================================

-- Item Categories
CREATE TABLE mm_item_categories (
    id SERIAL PRIMARY KEY,
    category_code VARCHAR(20) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    domain VARCHAR(20) NOT NULL CHECK (domain IN ('Pharmacy', 'Store', 'Both')),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO mm_item_categories (category_code, category_name, domain) VALUES
('PHARM', 'Pharmacy', 'Pharmacy'),
('SURG', 'Surgical', 'Store'),
('CONS', 'Consumables', 'Store'),
('HOUSE', 'Housekeeping', 'Store'),
('STAT', 'Stationery', 'Store'),
('BIOMED', 'Biomedical Spares', 'Store');

-- Item Master (Dual Domain Support)
CREATE TABLE mm_item_master (
    id SERIAL PRIMARY KEY,
    item_code VARCHAR(50) UNIQUE NOT NULL,
    item_name VARCHAR(200) NOT NULL,
    category_id INTEGER REFERENCES mm_item_categories(id),
    domain VARCHAR(20) NOT NULL CHECK (domain IN ('Pharmacy', 'Store')),
    
    -- Common Fields
    description TEXT,
    hsn_code VARCHAR(20),
    gst_rate DECIMAL(5,2) DEFAULT 0,
    rack_location VARCHAR(50),
    min_stock_level INTEGER DEFAULT 0,
    max_stock_level INTEGER DEFAULT 0,
    reorder_point INTEGER DEFAULT 0,
    lead_time_days INTEGER DEFAULT 0,
    criticality VARCHAR(20) DEFAULT 'Medium' CHECK (criticality IN ('Critical', 'High', 'Medium', 'Low')),
    
    -- Pharmacy Specific Fields
    salt_composition TEXT,
    dosage_form VARCHAR(50),
    strength VARCHAR(50),
    batch_mandatory BOOLEAN DEFAULT false,
    expiry_mandatory BOOLEAN DEFAULT false,
    schedule_type VARCHAR(10), -- H, H1, X, etc.
    is_narcotic BOOLEAN DEFAULT false,
    mrp DECIMAL(10,2),
    
    -- Store Specific Fields
    brand VARCHAR(100),
    model VARCHAR(100),
    lot_serial_support BOOLEAN DEFAULT false,
    shelf_life_months INTEGER,
    warranty_months INTEGER,
    amc_applicable BOOLEAN DEFAULT false,
    
    -- Status & Audit
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Units of Measure
CREATE TABLE mm_uom_master (
    id SERIAL PRIMARY KEY,
    uom_code VARCHAR(20) UNIQUE NOT NULL,
    uom_name VARCHAR(50) NOT NULL,
    uom_type VARCHAR(20) DEFAULT 'Standard' CHECK (uom_type IN ('Standard', 'Custom')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pack Size Conversions
CREATE TABLE mm_pack_conversions (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES mm_item_master(id),
    purchase_uom_id INTEGER REFERENCES mm_uom_master(id),
    issue_uom_id INTEGER REFERENCES mm_uom_master(id),
    conversion_factor DECIMAL(10,4) NOT NULL, -- 1 purchase unit = X issue units
    wastage_factor DECIMAL(5,2) DEFAULT 0, -- % wastage during conversion
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert standard UOMs
INSERT INTO mm_uom_master (uom_code, uom_name) VALUES
('EACH', 'Each'),
('BOX', 'Box'),
('STRIP', 'Strip'),
('BOTTLE', 'Bottle'),
('VIAL', 'Vial'),
('TUBE', 'Tube'),
('PACKET', 'Packet'),
('KG', 'Kilogram'),
('LITER', 'Liter'),
('METER', 'Meter');

-- Vendor Master
CREATE TABLE mm_vendor_master (
    id SERIAL PRIMARY KEY,
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    vendor_name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    pincode VARCHAR(10),
    gstin VARCHAR(20),
    pan VARCHAR(20),
    
    -- Payment Terms
    payment_terms VARCHAR(100),
    credit_days INTEGER DEFAULT 0,
    
    -- Performance Tracking
    performance_score DECIMAL(3,1) DEFAULT 0,
    total_orders INTEGER DEFAULT 0,
    on_time_deliveries INTEGER DEFAULT 0,
    quality_rating DECIMAL(3,1) DEFAULT 0,
    
    -- Status & Controls
    vendor_status VARCHAR(20) DEFAULT 'Active' CHECK (vendor_status IN ('Active', 'Hold', 'Blacklisted')),
    blacklist_reason TEXT,
    delivery_sla_days INTEGER DEFAULT 7,
    
    -- Documents
    dl_number VARCHAR(50), -- Drug License for pharmacy vendors
    dl_expiry DATE,
    gst_certificate_path VARCHAR(500),
    other_documents JSONB,
    
    -- Audit
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rate Contracts / Price Lists
CREATE TABLE mm_rate_contracts (
    id SERIAL PRIMARY KEY,
    contract_number VARCHAR(50) UNIQUE NOT NULL,
    contract_name VARCHAR(200) NOT NULL,
    vendor_id INTEGER REFERENCES mm_vendor_master(id),
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    contract_type VARCHAR(20) DEFAULT 'Annual' CHECK (contract_type IN ('Annual', 'Quarterly', 'Tender')),
    total_value DECIMAL(15,2),
    freight_terms VARCHAR(100),
    payment_terms VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rate Contract Items
CREATE TABLE mm_rate_contract_items (
    id SERIAL PRIMARY KEY,
    contract_id INTEGER REFERENCES mm_rate_contracts(id),
    item_id INTEGER REFERENCES mm_item_master(id),
    unit_price DECIMAL(10,2) NOT NULL,
    uom_id INTEGER REFERENCES mm_uom_master(id),
    
    -- Tier Discounts
    tier1_qty INTEGER DEFAULT 0,
    tier1_discount DECIMAL(5,2) DEFAULT 0,
    tier2_qty INTEGER DEFAULT 0,
    tier2_discount DECIMAL(5,2) DEFAULT 0,
    tier3_qty INTEGER DEFAULT 0,
    tier3_discount DECIMAL(5,2) DEFAULT 0,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 2. PROCUREMENT WORKFLOW
-- =============================================

-- Indents/Requisitions
CREATE TABLE mm_indents (
    id SERIAL PRIMARY KEY,
    indent_number VARCHAR(50) UNIQUE NOT NULL,
    indent_date DATE NOT NULL,
    department_id INTEGER,
    requested_by INTEGER,
    priority VARCHAR(20) DEFAULT 'Normal' CHECK (priority IN ('Urgent', 'High', 'Normal', 'Low')),
    justification TEXT,
    estimated_value DECIMAL(15,2),
    
    -- Approval Workflow
    approval_status VARCHAR(20) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
    approved_by INTEGER,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Status
    indent_status VARCHAR(20) DEFAULT 'Open' CHECK (indent_status IN ('Open', 'Partial', 'Closed', 'Cancelled')),
    
    -- Audit
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indent Items
CREATE TABLE mm_indent_items (
    id SERIAL PRIMARY KEY,
    indent_id INTEGER REFERENCES mm_indents(id),
    item_id INTEGER REFERENCES mm_item_master(id),
    requested_qty INTEGER NOT NULL,
    uom_id INTEGER REFERENCES mm_uom_master(id),
    estimated_rate DECIMAL(10,2),
    estimated_amount DECIMAL(15,2),
    justification TEXT,
    
    -- Fulfillment Tracking
    po_qty INTEGER DEFAULT 0,
    received_qty INTEGER DEFAULT 0,
    pending_qty INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Request for Quotation (RFQ)
CREATE TABLE mm_rfq (
    id SERIAL PRIMARY KEY,
    rfq_number VARCHAR(50) UNIQUE NOT NULL,
    rfq_date DATE NOT NULL,
    quote_due_date DATE NOT NULL,
    rfq_type VARCHAR(20) DEFAULT 'Standard' CHECK (rfq_type IN ('Standard', 'Tender', 'Emergency')),
    terms_conditions TEXT,
    
    -- Status
    rfq_status VARCHAR(20) DEFAULT 'Open' CHECK (rfq_status IN ('Open', 'Closed', 'Cancelled')),
    
    -- Audit
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RFQ Items (from Indents)
CREATE TABLE mm_rfq_items (
    id SERIAL PRIMARY KEY,
    rfq_id INTEGER REFERENCES mm_rfq(id),
    indent_item_id INTEGER REFERENCES mm_indent_items(id),
    item_id INTEGER REFERENCES mm_item_master(id),
    required_qty INTEGER NOT NULL,
    uom_id INTEGER REFERENCES mm_uom_master(id),
    specifications TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RFQ Vendors (Invited)
CREATE TABLE mm_rfq_vendors (
    id SERIAL PRIMARY KEY,
    rfq_id INTEGER REFERENCES mm_rfq(id),
    vendor_id INTEGER REFERENCES mm_vendor_master(id),
    invitation_sent_at TIMESTAMP,
    quote_received BOOLEAN DEFAULT false,
    quote_received_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vendor Quotes
CREATE TABLE mm_vendor_quotes (
    id SERIAL PRIMARY KEY,
    rfq_id INTEGER REFERENCES mm_rfq(id),
    vendor_id INTEGER REFERENCES mm_vendor_master(id),
    quote_number VARCHAR(50) NOT NULL,
    quote_date DATE NOT NULL,
    valid_till DATE NOT NULL,
    
    -- Commercial Terms
    freight_charges DECIMAL(10,2) DEFAULT 0,
    other_charges DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(15,2),
    
    -- Evaluation
    technical_score DECIMAL(5,2) DEFAULT 0,
    commercial_score DECIMAL(5,2) DEFAULT 0,
    overall_score DECIMAL(5,2) DEFAULT 0,
    l1_l2_status VARCHAR(10), -- L1, L2, L3, etc.
    
    -- Status
    quote_status VARCHAR(20) DEFAULT 'Received' CHECK (quote_status IN ('Received', 'Under Evaluation', 'Selected', 'Rejected')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quote Items
CREATE TABLE mm_quote_items (
    id SERIAL PRIMARY KEY,
    quote_id INTEGER REFERENCES mm_vendor_quotes(id),
    rfq_item_id INTEGER REFERENCES mm_rfq_items(id),
    item_id INTEGER REFERENCES mm_item_master(id),
    quoted_qty INTEGER NOT NULL,
    unit_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Discounts & Schemes
    line_discount_percent DECIMAL(5,2) DEFAULT 0,
    line_discount_amount DECIMAL(10,2) DEFAULT 0,
    
    delivery_days INTEGER,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchase Orders
CREATE TABLE mm_purchase_orders (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    po_date DATE NOT NULL,
    vendor_id INTEGER REFERENCES mm_vendor_master(id),
    quote_id INTEGER REFERENCES mm_vendor_quotes(id),
    
    -- Delivery Details
    delivery_date DATE,
    delivery_address TEXT,
    delivery_contact VARCHAR(100),
    
    -- Commercial Terms
    subtotal DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    freight_charges DECIMAL(10,2) DEFAULT 0,
    other_charges DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Payment Terms
    payment_terms VARCHAR(200),
    advance_percent DECIMAL(5,2) DEFAULT 0,
    advance_amount DECIMAL(10,2) DEFAULT 0,
    
    -- Approval
    approval_status VARCHAR(20) DEFAULT 'Pending' CHECK (approval_status IN ('Pending', 'Approved', 'Rejected')),
    approved_by INTEGER,
    approved_at TIMESTAMP,
    
    -- Status & Tracking
    po_status VARCHAR(20) DEFAULT 'Open' CHECK (po_status IN ('Open', 'Partial', 'Closed', 'Cancelled')),
    received_value DECIMAL(15,2) DEFAULT 0,
    pending_value DECIMAL(15,2) DEFAULT 0,
    
    -- Audit
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PO Items
CREATE TABLE mm_po_items (
    id SERIAL PRIMARY KEY,
    po_id INTEGER REFERENCES mm_purchase_orders(id),
    quote_item_id INTEGER REFERENCES mm_quote_items(id),
    item_id INTEGER REFERENCES mm_item_master(id),
    ordered_qty INTEGER NOT NULL,
    unit_rate DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(15,2) NOT NULL,
    
    -- Delivery Schedule
    delivery_date DATE,
    
    -- Fulfillment Tracking
    received_qty INTEGER DEFAULT 0,
    pending_qty INTEGER DEFAULT 0,
    
    -- Schemes Applied
    scheme_details JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 3. INBOUND OPERATIONS
-- =============================================

-- Advanced Shipping Notice (ASN)
CREATE TABLE mm_asn (
    id SERIAL PRIMARY KEY,
    asn_number VARCHAR(50) UNIQUE NOT NULL,
    po_id INTEGER REFERENCES mm_purchase_orders(id),
    vendor_id INTEGER REFERENCES mm_vendor_master(id),
    expected_delivery_date DATE,
    vehicle_number VARCHAR(20),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    total_packages INTEGER,
    asn_status VARCHAR(20) DEFAULT 'Sent' CHECK (asn_status IN ('Sent', 'Acknowledged', 'Received')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Goods Receipt Note (GRN)
CREATE TABLE mm_grn (
    id SERIAL PRIMARY KEY,
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    grn_date DATE NOT NULL,
    po_id INTEGER REFERENCES mm_purchase_orders(id),
    asn_id INTEGER REFERENCES mm_asn(id),
    vendor_id INTEGER REFERENCES mm_vendor_master(id),
    
    -- Receipt Details
    received_by INTEGER,
    vehicle_number VARCHAR(20),
    lr_number VARCHAR(50),
    packages_received INTEGER,
    
    -- Commercial
    invoice_number VARCHAR(50),
    invoice_date DATE,
    invoice_amount DECIMAL(15,2),
    
    -- Status
    grn_status VARCHAR(20) DEFAULT 'Draft' CHECK (grn_status IN ('Draft', 'QC Pending', 'Approved', 'Rejected')),
    qc_status VARCHAR(20) DEFAULT 'Pending' CHECK (qc_status IN ('Pending', 'Passed', 'Failed', 'Partial')),
    
    -- Audit
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- GRN Items
CREATE TABLE mm_grn_items (
    id SERIAL PRIMARY KEY,
    grn_id INTEGER REFERENCES mm_grn(id),
    po_item_id INTEGER REFERENCES mm_po_items(id),
    item_id INTEGER REFERENCES mm_item_master(id),
    
    -- Receipt Quantities
    ordered_qty INTEGER NOT NULL,
    received_qty INTEGER NOT NULL,
    accepted_qty INTEGER DEFAULT 0,
    rejected_qty INTEGER DEFAULT 0,
    free_qty INTEGER DEFAULT 0,
    
    -- Batch/Lot Details (for Pharmacy)
    batch_number VARCHAR(50),
    manufacturing_date DATE,
    expiry_date DATE,
    mrp DECIMAL(10,2),
    
    -- Serial/Lot Details (for Store)
    serial_numbers TEXT[], -- Array of serial numbers
    lot_number VARCHAR(50),
    warranty_start_date DATE,
    
    -- QC Details
    qc_status VARCHAR(20) DEFAULT 'Pending' CHECK (qc_status IN ('Pending', 'Passed', 'Failed')),
    qc_remarks TEXT,
    qc_by INTEGER,
    qc_date DATE,
    
    -- Pricing
    unit_rate DECIMAL(10,2),
    total_amount DECIMAL(15,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 4. SCHEMES & DISCOUNTS
-- =============================================

-- Scheme Master
CREATE TABLE mm_scheme_master (
    id SERIAL PRIMARY KEY,
    scheme_code VARCHAR(50) UNIQUE NOT NULL,
    scheme_name VARCHAR(200) NOT NULL,
    scheme_type VARCHAR(30) NOT NULL CHECK (scheme_type IN ('Free Qty', 'Backend Rebate', 'Cash Discount', 'Bundle', 'Target Based')),
    vendor_id INTEGER REFERENCES mm_vendor_master(id),
    
    -- Validity
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    
    -- Scheme Parameters (JSON for flexibility)
    scheme_parameters JSONB NOT NULL,
    -- Examples:
    -- Free Qty: {"buy_qty": 10, "free_qty": 1, "item_ids": [1,2,3]}
    -- Backend Rebate: {"rebate_percent": 5, "min_purchase": 100000}
    -- Cash Discount: {"discount_percent": 2, "payment_days": 10}
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scheme Accruals
CREATE TABLE mm_scheme_accruals (
    id SERIAL PRIMARY KEY,
    scheme_id INTEGER REFERENCES mm_scheme_master(id),
    po_id INTEGER REFERENCES mm_purchase_orders(id),
    grn_id INTEGER REFERENCES mm_grn(id),
    
    -- Accrual Details
    accrual_date DATE NOT NULL,
    base_amount DECIMAL(15,2) NOT NULL,
    accrued_amount DECIMAL(15,2) NOT NULL,
    accrual_status VARCHAR(20) DEFAULT 'Accrued' CHECK (accrual_status IN ('Accrued', 'Realized', 'Expired')),
    
    -- Realization
    credit_note_number VARCHAR(50),
    credit_note_date DATE,
    realized_amount DECIMAL(15,2) DEFAULT 0,
    realized_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 5. INVENTORY & STOCK MANAGEMENT
-- =============================================

-- Storage Locations
CREATE TABLE mm_storage_locations (
    id SERIAL PRIMARY KEY,
    location_code VARCHAR(50) UNIQUE NOT NULL,
    location_name VARCHAR(100) NOT NULL,
    location_type VARCHAR(20) NOT NULL CHECK (location_type IN ('Main Store', 'Sub Store', 'Pharmacy', 'Department')),
    parent_location_id INTEGER REFERENCES mm_storage_locations(id),
    department_id INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stock Ledger (Real-time Stock Tracking)
CREATE TABLE mm_stock_ledger (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES mm_item_master(id),
    location_id INTEGER REFERENCES mm_storage_locations(id),
    
    -- Batch/Lot Details
    batch_number VARCHAR(50),
    expiry_date DATE,
    serial_number VARCHAR(50),
    
    -- Transaction Details
    transaction_type VARCHAR(30) NOT NULL CHECK (transaction_type IN ('Receipt', 'Issue', 'Transfer', 'Adjustment', 'Return')),
    transaction_id INTEGER, -- Reference to GRN, Issue, Transfer, etc.
    transaction_date DATE NOT NULL,
    
    -- Quantities
    qty_in INTEGER DEFAULT 0,
    qty_out INTEGER DEFAULT 0,
    balance_qty INTEGER NOT NULL,
    
    -- Valuation
    unit_cost DECIMAL(10,2),
    total_value DECIMAL(15,2),
    
    -- Reference
    reference_number VARCHAR(50),
    remarks TEXT,
    
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Current Stock Summary (Materialized View equivalent)
CREATE TABLE mm_current_stock (
    id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES mm_item_master(id),
    location_id INTEGER REFERENCES mm_storage_locations(id),
    batch_number VARCHAR(50),
    expiry_date DATE,
    
    -- Stock Quantities
    available_qty INTEGER DEFAULT 0,
    reserved_qty INTEGER DEFAULT 0,
    free_qty INTEGER DEFAULT 0,
    
    -- Valuation
    avg_cost DECIMAL(10,2),
    total_value DECIMAL(15,2),
    
    -- Status
    stock_status VARCHAR(20) DEFAULT 'Available' CHECK (stock_status IN ('Available', 'Reserved', 'Blocked', 'Expired')),
    
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(item_id, location_id, batch_number)
);

-- Insert Sample Storage Locations
INSERT INTO mm_storage_locations (location_code, location_name, location_type) VALUES
('MAIN', 'Main Store', 'Main Store'),
('PHARM', 'Main Pharmacy', 'Pharmacy'),
('ICU', 'ICU Store', 'Sub Store'),
('OT1', 'OT-1 Store', 'Sub Store'),
('WARD1', 'Ward-1 Store', 'Sub Store');

-- =============================================
-- 6. ISSUES & CONSUMPTION
-- =============================================

-- Issue/Consumption Headers
CREATE TABLE mm_issues (
    id SERIAL PRIMARY KEY,
    issue_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    issue_type VARCHAR(20) NOT NULL CHECK (issue_type IN ('Department', 'Patient', 'OT', 'Emergency')),
    
    -- Issue To Details
    department_id INTEGER,
    patient_id INTEGER,
    encounter_id INTEGER,
    cost_center VARCHAR(50),
    
    -- Request Details
    requested_by INTEGER,
    approved_by INTEGER,
    issued_by INTEGER,
    
    -- Status
    issue_status VARCHAR(20) DEFAULT 'Pending' CHECK (issue_status IN ('Pending', 'Approved', 'Issued', 'Cancelled')),
    
    -- Totals
    total_items INTEGER DEFAULT 0,
    total_value DECIMAL(15,2) DEFAULT 0,
    
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Issue Items
CREATE TABLE mm_issue_items (
    id SERIAL PRIMARY KEY,
    issue_id INTEGER REFERENCES mm_issues(id),
    item_id INTEGER REFERENCES mm_item_master(id),
    location_id INTEGER REFERENCES mm_storage_locations(id),
    
    -- Batch/Serial Details
    batch_number VARCHAR(50),
    expiry_date DATE,
    serial_number VARCHAR(50),
    
    -- Quantities
    requested_qty INTEGER NOT NULL,
    issued_qty INTEGER DEFAULT 0,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(15,2),
    
    -- Patient Charging
    chargeable BOOLEAN DEFAULT false,
    charge_amount DECIMAL(10,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 7. APPROVAL WORKFLOWS
-- =============================================

-- Approval Matrix
CREATE TABLE mm_approval_matrix (
    id SERIAL PRIMARY KEY,
    document_type VARCHAR(30) NOT NULL CHECK (document_type IN ('Indent', 'PO', 'GRN', 'Issue')),
    item_category_id INTEGER REFERENCES mm_item_categories(id),
    department_id INTEGER,
    
    -- Approval Levels
    min_value DECIMAL(15,2) DEFAULT 0,
    max_value DECIMAL(15,2),
    approval_level INTEGER NOT NULL,
    approver_role VARCHAR(50),
    approver_user_id INTEGER,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 8. INDEXES FOR PERFORMANCE
-- =============================================

-- Item Master Indexes
CREATE INDEX idx_mm_item_master_code ON mm_item_master(item_code);
CREATE INDEX idx_mm_item_master_category ON mm_item_master(category_id);
CREATE INDEX idx_mm_item_master_domain ON mm_item_master(domain);
CREATE INDEX idx_mm_item_master_active ON mm_item_master(is_active);

-- Stock Ledger Indexes
CREATE INDEX idx_mm_stock_ledger_item_location ON mm_stock_ledger(item_id, location_id);
CREATE INDEX idx_mm_stock_ledger_date ON mm_stock_ledger(transaction_date);
CREATE INDEX idx_mm_stock_ledger_batch ON mm_stock_ledger(batch_number);

-- Current Stock Indexes
CREATE INDEX idx_mm_current_stock_item ON mm_current_stock(item_id);
CREATE INDEX idx_mm_current_stock_location ON mm_current_stock(location_id);
CREATE INDEX idx_mm_current_stock_expiry ON mm_current_stock(expiry_date);

-- PO Indexes
CREATE INDEX idx_mm_po_vendor ON mm_purchase_orders(vendor_id);
CREATE INDEX idx_mm_po_date ON mm_purchase_orders(po_date);
CREATE INDEX idx_mm_po_status ON mm_purchase_orders(po_status);

COMMIT;
