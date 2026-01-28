import { Db } from "./DbConnectionPool";
import { Packaging } from "../Domain/models/Packaging";
import { seedPackaging } from "./Seed";

export async function initialize_database() {
  try {
    await Db.initialize();
    console.log("\x1b[34m[DbConn@1.12.4]\x1b[0m Database connected");

    // SEED (samo ako je tabela prazna)
    const packagingRepo = Db.getRepository(Packaging);
    await seedPackaging(packagingRepo);

  } catch (err) {
    console.error(
      "\x1b[31m[DbConn@1.12.4]\x1b[0m Error during DataSource initialization ",
      err
    );
  }
}
