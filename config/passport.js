// Importamos las dependencias que vamos a usar
const passport = require('passport');
const passportLocal = require('passport-local');
const passportJwt = require('passport-jwt');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

// Creamos una instancia de prisma
const prisma = new PrismaClient();

// Configuramos la estrategia de autenticación local de passport
// Esta estrategia recibe un email y una contraseña y verifica si el usuario existe y si la contraseña es correcta
passport.use(new passportLocal.Strategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Buscamos al usuario por su email usando el cliente de prisma
    const user = await prisma.user.findUnique({ where: { email } });
    // Si no existe el usuario, devolvemos un error
    if (!user) {
      return done(null, false, { message: 'El usuario no existe' });
    }
    // Si existe el usuario, comparamos la contraseña que nos han enviado con la que tenemos almacenada en la base de datos
    // Para ello, usamos la función bcrypt.compare, que desencripta la contraseña y la compara
    const isMatch = await bcrypt.compare(password, user.password);
    // Si la contraseña no coincide, devolvemos un error
    if (!isMatch) {
      return done(null, false, { message: 'La contraseña es incorrecta' });
    }
    // Si la contraseña coincide, devolvemos el usuario
    return done(null, user);
  } catch (error) {
    // Si ocurre algún error, lo devolvemos
    return done(error);
  }
}));

// Configuramos la estrategia de autenticación basada en JWT de passport
// Esta estrategia recibe un token en la cabecera de la petición y verifica si el token es válido y si el usuario existe
passport.use(new passportJwt.Strategy({
  // Indicamos el nombre de la cabecera donde se va a enviar el token
  // Por convención, se usa la cabecera Authorization con el formato Bearer <token>
  jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // Indicamos el secreto que se va a usar para verificar el token
  // Este secreto debe ser el mismo que se usó para generar el token
  // Por seguridad, se recomienda guardar este secreto en una variable de entorno
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    // El payload es el objeto que contiene la información del token, como el id del usuario, la fecha de expiración, etc.
    // Buscamos al usuario por su id usando el cliente de prisma
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    // Si no existe el usuario, devolvemos un error
    if (!user) {
      return done(null, false, { message: 'El usuario no existe' });
    }
    // Si existe el usuario, lo devolvemos
    return done(null, user);
  } catch (error) {
    // Si ocurre algún error, lo devolvemos
    return done(error);
  }
}));

// Exportamos el módulo de passport
module.exports = passport;
