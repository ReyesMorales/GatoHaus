// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Ruta básica
app.get('/api/rooms', (req, res) => {
    // Simulamos algunas habitaciones disponibles
    const rooms = [
        { id: 1, name: 'Suite para Gatos', available: true },
        { id: 2, name: 'Habitación estándar', available: false },
        { id: 3, name: 'Habitación Deluxe', available: true }
    ];
    res.json(rooms);
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
});
