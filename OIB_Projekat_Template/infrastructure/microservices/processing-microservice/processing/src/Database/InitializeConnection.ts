import { AppDataSource } from "./DbConnectionPool";

export async function initializeDatabase(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("\x1b[34m[ProcessingDB]\x1b[0m Connected");
      console.log("Entities:", AppDataSource.entityMetadatas.map(e => e.name));
    }
  } catch (e) {
    console.error("\x1b[31m[ProcessingDB]\x1b[0m Connection error:", e);
    process.exit(1);
  }
}
