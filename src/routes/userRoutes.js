const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:UserID', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:UserID', userController.updateUser);
router.delete('/:UserID', userController.deleteUser);

module.exports = router;


