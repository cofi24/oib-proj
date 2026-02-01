import PDFDocument from 'pdfkit';
import { IPdfExportService } from '../Domain/services/IPdfExportService';
import{ FiscalReceiptDTO } from '../Domain/DTOs/FiscalReceiptDTO';
import { SalesAnalysisReportDTO } from '../Domain/DTOs/SalesAnalysisReportDTO';




export class PdfExportService implements IPdfExportService{
  async generateReportPdf(report: SalesAnalysisReportDTO): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];

      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      doc.fontSize(18).text("Izveštaj analize prodaje", { align: "center" });
      doc.moveDown();

      doc.fontSize(12).text(`ID: ${report.id}`);
      doc.text(`Naziv: ${report.nazivIzvestaja}`);
      doc.text(`Period: ${report.period}`);
      doc.text(`Kreirano: ${report.createdAt}`);
      doc.moveDown();

      doc.fontSize(12).text(`Opis: ${report.opis}`);
      doc.moveDown();

      doc.fontSize(12).text(`Ukupna prodaja: ${report.ukupnaProdaja}`);
      doc.text(`Ukupna zarada: ${report.ukupnaZarada}`);

      doc.moveDown();
      doc.fontSize(10).text("Generisano iz Analytics mikroservisa.", { align: "right" });

      doc.end();
    });
  }

  async generateReceiptPdf(receipt: FiscalReceiptDTO): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 40 });
      const chunks: Buffer[] = [];

      doc.on("data", (c) => chunks.push(c));
      doc.on("end", () => resolve(Buffer.concat(chunks)));

      // Zaglavlje
      doc.fontSize(20).text("FISKALNI RACUN", { align: "center" });
      doc.moveDown();

      // Osnovne informacije
      doc.fontSize(12).text(`Broj racuna: ${receipt.brojRacuna}`);
      doc.text(`ID: ${receipt.id}`);
      doc.text(`Datum: ${new Date(receipt.createdAt).toLocaleString("sr-RS")}`);
      doc.moveDown();

      doc.text(`Tip prodaje: ${receipt.tipProdaje}`);
      doc.text(`Nacin placanja: ${receipt.nacinPlacanja}`);
      doc.moveDown(1.5);
      doc.fontSize(14).text("Stavke:", { underline: true });
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const itemX = 40;
      const qtyX = 300;
      const priceX = 380;
      const totalX = 480;

      doc.fontSize(10);
      doc.text("Parfem", itemX, tableTop);
      doc.text("Kolicina", qtyX, tableTop);
      doc.text("Cena", priceX, tableTop);
      doc.text("Ukupno", totalX, tableTop);

      doc.moveTo(itemX, tableTop + 15)
         .lineTo(550, tableTop + 15)
         .stroke();

      let currentY = tableTop + 25;

      receipt.items.forEach((item) => {
        doc.fontSize(9);
        doc.text(item.perfumeName, itemX, currentY, { width: 250 });
        doc.text(item.quantity.toString(), qtyX, currentY);
        doc.text(`${item.unitPrice.toLocaleString("sr-RS")} RSD`, priceX, currentY);
        doc.text(`${item.lineTotal.toLocaleString("sr-RS")} RSD`, totalX, currentY);
        
        currentY += 20;
      });

      doc.moveDown(2);

      doc.moveTo(itemX, currentY)
         .lineTo(550, currentY)
         .stroke();

      currentY += 15;

      doc.fontSize(11);
      doc.text(`Ukupno stavki: ${receipt.ukupnoStavki}`, itemX, currentY);
      currentY += 20;
      doc.text(`Ukupna kolicina: ${receipt.ukupnaKolicina}`, itemX, currentY);
      currentY += 20;
      
      doc.fontSize(13).font("Helvetica-Bold");
      doc.text(
        `IZNOS ZA NAPLATU: ${receipt.iznosZaNaplatu.toLocaleString("sr-RS")} RSD`,
        itemX,
        currentY
      );

      doc.fontSize(8).font("Helvetica");
      doc.text(
        "Generisano iz Analytics mikroservisa.",
        40,
        doc.page.height - 50,
        { align: "center" }
      );

      doc.end();
    });
  }
}
