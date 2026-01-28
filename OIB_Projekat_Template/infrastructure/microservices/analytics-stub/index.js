import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/v1/health", (_, res) => {
  res.status(200).json({ status: "ok", service: "analytics-stub" });
});

// Endpoint koji Sales očekuje: POST /api/v1/analytics/receipt
app.post("/api/v1/analytics/receipt", (req, res) => {
  const body = req.body ?? {};

  // Minimalna validacija da stub ne vraća smeće
  if (!body.saleType || !body.paymentMethod || !Array.isArray(body.items)) {
    return res.status(400).json({ message: "Invalid receipt payload." });
  }

  const grandTotal =
    typeof body.grandTotal === "number"
      ? body.grandTotal
      : (body.items ?? []).reduce((s, i) => s + (Number(i.total) || 0), 0);

  return res.status(200).json({
    receiptId: `STUB-${Date.now()}`,
    createdAt: new Date().toISOString(),
    saleType: body.saleType,
    paymentMethod: body.paymentMethod,
    items: body.items,
    grandTotal,
  });
});

const PORT = process.env.PORT || 5557;
app.listen(PORT, () => console.log(`[analytics-stub] listening on ${PORT}`));
