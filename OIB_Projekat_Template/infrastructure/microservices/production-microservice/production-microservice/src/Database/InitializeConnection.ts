import { AppDataSource } from "./DbConnectionPool";

export async function initializeDatabase(): Promise<void> {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("\x1b[34m[ProductionDB]\x1b[0m Connected successfully");

      // debug – vidi da li je tabela učitana
      console.log(
        "Entities:",
        AppDataSource.entityMetadatas.map(e => e.name)
      );
    }
  } catch (error) {
    console.error("\x1b[31m[ProductionDB]\x1b[0m Connection error:", error);
    process.exit(1);
  }
}
