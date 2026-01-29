import { Db } from "./DbConnectionPool";
import { Product } from "../Domain/models/Product";
import { seedProducts } from "./Seed";

export async function initialize_database() {
  try {
    await Db.initialize();
    console.log("\x1b[34m[DbConn@1.12.4]\x1b[0m Database connected");

    const productRepo = Db.getRepository(Product);
    await seedProducts(productRepo);

  } catch (err) {
    console.error(
      "\x1b[31m[DbConn@1.12.4]\x1b[0m Error during DataSource initialization ",
      err
    );
  }
}
