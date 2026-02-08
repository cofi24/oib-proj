import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { FiscalReceipt } from "./Receipt";

@Entity("receipt_items")
export class FiscalReceiptItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "int" })
  perfumeId!: number;

  @Column({ type: "varchar", length: 120 })
  perfumeName!: string;

  @Column({ type: "int" })
  quantity!: number;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  unitPrice!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  lineTotal!: number;

  @ManyToOne(() => FiscalReceipt, (r) => r.items, { onDelete: "CASCADE" })
  @JoinColumn({ name: "receiptId" })
  receipt!: FiscalReceipt;

  @Column({ type: "int" })
  receiptId!: number;
}
