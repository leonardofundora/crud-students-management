// Middleware para proteger las rutas que necesiten autenticación
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/auth/login");
};

module.exports = {
    ensureAuthenticated,
};
