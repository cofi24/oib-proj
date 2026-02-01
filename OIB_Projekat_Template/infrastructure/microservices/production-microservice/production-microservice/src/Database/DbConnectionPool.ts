import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Plant } from "../Domain/models/Plant";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // ⚠️ za lokalni razvoj
  synchronize: true,
  logging: false,

  // bitno
  entities: [Plant],

  // ako koristiš MySQL 8 / lokalno
  ssl: process.env.DB_SSL_MODE === "REQUIRED"
    ? { rejectUnauthorized: false }
    : undefined,
});
