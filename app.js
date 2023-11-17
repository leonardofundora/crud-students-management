const createError = require("http-errors");
const express = require("express");
const path = require("node:path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("express-handlebars");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.engine(
    "hbs",
    hbs.engine({
        extname: ".hbs",
        defaultLayout: "layout",
        layoutsDir: __dirname + "/views/layouts/",
        partialsDir: __dirname + "/views/partials/",
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

//Router
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

module.exports = app;
