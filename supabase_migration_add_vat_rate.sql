-- Add vat_rate column to invoice_items table
-- Run this in Supabase SQL Editor

ALTER TABLE invoice_items 
ADD COLUMN IF NOT EXISTS vat_rate NUMERIC(5,2) DEFAULT 0;

-- Add a comment to document the column
COMMENT ON COLUMN invoice_items.vat_rate IS 'VAT rate percentage for this invoice item (e.g., 5.00 for 5%)';





