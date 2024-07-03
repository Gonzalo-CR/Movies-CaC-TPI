const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validateToken, loginPage } = require('../controllers/authController');
const { getUserByEmail, createUser } = require('../controllers/userController');

// Ruta de inicio de sesión
router.get('/login', loginPage);

// Ruta de registro de usuario
router.post('/register', async (req, res) => {
    try {
        const { Name, Surname, Email, Password, Birthday, Countries_CountryID } = req.body;

        if (!Name || !Surname || !Email || !Password || !Birthday || !Countries_CountryID) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        const existingUser = await getUserByEmail(Email);
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = await createUser(Name, Surname, Email, hashedPassword, Birthday, Countries_CountryID);

        console.log('Usuario creado exitosamente!!');
        res.json({ message: 'Usuario creado exitosamente!!', userId: newUser.UserID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta de autenticación
router.post('/auth', async (req, res) => {
    try {
        const { Email, Password } = req.body;

        if (!Email || !Password) {
            return res.status(400).json({ error: 'Se requieren correo electrónico y contraseña' });
        }

        const user = await getUserByEmail(Email);

        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const validPassword = await bcrypt.compare(Password, user.Password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = generateToken(user.UserID);
        console.log('Inicio de sesión exitoso!!');
        res.json({ token, redirectUrl: '/' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Ruta protegida con API
router.get('/api', validateToken, async (req, res) => {
    try {
        const user = req.user;
        const userData = await getUserById(user.UserID);
        res.json({ email: user.Email, userData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

function generateToken(userId) {
    const secretKey = process.env.SECRET || 'your_secret_key';
    const payload = { userId };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    return token;
}

module.exports = router;
