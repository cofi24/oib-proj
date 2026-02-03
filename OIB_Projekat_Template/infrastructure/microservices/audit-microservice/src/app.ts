import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initialize_database } from "./Database/InitializeConnection";
import { Db } from "./Database/DbConnectionPool";
import { AuditLog } from "./Domain/models/AuditLog";
import { AuditLogService } from "./Services/AuditLogService";
import { AuditLogController } from "./WebAPI/controllers/AuditLogController";
import { IAuditLogService } from "./Domain/services/IAuditLogService";

dotenv.config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["GET"];
app.use(cors({ origin: corsOrigin, methods: corsMethods }));
app.use(express.json());

export async function setupApp() {
    
        if (!Db.isInitialized) {
            await initialize_database();
        }

        const repo = Db.getRepository(AuditLog);

        const service : IAuditLogService = new AuditLogService(repo);
        const controller = new AuditLogController(service);

        app.use("/api/v1", controller.getRouter());

        console.log("\x1b[32m[AuditService]\x1b[0m App setup complete");

        return app;
     
    
}

export default app;
