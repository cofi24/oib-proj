import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Db } from "./Database/DbConnectionPool";
 import { SalesAnalysisController } from "./WebAPI/controllers/SalesAnalysisController";
import { FiscalReceiptController } from "./WebAPI/controllers/FiscalReceiptController";
import { ISalesAnalysisService } from "./Domain/services/IAnalysisService";
import { SalesAnalysisService } from "./Services/SalesAnalysisService";
import { IFiscalReceiptService } from "./Domain/services/IReceiptService";
import { FiscalReceiptService } from "./Services/ReceiptService";
import { IPdfExportService } from "./Domain/services/IPdfExportService";
import { PdfExportService } from "./Services/PdfExportService";
import { AuditingService } from "./Services/AuditingService";
import { IAuditingService } from "./Domain/services/IAuditingService";
import { SalesAnalysisReport } from "./Domain/models/SalesAnalysis";
import { FiscalReceipt } from "./Domain/models/Receipt";



dotenv.config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const corsMethods =
  process.env.CORS_METHODS?.split(",").map((m) => m.trim()) ?? ["GET", "POST"];

app.use(
  cors({
    origin: corsOrigin,
    methods: corsMethods,
  })
);

app.use(express.json());

export async function setupApp() {
  await Db.initialize();

  const auditing = new AuditingService();

  const reportRepo = Db.getRepository(SalesAnalysisReport);
  const receiptRepo = Db.getRepository(FiscalReceipt);

  const pdf:IPdfExportService = new PdfExportService();
  const analysisService:ISalesAnalysisService = new SalesAnalysisService(reportRepo, receiptRepo, auditing, pdf);
  const receiptService:IFiscalReceiptService = new FiscalReceiptService(receiptRepo, auditing,pdf);

  const analysisController = new SalesAnalysisController(analysisService);
  const receiptController = new FiscalReceiptController(receiptService);

  app.use("/api/v1", analysisController.getRouter());
  app.use("/api/v1", receiptController.getRouter());

  console.log("\x1b[32m[AnalyticsService]\x1b[0m App setup complete");
  return app;
}

export default app;
