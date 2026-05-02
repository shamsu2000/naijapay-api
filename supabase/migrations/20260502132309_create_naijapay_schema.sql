/*
  # Create NaijaPay Database Schema

  1. New Tables
    - `transactions`
      - `id` (uuid, primary key) - Unique transaction identifier
      - `sender_id` (text) - Account ID of the sender
      - `receiver_id` (text) - Account ID of the receiver
      - `amount` (numeric) - Transaction amount in Naira
      - `channel` (text) - Channel used (Web App, Mobile, API)
      - `is_fraud_flagged` (boolean) - Whether AI flagged this as fraud
      - `gateway_success` (boolean) - Whether the payment gateway processed successfully
      - `error_message` (text, nullable) - Error message if transaction failed
      - `gateway_receipt` (text, nullable) - Gateway receipt reference
      - `created_at` (timestamptz) - When the transaction was created

    - `contact_leads`
      - `id` (uuid, primary key) - Unique lead identifier
      - `name` (text) - Contact name
      - `email` (text) - Contact email
      - `company` (text, nullable) - Company name
      - `message` (text) - Inquiry message
      - `created_at` (timestamptz) - When the lead was submitted

  2. Security
    - Enable RLS on both tables
    - Allow public INSERT on contact_leads (for the contact form)
    - Allow authenticated read on transactions
    - No public read access on either table by default
*/

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id text NOT NULL,
  receiver_id text NOT NULL,
  amount numeric NOT NULL,
  channel text NOT NULL DEFAULT 'Web App',
  is_fraud_flagged boolean NOT NULL DEFAULT false,
  gateway_success boolean NOT NULL DEFAULT false,
  error_message text,
  gateway_receipt text,
  created_at timestamptz DEFAULT now()
);

-- Contact leads table
CREATE TABLE IF NOT EXISTS contact_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_leads ENABLE ROW LEVEL SECURITY;

-- Transactions policies: only authenticated users can read
CREATE POLICY "Authenticated users can read transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

-- Contact leads: allow public insert (for contact form), no public read
CREATE POLICY "Public can submit contact leads"
  ON contact_leads FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_transactions_sender ON transactions(sender_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_fraud ON transactions(is_fraud_flagged);
