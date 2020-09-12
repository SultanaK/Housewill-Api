CREATE TABLE housewill_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMPTZ NOT NULL DEFAULT now(),
  date_modified TIMESTAMPTZ
);

ALTER TABLE item
  ADD COLUMN
    user_id INTEGER REFERENCES housewill_users(id)
    ON DELETE SET NULL;