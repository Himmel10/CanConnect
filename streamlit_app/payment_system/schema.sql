-- CanConnect Payment System Database Schema

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'cash',
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_request FOREIGN KEY (request_id) 
        REFERENCES service_requests(id) ON DELETE CASCADE
);

-- Create payment history table (audit log)
CREATE TABLE IF NOT EXISTS payment_history (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL,
    old_status VARCHAR(30),
    new_status VARCHAR(30),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(100) DEFAULT 'System',
    remarks TEXT,
    CONSTRAINT fk_payment FOREIGN KEY (payment_id) 
        REFERENCES payments(id) ON DELETE CASCADE
);

-- Create receipts table
CREATE TABLE IF NOT EXISTS receipts (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    payment_id INTEGER NOT NULL,
    receipt_path VARCHAR(255),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_receipt FOREIGN KEY (payment_id) 
        REFERENCES payments(id) ON DELETE CASCADE
);

-- Create payment statistics view
CREATE OR REPLACE VIEW payment_statistics AS
SELECT 
    DATE(paid_at) as payment_date,
    COUNT(*) as total_payments,
    SUM(amount) as total_amount,
    COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed,
    COUNT(CASE WHEN status = 'Failed' THEN 1 END) as failed,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending,
    ROUND(COUNT(CASE WHEN status = 'Completed' THEN 1 END)::numeric / 
          COUNT(*)::numeric * 100, 2) as success_rate
FROM payments
WHERE paid_at IS NOT NULL
GROUP BY DATE(paid_at)
ORDER BY payment_date DESC;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_request_id ON payments(request_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at);
CREATE INDEX IF NOT EXISTS idx_payment_history_payment_id ON payment_history(payment_id);
