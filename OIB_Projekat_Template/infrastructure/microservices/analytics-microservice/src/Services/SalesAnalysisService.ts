import { Repository } from "typeorm";
import { FiscalReceipt } from "../Domain/models/FiscalReceipt";
import { ISalesAnalysisService } from "../Domain/services/ISalesAnalysisService";
import { SalesAnalysisReportDTO } from "../Domain/DTOs/SalesAnalysisReportDTO";
import { SalesAnalysisReport } from "../Domain/models/SalesAnalysis";
import { CreateSalesAnalysisReportDTO } from "../Domain/DTOs/CreateSalesAnalysisReport.DTO";
import { SalesSummaryDTO } from "../Domain/DTOs/SalesSummaryDTO";
import { SalesTrendDTO } from "../Domain/DTOs/SalesTrendDTO";
import { TopPerfumeDTO } from "../Domain/DTOs/TopPerfumeDTO";
import { IPdfExportService } from "../Domain/services/IPdfExportService";
import { AuditLogType } from "../Domain/enums/AuditLogType";
import { IAuditingService } from "../Domain/services/IAuditingService";
import { PdfExportService } from "./PdfExportService";


export class SalesAnalysisService implements ISalesAnalysisService {
  constructor(
    private readonly reportRepo: Repository<SalesAnalysisReport>,
    private readonly receiptRepo: Repository<FiscalReceipt>,
    private readonly auditing: IAuditingService,
    private readonly pdf: PdfExportService
  ) {}

  private normalizePeriod(period: string): string {
    const p = (period ?? "").toLowerCase();
    if (p === "nedelja") return "NEDELJA";
    if (p === "mesec") return "MESEC";
    if (p === "godina") return "GODINA";
    if (p === "ukupno") return "UKUPNO";
    return "UKUPNO";
  }

  async createReport(data: CreateSalesAnalysisReportDTO): Promise<SalesAnalysisReportDTO> {
    const report = this.reportRepo.create({
      nazivIzvestaja: data.nazivIzvestaja,
      opis: data.opis,
      period: data.period,
      ukupnaProdaja: data.ukupnaProdaja,
      ukupnaZarada: data.ukupnaZarada,
    });

    const saved = await this.reportRepo.save(report);

    await this.auditing.log(
      AuditLogType.INFO,
      `[ANALYTICS] Kreiran izveštaj ID=${saved.id}`
    );

    return this.toDTO(saved);
  }

  async getAllReports(): Promise<SalesAnalysisReportDTO[]> {
    const reports = await this.reportRepo.find({
      order: { createdAt: "DESC" },
    });
    return reports.map((r) => this.toDTO(r));
  }

  async getReportById(id: number): Promise<SalesAnalysisReportDTO> {
    const report = await this.reportRepo.findOne({ where: { id } });
    if (!report) throw new Error("Izveštaj nije pronađen");
    return this.toDTO(report);
  }

  async getSummary(period: string): Promise<SalesSummaryDTO> {
    const normalized = this.normalizePeriod(period);
    const qb = this.receiptRepo.createQueryBuilder("r");

    if (normalized === "NEDELJA") {
      qb.where("r.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    } else if (normalized === "MESEC") {
      qb.where("r.createdAt >= DATE_SUB(NOW(), INTERVAL 1 MONTH)");
    } else if (normalized === "GODINA") {
      qb.where("r.createdAt >= DATE_SUB(NOW(), INTERVAL 1 YEAR)");
    }

    const row = await qb
      .select("COALESCE(SUM(r.ukupnaKolicina),0)", "ukupnoParfema")
      .addSelect("COALESCE(SUM(r.iznosZaNaplatu),0)", "ukupnaZarada")
      .getRawOne();

    return {
      period: normalized as SalesSummaryDTO["period"],
      ukupnaProdaja: Number(row.ukupnoParfema),
      ukupnaZarada: Number(row.ukupnaZarada),
      ukupnoParfema: Number(row.ukupnoParfema),
    };
  }

  async getTrend(period?: string): Promise<SalesTrendDTO[]> {
    const normalized = this.normalizePeriod(period ?? "UKUPNO");
    const qb = this.receiptRepo.createQueryBuilder("r");

    if (normalized === "NEDELJA") {
      qb.where("r.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
    } else if (normalized === "MESEC") {
      qb.where("r.createdAt >= DATE_SUB(NOW(), INTERVAL 1 MONTH)");
    } else if (normalized === "GODINA") {
      qb.where("r.createdAt >= DATE_SUB(NOW(), INTERVAL 1 YEAR)");
    }

    const rows = await qb
      .select("DATE(r.createdAt)", "label")
      .addSelect("COALESCE(SUM(r.ukupnaKolicina),0)", "prodato")
      .addSelect("COALESCE(SUM(r.iznosZaNaplatu),0)", "zarada")
      .groupBy("label")
      .orderBy("label", "ASC")
      .getRawMany();

    return rows.map((r) => ({
      label: String(r.label),
      prodato: Number(r.prodato),
      zarada: Number(r.zarada),
    }));
  }

  async getTop10(): Promise<TopPerfumeDTO[]> {
    const rows = await this.receiptRepo
      .createQueryBuilder("r")
      .innerJoin("r.items", "i")
      .select("i.perfumeName", "naziv")
      .addSelect("SUM(i.quantity)", "prodaja")
      .addSelect("SUM(i.lineTotal)", "prihod")
      .groupBy("i.perfumeName")
      .orderBy("prihod", "DESC")
      .limit(10)
      .getRawMany();

    return rows.map((r) => ({
      naziv: String(r.naziv),
      prodaja: Number(r.prodaja),
      prihod: Number(r.prihod),
    }));
  }

  async getTop10Revenue(): Promise<{ ukupno: number }> {
  const rows = await this.receiptRepo
    .createQueryBuilder("r")
    .innerJoin("r.items", "i")
    .select("SUM(i.lineTotal)", "prihod")
    .groupBy("i.perfumeName")
    .orderBy("prihod", "DESC")
    .limit(10)
    .getRawMany();

  const ukupno = rows.reduce(
    (sum, r) => sum + Number(r.prihod),
    0
  );

  return { ukupno };
}

  async exportPdf(id: number): Promise<Buffer> {
    const report = await this.getReportById(id);
    return this.pdf.generateReportPdf(report);
  }

  async getOrCreateReport(period: string): Promise<SalesAnalysisReportDTO> {
    const normalized = this.normalizePeriod(period);

    const existing = await this.reportRepo.findOne({
      where: { period: normalized },
      order: { createdAt: "DESC" },
    });

    if (existing) return this.toDTO(existing);

    const summary = await this.getSummary(normalized);

    const report = this.reportRepo.create({
      nazivIzvestaja: `Izveštaj prodaje - ${normalized}`,
      opis: `Automatski generisan izveštaj`,
      period: normalized,
      ukupnaProdaja: summary.ukupnaProdaja,
      ukupnaZarada: summary.ukupnaZarada,
    });

    const saved = await this.reportRepo.save(report);

    await this.auditing.log(
      AuditLogType.INFO,
      `[ANALYTICS] Kreiran izveštaj za period=${normalized}, id=${saved.id}`
    );

    return this.toDTO(saved);
  }

  private toDTO(entity: SalesAnalysisReport): SalesAnalysisReportDTO {
    return {
      id: entity.id,
      nazivIzvestaja: entity.nazivIzvestaja,
      opis: entity.opis,
      period: entity.period,
      ukupnaProdaja: entity.ukupnaProdaja,
      ukupnaZarada: Number(entity.ukupnaZarada),
      createdAt: entity.createdAt.toISOString(),
    };
  }
}
