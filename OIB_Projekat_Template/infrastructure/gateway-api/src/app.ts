import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

//user, auth, audit imports
import { IAuditGateService } from './Domain/services/IAuditGateService';
import { IAuthGateService } from './Domain/services/IAuthGateService';
import { IUserGateService } from './Domain/services/IUserGateService';
import { UserGatewayService } from './Services/UserServices/UserGateService';
import { AuditGateService } from './Services/AuditService/AuditGateService';
import { AuthGateService } from './Services/AuthService/AuthGateService';
import { AuditController } from './WebAPI/AuditControllers/AuditGateController';
import { AuthGateController } from './WebAPI/AuthControllers/AuthGateController';
import { UserGateController } from './WebAPI/UserControllers/UserGateController';
//analytics imports
import { AnalyticsGateService } from './Services/AnalyticsServices/AnalyticsGateService';
import { IAnalyticsGateService } from './Domain/services/IAnalyticsGateService';
import { AnalyticsGateController } from './WebAPI/AnalyticsControllers/AnalyticsGateController';
//performance imports
import { IPerformanceGateService } from './Domain/services/IPerformanceGateService';
import { PerformanceGateService } from './Services/PerformanceService/PerformanceGateService';
import { PerformanceGateController } from './WebAPI/PerformanceControllers/PerformanceGateController';  
//sales imports
import { ISalesGateService } from './Domain/services/ISalesGateService';
import { SalesGateService } from './Services/SalesService/SalesGateService';
import { SalesGateController } from './WebAPI/SalesControllers/SalesGateController';
//storage imports
import { IStorageGateService } from './Domain/services/IStorageGateService';
import { StorageGateService } from './Services/StorageService/StorageGateService';
import { StorageGateController } from './WebAPI/StorageControllers/StorageGateControllers';
//production imports
import { IProductionGateService } from './Domain/services/IProductionGateService';
import { ProductionGateService } from './Services/ProductionServices/ProductionGateService';
import { ProductionGateController } from './WebAPI/ProductionControllers/ProductionGateController';
//processing imports
import { IProcessingGateService } from './Domain/services/IProcessingGateService';
import { ProcessingGateService } from './Services/ProcessingServices/ProcessingGateService';
import { ProcessingGateController } from './WebAPI/ProcessingControllers/ProcessingGateController';




dotenv.config({ quiet: true });

const app = express();

// Read CORS settings from environment
const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods = process.env.CORS_METHODS?.split(",").map(m => m.trim()) ?? ["POST"];

// Protected microservice from unauthorized access
app.use(cors({
  origin: corsOrigin,
  methods: corsMethods,
}));

app.use(express.json());

// Services

const userService: IUserGateService = new UserGatewayService();
const authService: IAuthGateService = new AuthGateService();
const auditService: IAuditGateService = new AuditGateService();
const analyticsService: IAnalyticsGateService = new AnalyticsGateService();
const performanceService: IPerformanceGateService = new PerformanceGateService();
const salesService: ISalesGateService = new SalesGateService();
const storageService: IStorageGateService = new StorageGateService();
const productionService: IProductionGateService = new ProductionGateService();
const processingService: IProcessingGateService = new ProcessingGateService();


// Controllers
const userController = new UserGateController(userService);
const authController = new AuthGateController(authService);
const auditController = new AuditController(auditService);
const analyticsController = new AnalyticsGateController(analyticsService);
const performanceController = new PerformanceGateController(performanceService);
const salesController = new SalesGateController(salesService);
const storageController = new StorageGateController(storageService);
const productionController = new ProductionGateController(productionService);
const processingController = new ProcessingGateController(processingService);

// Registering production controller
app.use('/api/v1', productionController.getRouter());


// Registering individual controllers
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', auditController.getRouter());
// Registering analytics controller
app.use('/api/v1/analytics', analyticsController.getRouter());
// Registering performance controller
app.use('/api/v1', performanceController.getRouter());
//sales controller
app.use('/api/v1', salesController.getRouter());
//storage controller
app.use('/api/v1', storageController.getRouter());
//  production controller
app.use('/api/v1', productionController.getRouter());
// processing controller
app.use('/api/v1', processingController.getRouter());

export default app;
