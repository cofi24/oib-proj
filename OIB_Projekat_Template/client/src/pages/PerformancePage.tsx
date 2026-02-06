import { useEffect,useMemo,useState } from "react";
import { performanceAPI } from "../api/performance/PerformanceAPI";
import type { PerformanceRepoDTO } from "../models/performance/PerformanceRepoDTO";
import { mapPerformanceReport } from "../models/performance/mapPerformanceRepo";

import { Table } from "../components/performance/Table";
import { Chart } from "../components/performance/Chart";
import { Card } from "../components/performance/Card";

import { useNavigate } from "react-router-dom";
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export  function PerformancePage() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<PerformanceRepoDTO[]>([]);
  const [selected, setSelected] = useState<PerformanceRepoDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadReports() {
    setLoading(true);
    setError(null);
    try {
      const list = await performanceAPI.getReports();
      const mapped = list.map(mapPerformanceReport);
      setReports(mapped);
      setSelected(mapped[0] ?? null);
    } catch (e: any) {
      setError(e?.message ?? "Ne mogu da učitam izveštaje.");
    } finally {
      setLoading(false);
    }
  }

  async function runSimulation(algorithmName: string) {
    setRunning(true);
    setError(null);
    try {
      await performanceAPI.runSimulation({ algorithmName });
      await loadReports();
    } catch (e: any) {
      setError(e?.message ?? "Simulacija nije uspela.");
    } finally {
      setRunning(false);
    }
  }

  async function refreshSelected(id: number) {
    setError(null);
    try {
      const raw = await performanceAPI.getReportById(id);
      const one = mapPerformanceReport(raw);
      setSelected(one);
    } catch (e: any) {
      setError(e?.message ?? "Ne mogu da učitam izveštaj.");
    }
  }

  async function onPdf(id: number) {
    setError(null);
    try {
      const blob = await performanceAPI.downloadPdf(id);
      downloadBlob(blob, `performance-report-${id}.pdf`);
    } catch (e: any) {
      setError(e?.message ?? "Ne mogu da preuzmem PDF.");
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  const algo = selected?.algorithmName ?? null;

  const lastN = useMemo(() => {
    const filtered = algo ? reports.filter(r => r.algorithmName === algo) : reports;
    return filtered.slice(0, 10).reverse();
  }, [reports, algo]);

  const timeSeries = useMemo(() => lastN.map((r) => r.executionTime), [lastN]);
  const successSeries = useMemo(() => lastN.map((r) => r.successRate), [lastN]);
  const resourceSeries = useMemo(() => lastN.map((r) => r.resourceUsage), [lastN]);

  const kpiExecution = selected?.executionTime ?? 0;
  const kpiSuccess = selected?.successRate ?? 0;
  const kpiResources = selected?.resourceUsage ?? 0;
console.log("algo:", algo);
console.log("lastN length:", lastN.length);
console.log("timeSeries:", timeSeries);


  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "end",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 900 }}>Analiza performansi</div>
          
        </div>
              <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 50,
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
       <div
  style={{
    display: "flex",
    gap: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  }}
>
  <button
    disabled={running || loading}
    onClick={() => runSimulation("DISTRIBUTIVNI_CENTAR")}
    style={{ padding: "10px 12px", borderRadius: 10,marginRight: 100 }}
  >
    {running ? "Pokrećem..." : "Pokreni: Distributivni"}
  </button>

  <button
    disabled={running || loading}
    onClick={() => runSimulation("MAGACIN")}
    style={{ padding: "10px 12px", borderRadius: 10,marginRight: 200 }}
  >
    {running ? "Pokrećem..." : "Pokreni: Magacin"}
  </button>
