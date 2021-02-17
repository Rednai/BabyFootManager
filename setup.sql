CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';

DROP DATABASE IF EXISTS babyfootmanagerdb;
CREATE DATABASE babyfootmanagerdb;
\connect babyfootmanagerdb;

GRANT ALL PRIVILEGES ON DATABASE babyfootmanagerdb TO postgres;

DROP TABLE IF EXISTS games;

CREATE TABLE games (
    game_id SERIAL PRIMARY KEY,
    game_name VARCHAR(300) NOT NULL,
    finish BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);