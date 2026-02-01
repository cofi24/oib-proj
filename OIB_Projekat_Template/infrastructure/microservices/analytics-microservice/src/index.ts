import "reflect-metadata";
import app, { setupApp } from "./app";

const PORT = process.env.PORT || 5557;

async function startServer() {
    const expressApp = await setupApp();

    expressApp.listen(PORT, () => {
        console.log(`[AuditService] running on port ${PORT}`);
    });
}

startServer();