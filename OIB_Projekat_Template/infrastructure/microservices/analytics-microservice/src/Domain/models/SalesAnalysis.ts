import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("izvestaji_prodaje")
export class SalesAnalysisReport {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  nazivIzvestaja!: string;

  @Column({ type: "text" })
  opis!: string;

  @Column({ type: "varchar", length: 50 })
  period!: string; 

  @Column({ type: "decimal", precision: 12, scale: 2 })
  ukupnaProdaja!: number;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  ukupnaZarada!: number;

  @CreateDateColumn()
  createdAt!: Date;
}