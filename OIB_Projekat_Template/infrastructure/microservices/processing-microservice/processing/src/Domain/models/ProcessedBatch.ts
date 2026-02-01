import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("processed_batches")
export class ProcessedBatch {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  perfumeType!: string;

  @Column({ type: "int" })
  bottleCount!: number;

  @Column({ type:"int",default: 0 })  
  soldCount!: number;

  @Column({ type: "int" })
  bottleVolumeMl!: number;

  @Column({ type: "int" })
  totalMl!: number;

  @Column({ type: "int" })
  plantsNeeded!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
