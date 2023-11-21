const createError = require("http-errors");
const express = require("express");
const path = require("node:path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("express-handlebars");
const session = require("express-session");

const passport = require("passport");

const app = express();

app.engine(
    "hbs",
    hbs.engine({
        extname: ".hbs",
        defaultLayout: "layout",
        layoutsDir: __dirname + "/views/layouts/",
        partialsDir: __dirname + "/views/partials/",
        helpers: {
            eq: function (v1, v2) {
                return v1 === v2;
            },
        },
    }),
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// Middleware for fromat to JSON
app.use(express.json());

app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//server static content
app.use(express.static(path.join(__dirname, "public")));

//load bootstrap content
app.use(
    "/css",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")),
);
app.use(
    "/js",
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
);

app.use(
    session({
        secret: process.env.JWT_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
    }),
);

const passportConfig = require("./config/passport");

// Configurar el middleware de passport
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

// Importamos la configuración de passport que definimos en la carpeta config
require("./config/passport");

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// Usamos las rutas de autenticación con el prefijo /auth
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

//Router
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;
