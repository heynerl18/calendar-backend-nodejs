
const path = require('path');
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
const { patch } = require('./routes/auth');
require('dotenv').config();

// * Crear el servidor de express
const app = express();

// * Base de datos
dbConnection();

// * CORS
app.use(cors());

// * Directorio publico
// * Middleware
app.use(express.static('public'));

// * Lecturas y parseo del body
app.use(express.json());


// * Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});


// * Escuchar peticiones
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});