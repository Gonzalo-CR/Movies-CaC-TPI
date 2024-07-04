const express = require('express');
const fs = require('fs');
const path = require('path');
const movieRoutes = require('./src/routes/movieRoutes');
const userRoutes = require('./src/routes/userRoutes');
const authRoutes = require('./src/routes/authRoutes');
const dotenv = require('dotenv').config();
const db = require('./src/db/db');

const app = express();

// Verificar si el directorio uploads existe, si no, crearlo
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

app.use(express.urlencoded({extended:true})) 
app.use(express.json()); // Middleware para parsear JSON
app.use(express.static('public')); // Servir archivos estáticos
app.use('/uploads', express.static('uploads')); // Servir archivos subidos

// Rutas
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);
app.use('/', authRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});


//manejo de errores de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Manejo de errores globales 500 y stack para depuración
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`El servidor está encendido en http://localhost:${PORT}/`);

    // Inicializar la base de datos solo si es necesario
    const shouldInitDB = true; // Cambia esta bandera según sea necesario
    if (shouldInitDB) {
        require('./src/db/initDB.js');  // Solo importa y ejecuta initDb.js si es necesario
    }
});

 