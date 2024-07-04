const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { loginPage, authenticateUser, registerUser } = require('../controllers/authController');

// Configuración de Multer para subir archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Ruta de inicio de sesión
router.get('/login', loginPage);

// Ruta de registro de usuario
router.post('/register', upload.single('ProfilePicture'), registerUser);

// Ruta de autenticación
router.post('/auth', authenticateUser);

// Ruta PUT para actualizar la imagen de perfil
router.put('/profile/:userId', upload.single('ProfilePicture'), async (req, res) => {
    try {
      const { userId } = req.params;
      const { Name, Surname, Email, Password, Birthday, Countries_CountryID } = req.body;
      
      // Opcional: Validar la información del usuario en el body
      // ... (validaciones)
      
      let updateData = {};
      if (req.file) {
        updateData.ProfilePicture = req.file.filename;
        
        // Opcional: Eliminar la imagen anterior (si existe)
        const previousImage = await getUserById(userId); // Obtener información del usuario
        if (previousImage.ProfilePicture) {
          const filePath = path.join(__dirname, '../../uploads', previousImage.ProfilePicture);
          fs.unlinkSync(filePath); // Eliminar archivo existente
        }
      }
      
      if (Name) updateData.Name = Name;
      if (Surname) updateData.Surname = Surname;
      if (Email) updateData.Email = Email; // Ten cuidado al permitir cambios de email
      if (Password) updateData.Password = await bcrypt.hash(Password, 10); // Encriptar nueva contraseña
      if (Birthday) updateData.Birthday = Birthday;
      if (Countries_CountryID) updateData.Countries_CountryID = Countries_CountryID;
      
      const sql = 'UPDATE Users SET ? WHERE UserID = ?';
      const updated = await db.query(sql, [updateData, userId]);
      
      if (updated.affectedRows === 0) {
        return res.status(400).json({ error: 'Usuario no encontrado' });
      }
      
      res.json({ message: 'Perfil actualizado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });

module.exports = router;
