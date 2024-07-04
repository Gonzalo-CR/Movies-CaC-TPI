// src/db/initDb.js
const fs = require('fs');
const path = require('path');
const connection = require('./db');

// Función para leer datos desde un archivo JSON e insertar en la tabla especificada
function insertDataFromFile(tableName, filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file from disk: ${err}`);
        } else {
            const records = JSON.parse(data);
            const fields = Object.keys(records[0]).join(', ');
            const values = records.map(record => `(${Object.values(record).map(value => connection.escape(value)).join(', ')})`).join(', ');

            const sql = `INSERT IGNORE INTO ${tableName} (${fields}) VALUES ${values}`;
            connection.query(sql, (err, results) => {
                if (err) {
                    console.error(`Error inserting data into ${tableName}: ${err}`);
                } else {
                    console.log(`Inserted ${results.affectedRows} rows into ${tableName}`);
                }
            });
        }
    });
}

// Rutas a los archivos JSON (ajustadas según la estructura de tu proyecto)
const jsonFilesPath = path.join(__dirname, './data');
const countriesFilePath = path.join(jsonFilesPath, 'countries.json');
const genresFilePath = path.join(jsonFilesPath, 'genres.json');
const moviesFilePath = path.join(jsonFilesPath, 'movies.json');
const usersFilePath = path.join(jsonFilesPath, 'users.json');
const watchesFilePath = path.join(jsonFilesPath, 'watches.json');
const ratingsFilePath = path.join(jsonFilesPath, 'ratings.json');

// Crear las tablas y cargar los datos
connection.query(fs.readFileSync(path.join(__dirname, 'movies.sql'), 'utf8'), (err) => {
    if (err) {
        console.error('Error creating tables:', err);
    } else {
        console.log('Tables created successfully');
        insertDataFromFile('Countries', countriesFilePath);
        insertDataFromFile('Genres', genresFilePath);
        insertDataFromFile('Movies', moviesFilePath);
        insertDataFromFile('Users', usersFilePath);
        insertDataFromFile('User_Movie_Watches', watchesFilePath);
        insertDataFromFile('User_Movie_Ratings', ratingsFilePath);
    }
});
