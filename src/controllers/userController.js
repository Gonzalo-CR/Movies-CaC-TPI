const db = require('../db/db');
const fs = require('fs');
const path = require('path');

// Obtener todos los usuarios
const getAllUsers = (req, res) => {
    const sql = 'SELECT * FROM Users';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
};

// Obtener usuario por ID
const getUserById = (req, res) => {
    const { UserID } = req.params;
    const sql = 'SELECT * FROM Users WHERE UserID = ?';
    db.query(sql, [UserID], (err, result) => {
        if (err) throw err;
        res.json(result);
    });
};

// Obtener usuario por email
const getUserByEmail = (Email) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM Users WHERE Email = ?';
        db.query(sql, [Email], (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    });
};

// Crear nuevo usuario
const createUser = (Name, Surname, Email, Password, Birthday, ProfilePicture, Countries_CountryID) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO Users (Name, Surname, Email, Password, Birthday, ProfilePicture, Countries_CountryID) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [Name, Surname, Email, Password, Birthday, ProfilePicture, Countries_CountryID], (err, result) => {
            if (err) return reject(err);
            
            const newUser = {
                UserID: result.insertId,
                Name,
                Surname,
                Email,
                Password,
                Birthday,
                ProfilePicture,
                Countries_CountryID
            };
            const usersFilePath = path.join(__dirname, '../db/data/users.json');
            fs.readFile(usersFilePath, 'utf8', (err, data) => {
                if (err) return reject(err);
                const users = JSON.parse(data);
                users.push(newUser);
                fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
                    if (err) return reject(err);
                    resolve(newUser);
                });
            });
        });
    });
};

// Actualizar usuario
const updateUser = (req, res) => {
    const { UserID } = req.params;
    const { Name, Surname, Email, Password, Birthday, ProfilePicture, Countries_CountryID } = req.body;
    const sql = 'UPDATE Users SET Name = ?, Surname = ?, Email = ?, Password = ?, Birthday = ?, ProfilePicture = ?, Countries_CountryID = ? WHERE UserID = ?';
    db.query(sql, [Name, Surname, Email, Password, Birthday, ProfilePicture, Countries_CountryID, UserID], (err, result) => {
        if (err) throw err;
        res.json({ message: 'User updated' });
    });
};

// Eliminar usuario
const deleteUser = (req, res) => {
    const { UserID } = req.params;
    const sql = 'DELETE FROM Users WHERE UserID = ?';
    db.query(sql, [UserID], (err, result) => {
        if (err) throw err;
        res.json({ message: 'User deleted' });
    });
};

module.exports = {
    getAllUsers,
    getUserById,
    getUserByEmail,
    createUser,
    updateUser,
    deleteUser
};

