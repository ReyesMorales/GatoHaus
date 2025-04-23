require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Requerido por Render
  },
});

client.connect(); // no olvides esta línea si aún no la tienes

module.exports = client;
