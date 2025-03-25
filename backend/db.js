const { Client } = require('pg');

// Configura tu conexión
const client = new Client({
  host: 'localhost',  
  port: 5432,        
  user: 'postgres',  
  password: 'Guajara',  
  database: 'gatohaus',  
});

// Conectar a la base de datos
client.connect()
  .then(() => console.log("Conectado a la base de datos"))
  .catch(err => console.error("Error de conexión: ", err.stack));

module.exports = client;
