-- CanConnect Complete Database Schema
-- Includes: Users, Sessions, Services, Applications, Documents, Attachments

-- ============================================================================
-- USER MANAGEMENT TABLES
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    barangay VARCHAR(100),
    municipality VARCHAR(100) DEFAULT 'Cantilan',
    province VARCHAR(100) DEFAULT 'Surigao del Sur',
    user_type VARCHAR(20) NOT NULL DEFAULT 'citizen', -- citizen, staff, admin
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    phone_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    deleted_at TIMESTAMP
);

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_session FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- User preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    notification_email BOOLEAN DEFAULT TRUE,
    notification_sms BOOLEAN DEFAULT FALSE,
    notification_in_app BOOLEAN DEFAULT TRUE,
    email_digest_frequency VARCHAR(20) DEFAULT 'daily', -- daily, weekly, monthly, never
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'Asia/Manila',
    theme VARCHAR(20) DEFAULT 'light', -- light, dark
    show_profile_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_pref FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Staff departments table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    head_staff_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Staff roles table
CREATE TABLE IF NOT EXISTS staff_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    department_id INTEGER,
    role VARCHAR(50) NOT NULL, -- staff, supervisor, treasurer, admin
    permissions TEXT, -- JSON array of permissions
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_staff_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_staff_dept FOREIGN KEY (department_id) 
        REFERENCES departments(id)
);

-- ============================================================================
-- SERVICE MANAGEMENT TABLES
-- ============================================================================

-- Service categories table
CREATE TABLE IF NOT EXISTS service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    fee DECIMAL(10,2) NOT NULL DEFAULT 0,
    processing_days INTEGER DEFAULT 3,
    required_documents TEXT, -- JSON array of document types
    form_fields TEXT, -- JSON object of form fields
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_service_category FOREIGN KEY (category_id) 
        REFERENCES service_categories(id)
);

-- ============================================================================
-- APPLICATION & DOCUMENT TABLES
-- ============================================================================

-- Service requests/applications table
CREATE TABLE IF NOT EXISTS service_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    reference_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending', -- pending, in-progress, for-payment, completed, rejected
    notes TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    completed_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    estimated_completion_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_request_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_request_service FOREIGN KEY (service_id) 
        REFERENCES services(id)
);

-- Document types table
CREATE TABLE IF NOT EXISTS document_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    accepted_formats VARCHAR(100), -- pdf,jpg,png
    max_file_size_mb INTEGER DEFAULT 10,
    required BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Application attachments/documents table
CREATE TABLE IF NOT EXISTS application_attachments (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    document_type_id INTEGER,
    user_id INTEGER NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(50), -- pdf, jpg, png, etc
    file_size_bytes INTEGER,
    storage_type VARCHAR(20) DEFAULT 'local', -- local, s3, azure
    s3_key VARCHAR(500), -- for AWS S3
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_date TIMESTAMP, -- for document retention
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by INTEGER,
    verified_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- active, archived, deleted
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attach_request FOREIGN KEY (request_id) 
        REFERENCES service_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_attach_doc_type FOREIGN KEY (document_type_id) 
        REFERENCES document_types(id),
    CONSTRAINT fk_attach_user FOREIGN KEY (user_id) 
        REFERENCES users(id),
    CONSTRAINT fk_attach_verified_by FOREIGN KEY (verified_by) 
        REFERENCES users(id)
);

-- Application form data table (stores form submission data)
CREATE TABLE IF NOT EXISTS application_form_data (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL UNIQUE,
    form_data TEXT NOT NULL, -- JSON object with all form fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_form_request FOREIGN KEY (request_id) 
        REFERENCES service_requests(id) ON DELETE CASCADE
);

-- ============================================================================
-- TRACKING & AUDIT TABLES
-- ============================================================================

-- Application status history table (audit trail)
CREATE TABLE IF NOT EXISTS application_status_history (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    changed_by INTEGER,
    remarks TEXT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_request FOREIGN KEY (request_id) 
        REFERENCES service_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (changed_by) 
        REFERENCES users(id)
);

-- Audit logs table (system-wide)
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    action VARCHAR(100) NOT NULL, -- created, updated, deleted, viewed
    entity_type VARCHAR(50), -- user, service_request, payment, document
    entity_id INTEGER,
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_user FOREIGN KEY (user_id) 
        REFERENCES users(id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON user_sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_requests_user_id ON service_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_requests_service_id ON service_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON service_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_reference ON service_requests(reference_number);
CREATE INDEX IF NOT EXISTS idx_requests_submitted ON service_requests(submitted_at);

CREATE INDEX IF NOT EXISTS idx_attachments_request_id ON application_attachments(request_id);
CREATE INDEX IF NOT EXISTS idx_attachments_user_id ON application_attachments(user_id);
CREATE INDEX IF NOT EXISTS idx_attachments_storage ON application_attachments(storage_type);
CREATE INDEX IF NOT EXISTS idx_attachments_expiry ON application_attachments(expiry_date);

CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs(created_at);

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- Active applications view
CREATE OR REPLACE VIEW active_applications AS
SELECT 
    sr.id,
    sr.reference_number,
    u.full_name,
    u.email,
    s.name as service_name,
    sr.status,
    sr.submitted_at,
    sr.estimated_completion_date,
    COUNT(aa.id) as document_count
FROM service_requests sr
JOIN users u ON sr.user_id = u.id
JOIN services s ON sr.service_id = s.id
LEFT JOIN application_attachments aa ON sr.id = aa.request_id AND aa.status = 'active'
WHERE sr.status != 'completed' AND sr.status != 'rejected'
GROUP BY sr.id, u.id, s.id;

-- User statistics view
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id,
    u.full_name,
    u.user_type,
    COUNT(DISTINCT sr.id) as total_applications,
    COUNT(DISTINCT CASE WHEN sr.status = 'completed' THEN sr.id END) as completed_apps,
    COUNT(DISTINCT CASE WHEN sr.status = 'pending' THEN sr.id END) as pending_apps,
    MAX(sr.submitted_at) as last_application_date
FROM users u
LEFT JOIN service_requests sr ON u.id = sr.user_id
GROUP BY u.id;

-- Document storage view
CREATE OR REPLACE VIEW document_storage AS
SELECT 
    storage_type,
    COUNT(*) as document_count,
    SUM(file_size_bytes) as total_size_bytes,
    ROUND(SUM(file_size_bytes)::numeric / (1024*1024*1024), 2) as total_size_gb
FROM application_attachments
WHERE status = 'active'
GROUP BY storage_type;
