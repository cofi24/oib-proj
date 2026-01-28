import { Repository } from "typeorm";
import { Packaging } from "../Domain/models/Packaging";

export async function seedPackaging(packagingRepo: Repository<Packaging>) {
  const count = await packagingRepo.count();
  if (count > 0) return; // seed samo prvi put

  const initial = [
    packagingRepo.create({ type: "BOX", quantity: 50 }),
    packagingRepo.create({ type: "BAG", quantity: 50 }),
    packagingRepo.create({ type: "WRAP", quantity: 50 }),
  ];

  await packagingRepo.save(initial);
  console.log("[SEED] Packaging initialized.");
}
