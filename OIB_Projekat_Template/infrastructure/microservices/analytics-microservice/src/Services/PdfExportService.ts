import PDFDocument from 'pdfkit';
import { IPdfExportService } from '../Domain/services/IPdfExportService';
import{ FiscalReceiptDTO } from '../Domain/DTOs/FiscalReceiptDTO';
import { SalesAnalysisReportDTO } from '../Domain/DTOs/SalesAnalysisReportDTO';




export class PdfExportService implements IPdfExportService {

 async generateReportPdf(report: SalesAnalysisReportDTO): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    /* ===== TITLE ===== */
    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("black")
      .text(" ANALIZA PRODAJE", { align: "center" });

    doc.moveDown(1.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1.5);

    /* ===== META ===== */
    doc.fontSize(11).font("Helvetica");
    doc.text(`ID: ${report.id}`);
    doc.text(`Naziv: ${report.nazivIzvestaja}`);
    doc.text(`Period: ${report.period}`);
    doc.text(`Kreirano: ${report.createdAt}`);

    doc.moveDown(1.5);

    /* ===== DESCRIPTION ===== */
    doc.font("Helvetica-Bold").text("Opis");
    doc.moveDown(0.5);
    doc.font("Helvetica").text(report.opis);

    doc.moveDown(1.5);

    /* ===== SUMMARY ===== */
    doc.font("Helvetica-Bold").text("Rezime");
    doc.moveDown(0.5);

    doc.font("Helvetica");
    doc.text(`Ukupna prodaja: ${report.ukupnaProdaja}`);
    doc.text(`Ukupna zarada: ${report.ukupnaZarada}`);




    doc.end();
  });
}

async generateReceiptPdf(receipt: FiscalReceiptDTO): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    /* ===== TITLE ===== */
    doc
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("FISKALNI RACUN", { align: "center" });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(1.5);

    /* ===== BASIC INFO ===== */
    doc.fontSize(13).font("Helvetica");
    doc.text(`Broj racuna: ${receipt.brojRacuna}`);
    doc.text(`Datum: ${new Date(receipt.createdAt)}`);
    doc.text(`Tip prodaje: ${receipt.tipProdaje}`);
    doc.text(`Nacin placanja: ${receipt.nacinPlacanja}`);

    doc.moveDown(1.5);

    /* ===== ITEMS ===== */
    doc.font("Helvetica-Bold").text("Stavke");
    doc.moveDown(0.5);

    doc.font("Helvetica-Bold");
    doc.text("Parfem", 50);
    doc.text("Kol.", 400, doc.y - 14);
    doc.text("Cena", 450, doc.y - 13);
    doc.text("Ukupno", 540, doc.y - 11);

    doc.moveDown(0.3);
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
    doc.moveDown(0.5);

    doc.font("Helvetica").fontSize(10);

    receipt.items.forEach((item) => {
      doc.text(item.perfumeName, 50, doc.y, { width: 230 });
      doc.text(item.quantity.toString(), 400, doc.y);
      doc.text(`${item.unitPrice} EUR`, 460, doc.y);
      doc.text(`${item.lineTotal} EUR`, 540, doc.y);
      doc.moveDown(0.8);
    });

    doc.moveDown(1);

    /* ===== TOTAL ===== */
    doc.moveTo(50, doc.y).lineTo(600, doc.y).stroke();
    doc.moveDown(1);

    doc.font("Helvetica-Bold").fontSize(11);
    doc.text(
      `IZNOS ZA NAPLATU: ${receipt.iznosZaNaplatu} EUR`,
      { align: "right" }
    );

   
    doc.end();
  });
}
}