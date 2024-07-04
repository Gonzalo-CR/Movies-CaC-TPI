const db = require('../db/db.js');

const getAllMovies = (req, res) => {
    const sql = 'SELECT * FROM Movies';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching movies:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
};

const getMovieById = (req, res) => {
    const { MovieID } = req.params;
    const sql = 'SELECT * FROM Movies WHERE MovieID = ?';
    db.query(sql, [MovieID], (err, result) => {
        if (err) {
            console.error('Error fetching movie by ID:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.length === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json(result[0]);
    });
};

const createMovie = (req, res) => {
    const { Title, Director, Year, CoverImage, Countries_CountryID, Genres_GenreID } = req.body;
    console.log('Request body:', req.body);
    if (!Title || !Director || !Year || !CoverImage || !Countries_CountryID || !Genres_GenreID) {
        console.error('Validation error: missing fields');
        return res.status(400).json({ error: 'All fields are required' });
    }
    const sql = 'INSERT INTO Movies (Title, Director, Year, CoverImage, Countries_CountryID, Genres_GenreID) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [Title, Director, Year, CoverImage, Countries_CountryID, Genres_GenreID], (err, result) => {
        if (err) {
            console.error('Error creating movie:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(201).json({ message: 'Movie created', movieId: result.insertId });
    });
};

const updateMovie = (req, res) => {
    const { MovieID } = req.params;
    const { Title, Director, Year, CoverImage, Countries_CountryID, Genres_GenreID } = req.body;
    console.log('Request body:', req.body);
    if (!Title || !Director || !Year || !CoverImage || !Countries_CountryID || !Genres_GenreID) {
        console.error('Validation error: missing fields');
        return res.status(400).json({ error: 'All fields are required' });
    }
    const sql = 'UPDATE Movies SET Title = ?, Director = ?, Year = ?, CoverImage = ?, Countries_CountryID = ?, Genres_GenreID = ? WHERE MovieID = ?';
    db.query(sql, [Title, Director, Year, CoverImage, Countries_CountryID, Genres_GenreID, MovieID], (err, result) => {
        if (err) {
            console.error('Error updating movie:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ message: 'Movie updated' });
    });
};

const deleteMovie = (req, res) => {
    const { MovieID } = req.params;
    const sql = 'DELETE FROM Movies WHERE MovieID = ?';
    db.query(sql, [MovieID], (err, result) => {
        if (err) {
            console.error('Error deleting movie:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Movie not found' });
        }
        res.json({ message: 'Movie deleted' });
    });
};

module.exports = {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie
};
