import express from "express";
import cors from "cors";
import "reflect-metadata";
import dotenv from "dotenv";
import { ProductRepository } from "./Services/repositories/ProductRepository";
import { SalesService } from "./Services/SalesService";
import { SalesController } from "./WebAPI/controllers/SalesController";
import { initialize_database } from "./Database/InitializeConnection";
import { StorageClient } from "./Services/clients/StorageClient";
import { AnalyticsClient } from "./Services/clients/AnalyticsClient";

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
const productRepo = new ProductRepository();
const storageBaseUrl = process.env.STORAGE_BASE_URL ?? "http://localhost:5555";
const analyticsBaseUrl = process.env.ANALYTICS_BASE_URL ?? "http://localhost:5557";

const storageClient = new StorageClient(storageBaseUrl);
const analyticsClient = new AnalyticsClient(analyticsBaseUrl);

const salesService = new SalesService(productRepo, storageClient, analyticsClient);

// CONTROLLERS
const salesController = new SalesController(salesService);

// ROUTES
app.use("/api/v1/sales", salesController.getRouter());

// HEALTH CHECK
app.get("/api/v1/health", (_, res) => {
  res.status(200).json({ status: "ok", service: "sales-service" });
});

export default app;
