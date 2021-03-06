CREATE TABLE item (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  link TEXT,
  modified TIMESTAMPTZ NOT NULL DEFAULT now(),
  description TEXT,
  price decimal(12,2) NOT NULL,
  email TEXT,
  category_id INTEGER REFERENCES category(id) ON DELETE CASCADE NOT NULL
)