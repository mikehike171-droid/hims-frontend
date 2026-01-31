CREATE TABLE patient_medical_history (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    medical_history_id INTEGER NOT NULL,
    medical_history_option_id INTEGER NOT NULL,
    category_title VARCHAR(255) NOT NULL,
    option_title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patient_id ON patient_medical_history (patient_id);
CREATE INDEX idx_medical_history_id ON patient_medical_history (medical_history_id);