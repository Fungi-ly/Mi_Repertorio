-- Abrir terminal (1  postgres)
psql -U postgres
CREATE DATABASE repertorio;
\c repertorio
-- \l visualiza bases de datos


CREATE TABLE repertorio (
    id SERIAL PRIMARY KEY, 
    cancion VARCHAR(50), 
    artista VARCHAR(50), 
    tono VARCHAR(10)
);

-- Abrir terminal(2 bash)
