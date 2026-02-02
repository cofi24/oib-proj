import express from "express";
import cors from "cors";

import { ProductionService } from "./Services/ProductionService";
import { AuditingService } from "./Services/AuditingService";
import { ProductionController } from "./WebAPI/controllers/ProductionController";
import { IAuditingService } from "./Domain/services/IAuditingService";
import { IProductionService } from "./Domain/services/IProductionService";

const app = express();

app.use(cors());
app.use(express.json());

// Services
const auditService : IAuditingService = new AuditingService();
const productionService : IProductionService = new ProductionService(auditService);

// Controller
const productionController = new ProductionController(productionService);

// Routes
app.use("/api/v1/production", productionController.getRouter());

export default app;
