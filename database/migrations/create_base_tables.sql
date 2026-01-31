-- Patients table
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    age INT,
    gender ENUM('male', 'female', 'other'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical History Categories table
CREATE TABLE medical_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical History Options table
CREATE TABLE medical_history_options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    medical_history_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (medical_history_id) REFERENCES medical_history(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO medical_history (id, title, description) VALUES
(1, 'Birth History', 'Birth related medical history'),
(2, 'Cardiovascular History', 'Heart and blood vessel related history'),
(3, 'Child Past History', 'Childhood medical history'),
(4, 'Hormonal Disorders', 'Endocrine system disorders'),
(5, 'Infections History', 'Previous infections and treatments');

INSERT INTO medical_history_options (id, medical_history_id, title) VALUES
(1, 1, 'PREMATURE BORN'),
(2, 1, 'AMNIOTIC FLUID ASPIRATION'),
(3, 1, 'BIRTH CRY DELAYED'),
(4, 1, 'BIRTH CRY NORMAL'),
(10, 2, 'HYPERTENSION'),
(11, 2, 'HEART ATTACK'),
(14, 3, 'CHILDHOOD ASTHMA'),
(17, 4, 'DIABETES TYPE 1'),
(20, 5, 'TUBERCULOSIS');

INSERT INTO patients (id, name, age, gender) VALUES
(1, 'John Doe', 35, 'male');