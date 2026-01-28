import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Packaging {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  type!: string; // kasnije možemo enum (npr. BOX, WRAP, BAG), ali za sad string je ok

  @Column({ type: "int", default: 0 })
  quantity!: number;
}
