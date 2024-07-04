const express = require('express');
const movieRoutes = require('./src/routes/movieRoutes');
const userRoutes = require('./src/routes/userRoutes');
const dotenv = require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const db = require('./src/db/db');

const app = express();

app.use(express.urlencoded({extended:true})) 
app.use(express.json()); // Middleware para parsear JSON

// Rutas
app.use('/movies', movieRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'index.html');
});

app.use('/', authRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

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

 