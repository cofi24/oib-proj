import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany} from "typeorm";
import { FiscalReceiptItem } from "./ReceiptItem";


@Entity("fiscal_receipts")
export class FiscalReceipt {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  brojRacuna!: string;

  @Column({ type: "varchar", length: 50 })
  tipProdaje!: string;

  @Column({ type: "varchar", length: 50 })
  nacinPlacanja!: string;

  @Column({ type: "int" })
  ukupnoStavki!: number;

  @Column({ type: "int" })
  ukupnaKolicina!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  iznosZaNaplatu!: number;

  @OneToMany(() => FiscalReceiptItem, (i) => i.receipt, { cascade: true })
  items!: FiscalReceiptItem[];

  @CreateDateColumn()
  createdAt!: Date;
}
