import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { initialize_database } from "./Database/InitializeConnection";
import { StorageService } from "./Services/StorageService";
import { LogerService } from "./Services/LogerService";
import { StorageController } from "./WebAPI/controllers/StorageController";
import { PackagingRepository } from "./Services/repositories/PackagingRepository";




dotenv.config({ quiet: true });

const app = express();

// MIDDLEWARE
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

// DATABASE INITIALIZATION
initialize_database();

// DEPENDENCY INJECTION
const packagingRepo = new PackagingRepository();
const storageService = new StorageService(packagingRepo);
const logerService = new LogerService();

// CONTROLLERS
const storageController = new StorageController(storageService, logerService);

// ROUTES
app.use("/api/v1/storage", storageController.getRouter());


export default app;
