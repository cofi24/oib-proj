import { Repository } from "typeorm";
import { Product } from "../Domain/models/Product";

export async function seedProducts(productRepo: Repository<Product>) {
  const count = await productRepo.count();
  if (count > 0) return;

  const initial = [
    productRepo.create({ name: "Sauvage", brand: "Dior", price: 129.99, quantity: 30 }),
    productRepo.create({ name: "Bleu de Chanel", brand: "Chanel", price: 139.99, quantity: 25 }),
    productRepo.create({ name: "Acqua di Gio", brand: "Giorgio Armani", price: 109.99, quantity: 40 }),
    productRepo.create({ name: "Eros", brand: "Versace", price: 99.99, quantity: 35 }),
    productRepo.create({ name: "1 Million", brand: "Paco Rabanne", price: 89.99, quantity: 50 }),
  ];

  await productRepo.save(initial);
  console.log("[SEED] Products initialized.");
}
