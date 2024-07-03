const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
    const accessToken = req.headers['authorization'] || req.query.accessToken;
    if (!accessToken) {
        return res.status(403).send('Acceso denegado');
    }

    jwt.verify(accessToken, process.env.SECRET || 'your_secret_key', (error, user) => {
        if (error) {
            return res.status(403).send('Acceso denegado, token expiró o es incorrecto');
        }
        req.user = user;
        next();
    });
}

function loginPage(req, res) {
    res.sendFile(path.join(__dirname, '../../iniciosesion.html'));
}

module.exports = {
    validateToken,
    loginPage
};
