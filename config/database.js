const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME || "postgres",
    process.env.DB_USER || "postgres",
    process.env.DB_PASSWORD || "postgres",
    {
        host: process.env.DB_HOST || "localhost",
        dialect: process.env.DB_DIALECT || "postgres",
    },
);

module.export(sequelize);