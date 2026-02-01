import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { initializeDatabase } from "./Database/InitializeConnection";
import { AppDataSource } from "./Database/DbConnectionPool";
import { ProcessedBatch } from "./Domain/models/ProcessedBatch";
import { ProcessingService } from "./Services/ProcessingService";
import { AuditingService } from "./Services/AuditingService";
import { ProductionClient } from "./Services/ProductionClient";
import { ProcessingController } from "./WebAPI/controllers/ProcessingController";
import { IAuditingService } from "./Domain/services/IAuditingService";
import { IProductionClient } from "./Domain/services/IProductionClient";
import { IProcessingService } from "./Domain/services/IProcessingService";

dotenv.config({ quiet: true });

const app = express();
app.use(cors());
app.use(express.json());

export async function setupApp() {
  await initializeDatabase();

  const repo = AppDataSource.getRepository(ProcessedBatch);

  const audit : IAuditingService= new AuditingService();
  const prodClient : IProductionClient = new ProductionClient();
  const service : IProcessingService= new ProcessingService(repo, audit, prodClient);

  const controller = new ProcessingController(service);
  app.use("/api/v1/processing", controller.getRouter());

  console.log("\x1b[32m[ProcessingService]\x1b[0m App ready");
  return app;
}

export default app;
