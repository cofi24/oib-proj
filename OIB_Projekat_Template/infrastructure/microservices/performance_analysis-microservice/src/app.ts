import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import "reflect-metadata";

import { Db } from './Database/DbConnectionPool';
import { initialize_database } from './Database/InitializeConnection';

import { Repository } from 'typeorm';
import { PerformanceReport } from './Domain/models/PerformanceReport';
import { IPerformanceService } from './Domain/services/IPerformanceService';
import { PerformanceService } from './Services/PerformanceService';
import { PerformanceController } from './WebAPI/controllers/PerformanceController';

dotenv.config({ quiet: true });

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods =
  process.env.CORS_METHODS?.split(",").map((m) => m.trim()) ?? [ "GET", "POST", "PUT", "DELETE", "OPTIONS" ];

app.use(
  cors({
    origin: corsOrigin,
    methods: corsMethods,
  })
);

app.use(express.json());

initialize_database();

const performanceReportRepository: Repository<PerformanceReport> = Db.getRepository(PerformanceReport);

const performanceService: IPerformanceService = new PerformanceService(performanceReportRepository);

const performanceController = new PerformanceController( performanceService );

app.use("/api/v1/performance", performanceController.getRouter());

export default app;
