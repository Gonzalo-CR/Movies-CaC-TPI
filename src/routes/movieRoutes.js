const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.getAllMovies);
router.get('/:MovieID', movieController.getMovieById); // Cambio de :id a :MovieID
router.post('/', movieController.createMovie);
router.put('/:MovieID', movieController.updateMovie); // Cambio de :id a :MovieID
router.delete('/:MovieID', movieController.deleteMovie); // Cambio de :id a :MovieID

module.exports = router;