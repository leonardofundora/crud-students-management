const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = function (passport) {
    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
            },
            async (email, password, done) => {
                // Buscar el usuario en la base de datos
                const user = await prisma.user.findUnique({
                    where: { email },
                });
                // Si el usuario no existe, devolver un mensaje de error
                if (!user) {
                    return done(null, false, { message: "Incorrect email" });
                }
                // Si el usuario existe, comparar la contraseña con la que tenemos en la base de datos
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) throw err;
                    // Si la contraseña coincide, devolver el usuario
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        // Si la contraseña no coincide, devolver un mensaje de error
                        return done(null, false, {
                            message: "Incorrect password",
                        });
                    }
                });
            },
        ),
    );

    // Serializar el usuario
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // Deserializar el usuario
    passport.deserializeUser(async (id, done) => {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        done(null, user);
    });
};
