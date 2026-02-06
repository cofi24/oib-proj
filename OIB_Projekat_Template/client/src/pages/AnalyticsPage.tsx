import React,{useMemo,useEffect,useState} from "react"; 
import { useAuth } from "../hooks/useAuthHook";
import { Summary } from "../components/analytics/Summary";
import { Trend } from "../components/analytics/Trend";
import { Receipts } from "../components/analytics/Receipts";
import { ReportsPanel } from "../components/analytics/Report";
import { Top10 } from "../components/analytics/Top10";
import { SummaryDTO } from "../models/analytics/SummaryDTO";
import { TrendDTO } from "../models/analytics/TrendDTO";
import { TopDTO } from "../models/analytics/TopDTO";
import { ReceiptDTO } from "../models/analytics/ReceiptDTO";
import { ReportDTO } from "../models/analytics/ReportDTO"
import { useNavigate } from "react-router-dom";
import { IAnalyticsAPI } from "../api/analytics/IAnalyticsAPI";
import { SalesPeriod } from "../models/analytics/SummaryDTO";

type Props = {
  analyticsAPI: IAnalyticsAPI;
};

export const AnalyticsPage: React.FC<Props> = ({ analyticsAPI }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [period, setPeriod] = useState<SalesPeriod>("NEDELJA");
  const [summary, setSummary] = useState<SummaryDTO | null>(null);
  const [trend, setTrend] = useState<TrendDTO[]>([]);
  const [top10, setTop10] = useState<TopDTO[]>([]);
  const [top10Revenue, setTop10Revenue] = useState<number | null>(null);
  const [reports, setReports] = useState<ReportDTO[]>([]);
  const [receipts, setReceipts] = useState<ReceiptDTO[]>([]);
  const [totalReceipts, setTotalReceipts] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const title = useMemo(() => {
    switch (period) {
      case "NEDELJA":
        return "Pregled prodaje - Nedelja";
      case "MESEC":
        return "Pregled prodaje - Mesec";
      case "GODINA":
        return "Pregled prodaje - Godina";
      default:
        return "Pregled prodaje - Ukupno";
    }
  }, [period]);

  const refreshAll = async () => {
    if (!token) return;
    setLoading(true);

    try {
      const [s, t, top, rev, reps, recs] = await Promise.all([
        analyticsAPI.getSummary(token, period),
        analyticsAPI.getTrend(token, period),
        analyticsAPI.getTop10(token),
        analyticsAPI.getTop10Revenue(token),
        analyticsAPI.getReports(token),
        analyticsAPI.getReceipts(token),
      ]);

      setSummary(s);
      setTrend(t);
      setTop10(top);
      setTop10Revenue(typeof rev?.ukupno === "number" ? rev.ukupno : null);
      setReports(reps);
      setReceipts(recs);
      setTotalReceipts(recs.length);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Nepoznata greška";
      alert(`Greška: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const createReport = async () => {
    if (!token || !summary) return;
    setCreating(true);

    try {
      await analyticsAPI.createReport(token, {
        nazivIzvestaja: `Izveštaj prodaje - ${period}`,
        opis: `Izveštaj analize prodaje za period ${period}`,
        period,
        ukupnaProdaja: summary.ukupnaProdaja,
        ukupnaZarada: summary.ukupnaZarada,
      });

      alert("Izveštaj uspešno kreiran!");
      await refreshAll();
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Nepoznata greška";
      alert(message);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, [token, period]);

  const exportReportPdf = async (id: number) => {
    if (!token) return;

    try {
      const blob = await analyticsAPI.exportReportPdf(token, id);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `izvestaj-${id}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Greška pri preuzimanju";
      alert(message);
    }
  };

  const exportReceiptPdf = async (id: number) => {
    if (!token) return;

    try {
      console.log(`Exportujem račun ID: ${id}`);
      const blob = await analyticsAPI.exportReceiptPdf(token, id);
      console.log(`Primljen blob veličine: ${blob.size} bytes`);
      
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `racun-${id}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
      console.log(`PDF uspešno preuzet: racun-${id}.pdf`);
    } catch (e) {
      if(e instanceof Error){
      console.error("Greška pri exportu PDF-a:", e);
      const message =  e.message || "Greška pri preuzimanju računa";
      alert(`Greška: ${message}`);
      }
    }
  };

  return (
    <div style={{ padding: 30 }}>
      
      <div className="analytics-header">
        <div className="analytics-header-info">
          <h1>Analiza prodaje</h1>
          <div className="analytics-subtitle">{title}</div>
        </div>

        <div className="analytics-header-actions">
          <button
            className="btn btn-accent analytics-btn-create"
            onClick={createReport}
            disabled={creating || loading}
          >
            {creating ? (
              <>
                <span className="spinner-small"></span>
                Kreiranje...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Kreiraj izveštaj
              </>
            )}
          </button>

          <div className="analytics-period-selector">
            <label className="period-label">Period:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as SalesPeriod)}
              className="period-select"
            >
              <option value="NEDELJA">Nedelja</option>
              <option value="MESEC">Mesec</option>
              <option value="GODINA">Godina</option>
              <option value="UKUPNO">Ukupno</option>
            </select>
          </div>

          
        </div>
      </div>

      
      <Summary 
        summary={summary ? {
          period: summary.period,
          ukupnaProdaja: summary.ukupnaProdaja,
          ukupnaZarada: summary.ukupnaZarada,
          ukupnoParfema: summary.ukupnoParfema,
          najjaciDan: summary.najjaciDan,
          totalReceipts: totalReceipts
        } : null} 
        top10Revenue={top10Revenue} 
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Trend title="Broj prodatih parfema" data={trend} mode="prodato" />
        <Trend title="Zarada (RSD)" data={trend} mode="zarada" />
      </div>

      <div style={{ marginTop: 12 }}>
        <Top10 title="Top10 prihod" data={top10} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <ReportsPanel reports={reports} onExportPdf={exportReportPdf} />
        <Receipts receipts={receipts} onExportPdf={exportReceiptPdf} />
      </div>
      <div style={{ position: "relative", minHeight: "100vh" }}>
  <button
    onClick={() => navigate(-1)}
    style={{
      position: "absolute",
      top: 20,
      right: 20,
      padding: "8px 14px",
      borderRadius: 10,
      border: "none",
      background: "linear-gradient(135deg, #2563eb, #4f46e5)",
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
      boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-1px)";
      e.currentTarget.style.boxShadow = "0 10px 18px rgba(0,0,0,0.22)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.18)";
    }}
  >
    ← Nazad
  </button>

  {/* ostatak stranice */}
</div>
    </div>
    
  );
};