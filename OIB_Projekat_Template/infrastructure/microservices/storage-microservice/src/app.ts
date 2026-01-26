import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { initialize_database } from "./Database/InitializeConnection";
import { StorageService } from "./Services/StorageService";
import { LogerService } from "./Services/LogerService";
import { StorageController } from "./WebAPI/controllers/StorageController";


dotenv.config({ quiet: true });

const app = express();

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods =
  process.env.CORS_METHODS?.split(",").map((m) => m.trim()) ?? ["POST", "GET"];

app.use(
  cors({
    origin: corsOrigin,
    methods: corsMethods,
  })
);

app.use(express.json());

// Initialize DB connection (TypeORM)
initialize_database();

const storageService = new StorageService();
const logerService = new LogerService();

const storageController = new StorageController(storageService, logerService);

app.use("/api/v1/storage", storageController.getRouter());


export default app;
