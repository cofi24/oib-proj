import app, { setupApp } from "./app";

const PORT = process.env.PORT || 3004;

async function start() {
  const expressApp = await setupApp();
  expressApp.listen(PORT, () => console.log(`[ProcessingService] running on ${PORT}`));
}

start();
