import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";
import { AuditLogType } from "../enums/AuditLogType";

@Entity("audit_logs")
export class AuditLog {
@PrimaryGeneratedColumn()
id!: number;

@Column({ type: "enum", enum: AuditLogType })
type!: AuditLogType;

@Column({ type: "text" })
description!: string;

@CreateDateColumn()
createdAt!: Date;
}