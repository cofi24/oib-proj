import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AuditGatewayService } from "./Services/AuditServices/AuditGatewayService";
import { AuditController } from "./WebAPI/AuditControllers/AuditController";
import { ProductionGateWayController } from "./WebAPI/ProductionControlers/ProductionGateWayController";
import { ProductionGatewayService } from "./Services/ProductionServices/ProductionGatewayService";
import { ProcessingGatewayService } from "./Services/ProcessingServices/ProcessingGatewayService";
import { ProcessingGatewayController } from "./WebAPI/ProcessingControllers/ProcessingGatewayController";
import { StorageGatewayService } from "./Services/StorageServices/StorageGatewayService";
import { StorageGatewayController } from "./WebAPI/StorageControllers/StorageGatewayController";
import { SalesGatewayService } from "./Services/SalesServices/SalesGatewayService";
import { SalesGatewayController } from "./WebAPI/SalesControllers/SalesGatewayController";
import { AnalyticsGatewayService } from "./Services/AnalyticsServices/AnalyticsGatewayService";
import { AnalyticsGatewayController } from "./WebAPI/AnalyticsControllers/AnalyticsGatewayController";
import { PerformanceGatewayService } from "./Services/PerformanceServices/PerformanceGatewayService";
import { PerformanceGatewayController } from "./WebAPI/PerformanceControllers/PerformanceGatewayController";
import { AuthGatewayService } from "./Services/AuthServices/AuthGatewayService";
import { UserGatewayService } from "./Services/UserServices/UserGatewayService";
import { AuthGatewayController } from "./WebAPI/AuthControllers/AuthGatewayController";
import { UserGatewayController } from "./WebAPI/UserControllers/UserGatewayController";
import { IAuthGatewayService } from "./Domain/services/IAuthGatewayService";
import { IUserGatewayService } from "./Domain/services/IUserGatewayService";
import { IAuditGatewayService } from "./Domain/services/IAuditGatewayService";
import { IProductionGatewayService } from "./Domain/services/IProductionGatewayService";
import { IProcessingGatewayService } from "./Domain/services/IProcessingGatewayService";
import { IStorageGatewayService } from "./Domain/services/IStorageGatewayService";
import { ISalesGatewayService } from "./Domain/services/ISalesGatewayService";
import { IAnalyticsGatewayService } from "./Domain/services/IAnalyticsGatewayService";
import { IPerformanceGatewayService } from "./Domain/services/IPerformanceGatewayService";

dotenv.config({ quiet: true });

const requiredEnvVars = [
  "JWT_SECRET",
  "GATEWAY_SECRET",
  "AUTH_SERVICE_API",
  "USER_SERVICE_API",
  "CLIENT_REDIRECT_URL",
  "PERFORMANCE_SERVICE_API",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

const app = express();
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({limit:'50mb', extended:true}));

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods =
  process.env.CORS_METHODS?.split(",").map((m) => m.trim()) ?? ["GET", "POST", "PUT", "DELETE"];

app.use(
  cors({
    origin: corsOrigin.split(",").map(o => o.trim()),
    methods: corsMethods,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-gateway-secret']
  })
);

app.use(express.json());

app.get("/__debug", (_req, res) => {
  res.json({ 
    ok: true, 
    msg: "Gateway is running", 
    time: new Date().toISOString(),
    version: "1.0.0"
  });
});

console.log("[APP] Creating services...");
const authGatewayService: IAuthGatewayService = new AuthGatewayService();
const userGatewayService: IUserGatewayService = new UserGatewayService();
const productionGatewayService: IProductionGatewayService = new ProductionGatewayService();
const processingGatewayService: IProcessingGatewayService = new ProcessingGatewayService();
const storageGatewayService: IStorageGatewayService = new StorageGatewayService();
const salesGatewayService: ISalesGatewayService = new SalesGatewayService();
const analyticsGatewayService:IAnalyticsGatewayService = new AnalyticsGatewayService();
const performanceGatewayService: IPerformanceGatewayService = new PerformanceGatewayService();
const auditGatewayService: IAuditGatewayService= new AuditGatewayService();

console.log("[APP] Creating controllers...");
const authController = new AuthGatewayController(authGatewayService);
const userController = new UserGatewayController(userGatewayService);
const auditController = new AuditController(auditGatewayService);
const productionController = new ProductionGateWayController(productionGatewayService);
const processingController = new ProcessingGatewayController(processingGatewayService);
const storageController = new StorageGatewayController(storageGatewayService);
const salesController = new SalesGatewayController(salesGatewayService);
const analyticsController = new AnalyticsGatewayController(analyticsGatewayService);
const performanceController = new PerformanceGatewayController(performanceGatewayService);

console.log("[APP] Registering routes...");
app.use("/api/v1/processing", processingController.getRouter());
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', userController.getRouter());
app.use("/api/v1", auditController.getRouter());
app.use("/api/v1", productionController.getRouter());
app.use("/api/v1", storageController.getRouter());
app.use("/api/v1/sales", salesController.getRouter());

console.log("[APP] Registering ANALYTICS router at /api/v1/analytics...");
app.use("/api/v1/analytics", analyticsController.getRouter());
console.log("[APP] Analytics router registered!");

app.use("/api/v1/performance", performanceController.getRouter());

app.use((_req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route not found" 
  });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Global error handler:", err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

console.log("[APP] All routes registered successfully");

export default app;