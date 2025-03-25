// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const client = require('./db');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets'))); 

// Obtener todas las habitaciones con su tipo
app.get('/api/rooms', async (req, res) => {
    try {
      const result = await client.query(`
        SELECT r.id, r.room_number, rt.name AS tipo, rt.description AS tipo_descripcion
        FROM rooms r
        JOIN room_types rt ON r.type_id = rt.id
        ORDER BY r.room_number
      `);
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error al obtener habitaciones:', error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  });
  

// Iniciar servidor
app.listen(5000, () => {
    console.log('Servidor corriendo en http://localhost:5000');
  });
  

