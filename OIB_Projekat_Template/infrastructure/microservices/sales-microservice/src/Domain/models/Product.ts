import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  brand!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "int", default: 0 })
  quantity!: number;
}
