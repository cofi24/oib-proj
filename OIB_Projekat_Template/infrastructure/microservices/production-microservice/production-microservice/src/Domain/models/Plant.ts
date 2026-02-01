import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { PlantStatus } from "../enums/PlantStatus";

@Entity("plants")
export class Plant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  plantType!: string; 

  @Column({ type: "float" })
  oilStrength!: number; 

  @Column({ type: "enum", enum: PlantStatus, default: PlantStatus.PLANTED })
  status!: PlantStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
