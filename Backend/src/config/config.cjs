
require("dotenv").config();

const sslOptions = {
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
};

const local = {
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "skillsyncaiv2",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  dialect: "mysql",
};

const production = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 4000,
  dialect: "mysql",
  dialectOptions: sslOptions,
  logging: false,
};

module.exports = {
  development: local,
  test: local,
  production,
};
