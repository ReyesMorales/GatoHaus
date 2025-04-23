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

  // Crear una nueva reserva
app.post('/api/rooms/:room_number/reserve', async (req, res) => {
  const roomId = req.params.room_number;
  const { fecha_inicio, fecha_fin, cliente } = req.body;

  if (!fecha_inicio || !fecha_fin || !cliente) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    // Verificar si la habitación está ocupada en esas fechas
    const conflicto = await client.query(`
      SELECT 1 FROM reservas
      WHERE room_id = $1
      AND (
        (fecha_inicio <= $2 AND fecha_fin >= $2)
        OR
        (fecha_inicio <= $3 AND fecha_fin >= $3)
        OR
        (fecha_inicio >= $2 AND fecha_fin <= $3)
      )
    `, [roomId, fecha_inicio, fecha_fin]);

    if (conflicto.rowCount > 0) {
      return res.status(400).json({ message: 'La habitación ya está reservada en esas fechas.' });
    }

    // Insertar la reserva
    const resultado = await client.query(`
      INSERT INTO reservas (room_id, fecha_inicio, fecha_fin, cliente)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [roomId, fecha_inicio, fecha_fin, cliente]);

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al crear la reserva:', error);
    res.status(500).json({ message: 'Error interno al crear la reserva' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

  

