import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { UserRole } from "../enums/UserRole";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true, length: 100 })
  username!: string;

  @Column({type: "enum", enum: UserRole, default: UserRole.SELLER })
  role!: UserRole;

 @Column({ type: "varchar", length: 255 })
  password!: string | null;


  @Column({ type: "varchar", length: 255, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  firstName!: string | null;

  @Column({ type: "varchar", length: 100, nullable: true })
  lastName!: string | null;


  @Column({ type: "longtext", nullable: true })
  profileImage!: string | null;
}
