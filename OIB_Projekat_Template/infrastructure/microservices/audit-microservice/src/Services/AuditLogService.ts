import { Repository } from "typeorm";
import { AuditLog } from "../Domain/models/AuditLog";
import { IAuditLogService } from "../Domain/services/IAuditLogService";
import { CreateAuditLogDTO } from "../Domain/DTOs/CreateAuditLogDTO";
import { UpdateAuditLogDTO } from "../Domain/DTOs/UpdateAuditLogDTO";
import { AuditLogDTO } from "../Domain/DTOs/AuditLogDTO";

export class AuditLogService implements IAuditLogService {
constructor(private readonly repo: Repository<AuditLog>) {}

async getAll(): Promise<AuditLogDTO[]> {
    return this.repo.find({ order: { createdAt: "DESC" } });
}

async getById(id: number): Promise<AuditLogDTO> {
    const log = await this.repo.findOne({ where: { id } });
    if (!log) throw new Error("Audit log not found");
    return log;
}

async create(data: CreateAuditLogDTO): Promise<AuditLogDTO> {
    const log = this.repo.create(data);
    return this.repo.save(log);
}

async update(id: number, data: UpdateAuditLogDTO): Promise<AuditLogDTO> {
    const log = await this.getById(id);
    Object.assign(log, data);
    return this.repo.save(log);
}

async delete(id: number): Promise<void> {
    const result = await this.repo.delete(id);
    if (!result.affected) throw new Error("Audit log not found");
}
}