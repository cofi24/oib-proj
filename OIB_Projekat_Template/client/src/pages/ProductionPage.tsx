import React,{useEffect,useState} from "react";
import { IProductionAPI } from "../api/production/IProductionAPI";
import { IAuditAPI } from "../api/audit/IAuditAPI";
import { Form } from "../components/production/Form";
import { Log } from "../components/production/Log";
import { Table } from "../components/production/Table";

import { useAuth } from "../hooks/useAuthHook";
import { AuditLogDTO } from "../models/audit/AuditLogDTO";
import { useNavigate } from "react-router-dom";

type ProductionPlant = {
  id: number;
  plantType: string;
  oilStrength: number;
  status: string;
  createdAt: string | Date;
};

export const ProductionPage: React.FC<{
  productionAPI: IProductionAPI;
  auditAPI: IAuditAPI;
}> = ({ productionAPI, auditAPI }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [plants, setPlants] = useState<ProductionPlant[]>([]);
  const [logs, setLogs] = useState<AuditLogDTO[]>([]);
  const [plantType, setPlantType] = useState("");
  const [harvestType, setHarvestType] = useState("");
  const [harvestQty, setHarvestQty] = useState(1);
  const [adjustPlantId, setAdjustPlantId] = useState<number | "">("");
  const [adjustPercent, setAdjustPercent] = useState(100);

  const refresh = async () => {
    if (!token) return;

    const p = (await productionAPI.getAllPlants(token)) as ProductionPlant[];
    setPlants(p);

    try {
      const allLogs = await auditAPI.getAll(token);
      setLogs(
        allLogs.filter((l) => (l.description ?? "").startsWith("[PRODUCTION]"))
      );
    } catch (e) {
      console.warn("Audit not accessible");
      setLogs([]);
    }
  };

  useEffect(() => {
    refresh();
  }, [token]);

  const onPlant = async () => {
    if (!token) return;
    await productionAPI.plant(token, plantType);
    setPlantType("");
    await refresh();
  };

  const onHarvest = async () => {
    if (!token) return;
    await productionAPI.harvest(token, harvestType, harvestQty);
    await refresh();
  };

  const onAdjustOil = async () => {
    if (!token) return;
    if (!adjustPlantId) return;

    await productionAPI.adjust(token, Number(adjustPlantId), adjustPercent);

    setAdjustPlantId("");
    setAdjustPercent(100);
    await refresh();
  };

  return (
    <div style={{ padding: 30 }}>
      <div >
        <div className="analytics-header-info">
          <h1>Proizvodnja</h1>
          <div className="analytics-subtitle">
            Upravljanje biljkama i proizvodnjom
          </div>
           <button
    onClick={() => navigate(-1)}
    style={{
      position: "absolute",
      top: 80,
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

        
      </div>

      
      <Form
        plants={plants}
        plantType={plantType}
        setPlantType={setPlantType}
        harvestType={harvestType}
        setHarvestType={setHarvestType}
        harvestQty={harvestQty}
        setHarvestQty={setHarvestQty}
        adjustPlantId={adjustPlantId}
        setAdjustPlantId={setAdjustPlantId}
        adjustPercent={adjustPercent}
        setAdjustPercent={setAdjustPercent}
        onPlant={onPlant}
        onHarvest={onHarvest}
        onAdjustOil={onAdjustOil}
      />

      
      <div className="production-grid">
        <Table plants={plants} />
        <Log logs={logs} />
      </div>

      <div style={{ position: "relative", minHeight: "100vh" }}>
 

  {/* ostatak stranice */}
</div>
    </div>
  );
};