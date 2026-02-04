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

      <div>
        <button  onClick={() => navigate(-1)}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 13L5 8L10 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Nazad
          </button>
      </div>
    </div>
  );
};