</div>
      </div>

      {error ? (
        <div
          style={{
            border: "1px solid rgba(255,0,0,0.25)",
            background: "rgba(255,0,0,0.08)",
            padding: 10,
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <b>Greška:</b> {error}
        </div>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <Card
          title="Ukupno izveštaja"
          value={loading ? "..." : reports.length}
          hint="Izveštaji se čuvaju u bazi (DESC)"
        />
        <Card title="Vreme izvršavanja" value={kpiExecution.toFixed(0)} suffix="ms" hint="Niže je bolje" />
        <Card title="Stopa uspeha" value={kpiSuccess.toFixed(0)} suffix="%" hint="Više je bolje" />
        <Card title="Resursi" value={kpiResources.toFixed(0)} suffix="%" hint="Opterećenje sistema" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <Chart title="Trend vremena izvršavanja" values={timeSeries} valueSuffix="s" />
        <Chart title="Trend uspešnosti" values={successSeries} valueSuffix="%" />
        
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        <Chart title="Trend korišćenja resursa" values={resourceSeries} valueSuffix="%" />

       <div style={styles.summaryContainer}>
  <div style={styles.summaryHeader}>
    <div style={styles.summaryTitle}>
      <span style={styles.summaryIcon}>📋</span>
      Sažetak izveštaja
    </div>
    {selected && (
      <div style={styles.summaryBadge}>
        ID: {selected.id}
      </div>
    )}
  </div>

  <div style={styles.summaryContent}>
    {loading ? (
      <div style={styles.loadingState}>
        <div style={styles.loadingSpinner}></div>
        <span style={styles.loadingText}>Učitavam...</span>
      </div>
    ) : selected?.summary ? (
      <div style={styles.summaryText}>
        {selected.summary}
      </div>
    ) : (
      <div style={styles.emptyState}>
        <span style={styles.emptyIcon}>👆</span>
        <p style={styles.emptyText}>Izaberi izveštaj iz tabele da vidiš detalje</p>
      </div>
    )}
  </div>

  {selected && (
    <div style={styles.summaryActions}>
      <button 
        type="button" 
        disabled={loading} 
        onClick={loadReports}
        style={styles.btnRefresh}
      >
        <span style={styles.btnIcon}>↻</span>
        Osveži listu
      </button>

      <button 
        type="button" 
        disabled={loading} 
        onClick={() => onPdf(selected.id)}
        style={styles.btnPdf}
      >
        <span style={styles.btnIcon}>📄</span>
        Preuzmi PDF
      </button>
    </div>
  )}
</div>
      </div>

      <Table
        reports={reports}
        selectedId={selected?.id ?? null}
        onSelect={(r) => {
          setSelected(r);
          refreshSelected(r.id);
        }}
        onPdf={onPdf}
      />
      <div style={{ position: "relative", minHeight: "100vh" }}>
 

  {/* ostatak stranice */}
</div>
    </div>
  );
}


const styles = {
  // ... existing styles ...
  
  summaryContainer: {
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    background: "#132f4c",
    overflow: "hidden",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
  },
  summaryHeader: {
    padding: "16px 20px",
    background: "#0d2238",
    borderBottom: "2px solid #1e4976",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },
  summaryIcon: {
    fontSize: 20,
  },
  summaryBadge: {
    background: "#1e3a5f",
    color: "#64b5f6",
    padding: "4px 12px",
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
  },
  summaryContent: {
    padding: 24,
    minHeight: 160,
    background: "#0a1929",
  },
  summaryText: {
    fontSize: 14,
    color: "#e3f2fd",
    lineHeight: 1.7,
    whiteSpace: "pre-line",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 160,
  },
  loadingSpinner: {
    width: 40,
    height: 40,
    border: "4px solid #1e4976",
    borderTopColor: "#2196f3",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: {
    fontSize: 14,
    color: "#90caf9",
    fontWeight: 600,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    minHeight: 160,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.4,
  },
  emptyText: {
    fontSize: 14,
    color: "#64b5f6",
    margin: 0,
    textAlign: "center" as const,
  },
  summaryActions: {
    padding: "16px 20px",
    background: "#0d2238",
    borderTop: "2px solid #1e4976",
    display: "flex",
    gap: 12,
    justifyContent: "flex-end",
  },
  btnRefresh: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 8,
    border: "1px solid rgba(59, 130, 246, 0.5)",
    background: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  btnPdf: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 18px",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(33, 150, 243, 0.3)",
  },
  btnIcon: {
    fontSize: 16,
  },
};
