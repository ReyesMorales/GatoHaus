// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets'))); 

// Simulamos una base de datos en memoria
let rooms = [
    { name: 'Habitación 1', available: true },
    { name: 'Habitación 2', available: false },
    { name: 'Habitación 3', available: true },
];

// Endpoint para obtener habitaciones
app.get('/api/rooms', (req, res) => {
    res.json(rooms);
});

// Endpoint para reservar una habitación
app.put('/api/rooms/:name/reserve', (req, res) => {
    const roomName = req.params.name;
    const room = rooms.find(r => r.name === roomName);
    
    if (room && room.available) {
        room.available = false;  // Marcar como reservada
        res.json(room);
    } else {
        res.status(400).json({ message: 'Room is already reserved or does not exist' });
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
