import React,{useEffect,useState,useMemo  } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../components/processing/Table";
import { Log } from "../components/processing/Log";
import { useAuth } from "../hooks/useAuthHook";
import { AmountDTO } from "../models/processing/AmountDTO";
import { AuditLogDTO } from "../models/audit/AuditLogDTO";
import { IAuditAPI } from "../api/audit/IAuditAPI";
import { IProcessingAPI } from "../api/processing/IProcessingAPI";
import { Form } from "../components/processing/Form";


type Props = {
  processingAPI: IProcessingAPI;
  auditAPI: IAuditAPI;
};

export const ProcessingPage: React.FC<Props> = ({
  processingAPI,
  auditAPI,
}) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [perfumeType, setPerfumeType] = useState("Lavanda");
  const [bottleCount, setBottleCount] = useState(1);
  const [bottleVolumeMl, setBottleVolumeMl] = useState<150 | 250>(150);

  const [amount, setBatches] = useState<AmountDTO[]>([]);
  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    if (!token) return;
    const [b, l] = await Promise.all([
      processingAPI.getProcessedAmounts(token),
      auditAPI.getAll(token),
    ]);
    setBatches(b);
    setLogs(l);
  };

  useEffect(() => {
    if (token) refresh();
  }, [token]);

  const processingLogs = useMemo(
    () =>
      logs.filter((l) => (l.description ?? "").startsWith("[PROCESSING]")),
    [logs]
  );

  const onStart = async () => {
    if (!token) {
      setError("Niste ulogovani.");
      return;
    }
    setError(null);

    await processingAPI.startProcessingBatch(token, {
      perfumeType,
      bottleCount,
      bottleVolumeMl,
    });

    refresh();
  };

  return (
    <div style={{ padding: 30 }}>
      
      <div>
        <div >
          <h1>Prerada parfema</h1>
          
        </div>
       <button
    onClick={() => navigate(-1)}
    style={{
      position: "absolute",
      top: 60,
      right: 30,
      padding: "8px 19px",
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

        
      </div>

      
      <Form
        perfumeType={perfumeType}
        setPerfumeType={setPerfumeType}
        bottleCount={bottleCount}
        setBottleCount={setBottleCount}
        bottleVolumeMl={bottleVolumeMl}
        setBottleVolumeMl={setBottleVolumeMl}
        error={error}
        disabled={!token}
        onStart={onStart}
      />

      
      <div >
        <Table amount={amount} />
        <Log logs={processingLogs} />
      </div>

      <div style={{ position: "relative", minHeight: "100vh" }}>
 
  {/* ostatak stranice */}
</div>
    </div>
  );
};