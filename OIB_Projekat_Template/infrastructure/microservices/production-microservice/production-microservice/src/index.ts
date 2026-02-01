import "reflect-metadata";
import app from "./app";
import { initializeDatabase } from "./Database/InitializeConnection";

const PORT = process.env.PORT || 3003;

async function start() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Production service running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start production service:", err);
    process.exit(1);
  }
}

start();
