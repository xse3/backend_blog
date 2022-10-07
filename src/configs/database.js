import { Sequelize } from "sequelize";
import {} from "dotenv/config";

const { DB_HOST, DB_NAME, DB_PASS, DB_USER, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  dialect: "mysql",
  host: DB_HOST,
  port: DB_PORT,
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
