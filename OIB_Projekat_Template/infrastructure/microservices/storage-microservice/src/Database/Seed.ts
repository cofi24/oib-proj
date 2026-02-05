import { Repository } from "typeorm";
import { Packaging } from "../Domain/models/Packaging";

export async function seedPackaging(packagingRepo: Repository<Packaging>) {
  // Proveri i ažuriraj ili dodaj
  const boxPkg = await packagingRepo.findOne({ where: { type: "BOX" } });
  if (boxPkg) {
    boxPkg.quantity = 100; // Resetuj na 100
    await packagingRepo.save(boxPkg);
    console.log("[SEED] BOX packaging updated to 100.");
  } else {
    await packagingRepo.save(
      packagingRepo.create({ type: "BOX", quantity: 100 })
    );
    console.log("[SEED] BOX packaging created with 100.");
  }

  // Isti proces za BAG i WRAP...
  const bagPkg = await packagingRepo.findOne({ where: { type: "BAG" } });
  if (bagPkg) {
    bagPkg.quantity = 100;
    await packagingRepo.save(bagPkg);
  } else {
    await packagingRepo.save(
      packagingRepo.create({ type: "BAG", quantity: 100 })
    );
  }

  const wrapPkg = await packagingRepo.findOne({ where: { type: "WRAP" } });
  if (wrapPkg) {
    wrapPkg.quantity = 100;
    await packagingRepo.save(wrapPkg);
  } else {
    await packagingRepo.save(
      packagingRepo.create({ type: "WRAP", quantity: 100 })
    );
  }
}