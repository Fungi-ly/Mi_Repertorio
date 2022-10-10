const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    password: "Nick1212",
    database: "repertorio",
    port: 5432,
    max: 20,
    min: 2,
    idleTimeoutMillis: 5000,
    connectionTimeoutMillis: 2000
});

const insertar = async ({ cancion, artista, tono }) => {
    try {
        const texto = 'INSERT INTO repertorio (cancion, artista, tono) VALUES ($1, $2, $3) RETURNING *';
        const consulta = {
            text: texto,
            values: [cancion, artista, tono],
        }
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        throw error;
    }
}

const consultar = async () => {
    try {
        const texto = 'SELECT id, cancion, artista, tono FROM repertorio ORDER BY id ASC';
        const consulta = {
            text: texto,
            rowMode: 'rows'
        }
        const result = await pool.query(consulta);
        return result.rows;
    } catch (error) {
        throw error;
    }
}

const editar = async (datos) => {
    try {
        const texto = 'UPDATE repertorio SET cancion = $2, artista = $3, tono = $4 WHERE id = $1 RETURNING *';
        const consulta = {
            text: texto,
            values: datos
        };
        const result = await pool.query(consulta);
        return result;
    } catch (error) {
        throw error;
    }
};

const eliminar = async (datos) => {
    try {
        const texto = 'DELETE FROM repertorio WHERE id = $1 RETURNING *';
        const consulta = {
            text: texto,
            values: datos
        };
        const client = await pool.connect();
        const result = await client.query(consulta)
        client.release();
        return result;
    } catch (error) {
        throw error;
    }
}
module.exports = { insertar, consultar, editar, eliminar };