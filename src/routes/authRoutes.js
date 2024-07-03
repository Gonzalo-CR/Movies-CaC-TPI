const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { validateToken, loginPage } = require('../controllers/authController');
const { getUserByEmail, createUser } = require('../controllers/userController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Ruta de inicio de sesión
router.get('/login', loginPage);

// Ruta de registro de usuario
router.post('/register', upload.single('ProfilePicture'), async (req, res) => {
    try {
        // Obtener datos de registro del cuerpo de la solicitud
        const { Name, Surname, Email, Password, Birthday, Countries_CountryID } = req.body;
        const ProfilePicture = req.file ? req.file.filename : null;

        // Validar datos de registro
        if (!Name || !Surname || !Email || !Password || !Birthday || !ProfilePicture || !Countries_CountryID) {
            return res.status(400).json({ error: 'Todos los campos son requeridos' });
        }

        // Comprobar si el usuario ya existe
        const existingUser = await getUserByEmail(Email);
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }

        // Hash la contraseña
        const hashedPassword = await bcrypt.hash(Password, 10);

        // Crear nuevo usuario en la base de datos
        const newUser = await createUser(Name, Surname, Email, hashedPassword, Birthday, ProfilePicture, Countries_CountryID);

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
        // Obtener correo electrónico y contraseña del cuerpo de la solicitud
        const { Email, Password } = req.body;

        // Validar correo electrónico y contraseña
        if (!Email || !Password) {
            return res.status(400).json({ error: 'Se requieren correo electrónico y contraseña' });
        }

        // Consultar usuario en la base de datos por correo electrónico
        const user = await getUserByEmail(Email);

        // Si el usuario no existe, enviar error
        if (!user) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña proporcionada con la contraseña hash almacenada
        const validPassword = await bcrypt.compare(Password, user.Password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Generar y enviar token de autenticación
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

