// models/index.js
const { Sequelize } = require("sequelize");
const config = require("./sequelize");

const environment = process.env.NODE_ENV || "development"; // Configuración predeterminada para desarrollo
const sequelize = new Sequelize(config[environment]);

module.exports = sequelize;
