import { Db } from "./DbConnectionPool";
import { AuditLog } from "../Domain/models/AuditLog";

export async function initialize_database(): Promise<void> {
    try {
        if (!Db.isInitialized) { 
            await Db.initialize();
            console.log(Db.entityMetadatas.map(e => e.name));
            console.log("\x1b[34m[AuditDB@1.0.0]\x1b[0m Database connected");
       
       console.log(await Db.getRepository(AuditLog).find());
        }
    } catch (error) {
        console.error("\x1b[31m[AuditDB@1.0.0]\x1b[0m Connection error", error);
        throw error;
    }
}