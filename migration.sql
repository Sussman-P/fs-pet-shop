DROP TABLE IF EXISTS pet;
CREATE TABLE pet (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    kind TEXT NOT NULL
);

INSERT INTO pet (name, age, kind) VALUES ('bob', 2, 'snake');