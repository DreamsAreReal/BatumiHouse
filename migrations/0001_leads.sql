CREATE TABLE IF NOT EXISTS leads (
 id TEXT PRIMARY KEY,
 received_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 status TEXT NOT NULL DEFAULT 'new',
 source TEXT NOT NULL,
 property TEXT NOT NULL,
 rental TEXT NOT NULL,
 checkin TEXT NOT NULL,
 checkout TEXT NOT NULL,
 guests INTEGER NOT NULL,
 contact_type TEXT NOT NULL,
 contact TEXT NOT NULL,
 budget TEXT NOT NULL,
 duration TEXT NOT NULL,
 wishes TEXT NOT NULL,
 early_checkin INTEGER NOT NULL,
 late_checkout INTEGER NOT NULL,
 fingerprint TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS leads_received ON leads(received_at);
