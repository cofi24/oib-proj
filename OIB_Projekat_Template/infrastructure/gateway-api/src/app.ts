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

// Controllers
const userController = new UserGateController(userService);
const authController = new AuthGateController(authService);
const auditController = new AuditController(auditService);
const analyticsController = new AnalyticsGateController(analyticsService);

// Registering analytics controller
app.use('/api/v1', analyticsController.getRouter());

// Registering individual controllers
app.use('/api/v1', userController.getRouter());
app.use('/api/v1', authController.getRouter());
app.use('/api/v1', auditController.getRouter());



export default app;
