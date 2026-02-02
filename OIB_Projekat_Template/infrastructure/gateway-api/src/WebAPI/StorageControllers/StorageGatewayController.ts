import { Router, Request, Response } from "express";
import { IStorageGatewayService } from "../../Domain/services/IStorageGatewayService";
import { authenticate } from "../../Middlewares/authentification/AuthMiddleware";
import { authorize } from "../../Middlewares/authorization/AuthorizeMiddleware";
import axios from "axios";
import { AxiosError } from "axios";

interface ErrorResponseDTO {
  message?: string;
}

type ApiError = AxiosError<ErrorResponseDTO> | Error;

export class StorageGatewayController {
  private readonly router = Router();

  constructor(private readonly service: IStorageGatewayService) {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get("/storage/warehouses", authenticate, authorize("sales_manager", "seller"), this.getAllWarehouses);
    this.router.get("/storage/warehouses/:id", authenticate, authorize("sales_manager", "seller"), this.getWarehouseById);
    this.router.get("/storage/warehouses/:id/capacity", authenticate, authorize("sales_manager", "seller"), this.getWarehouseCapacity);
    this.router.post("/storage/warehouses", authenticate, authorize("sales_manager"), this.createWarehouse);
    this.router.put("/storage/warehouses/:id", authenticate, authorize("sales_manager"), this.updateWarehouse);
    this.router.delete("/storage/warehouses/:id", authenticate, authorize("sales_manager"), this.deleteWarehouse);

    this.router.get("/storage/packages", authenticate, authorize("sales_manager", "seller"), this.getAllPackages);
    this.router.get("/storage/packages/:id", authenticate, authorize("sales_manager", "seller"), this.getPackageById);
    this.router.get("/storage/packages/status/:status", authenticate, authorize("sales_manager", "seller"), this.getPackagesByStatus);
    this.router.get("/storage/packages/warehouse/:warehouseId", authenticate, authorize("sales_manager", "seller"), this.getPackagesByWarehouse);
    this.router.post("/storage/packages", authenticate, authorize("sales_manager"), this.createPackage);
    this.router.put("/storage/packages/:id", authenticate, authorize("sales_manager"), this.updatePackage);
    this.router.delete("/storage/packages/:id", authenticate, authorize("sales_manager"), this.deletePackage);

    this.router.post("/storage/send", authenticate, authorize("sales_manager", "seller"), this.sendPackages);
    this.router.get("/storage/info", authenticate, authorize("sales_manager", "seller"), this.getStorageInfo);
  }

  private handleError(res: Response, error: Error, fallback: string) {
    let message = fallback;
    let status = 500;

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || error.message;
      status = error.response?.status || 500;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return res.status(status).json({ message });
  }

  private getAllWarehouses = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.getAllWarehouses(token));
    } catch (error ) {
      if(error instanceof Error){
      console.error("Get all warehouses error:", error);
      this.handleError(res, error, "Failed to fetch warehouses");
      }
    }
  };

  private getWarehouseById = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.getWarehouseById(Number(req.params.id), token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Get warehouse by ID error:", error);
      this.handleError(res, error, "Failed to fetch warehouse");
    }
  }
  };

  private createWarehouse = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.status(201).json(await this.service.createWarehouse(req.body, token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Create warehouse error:", error);
      this.handleError(res, error, "Failed to create warehouse");
      }
    }
  };

  private updateWarehouse = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.updateWarehouse(Number(req.params.id), req.body, token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Update warehouse error:", error);
      this.handleError(res, error, "Failed to update warehouse");
      }
    }
  };

  private deleteWarehouse = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      await this.service.deleteWarehouse(Number(req.params.id), token);
      res.status(204).send();
    } catch (error) {
      if(error instanceof Error){
      console.error("Delete warehouse error:", error);
      this.handleError(res, error, "Failed to delete warehouse");
      }
    }
  };

  private getWarehouseCapacity = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.getWarehouseCapacity(Number(req.params.id), token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Get warehouse capacity error:", error);
      this.handleError(res, error, "Failed to fetch warehouse capacity");
    }
  }
  };

  private getAllPackages = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.getAllPackages(token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Get all packages error:", error);
      this.handleError(res, error, "Failed to fetch packages");
      }
    }
  };

  private getPackageById = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.getPackageById(Number(req.params.id), token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Get package error:", error);
      this.handleError(res, error, "Failed to fetch packages");
      }
    }
  };

  private createPackage = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.status(201).json(await this.service.createPackage(req.body, token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Create package error:", error);
      this.handleError(res, error, "Failed to create package");
      }
    }
  };

  private updatePackage = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.updatePackage(Number(req.params.id), req.body, token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Update package error:", error);
      this.handleError(res, error, "Failed to update package");
      }
    }
  };

  private deletePackage = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      await this.service.deletePackage(Number(req.params.id), token);
      res.status(204).send();
    } catch (error) {
      if(error instanceof Error){
      console.error("Delete package error:", error);
      this.handleError(res, error, "Failed to delete package");
      }
    }
  };

  private getPackagesByStatus = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.getPackagesByStatus(req.params.status, token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Get packages by status error:", error);
      this.handleError(res, error, "Failed to fetch packages by status");
      }
    }
  };

  private getPackagesByWarehouse = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      res.json(await this.service.getPackagesByWarehouse(Number(req.params.warehouseId), token));
    } catch (error) {
      if(error instanceof Error){
      console.error("Get packages by warehouse error:", error);
      this.handleError(res, error, "Failed to fetch packages by warehouse");
      }
    }
  };

  private getStorageInfo = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const userRole = req.user?.role;
      res.json(await this.service.getStorageInfo(token, userRole));
    } catch (error) {
      if(error instanceof Error){
      console.error("Get storage info error:", error);
      this.handleError(res, error, "Failed to fetch storage info");
      }
    }
  };

  private sendPackages = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const userRole = req.user?.role;
      res.json(await this.service.sendPackages(req.body, token, userRole));
    } catch (error) {
      if(error instanceof Error){
      console.error("Send packages error:", error);
      this.handleError(res, error, "Failed to send packages");
      }
    }
  };

  getRouter() {
    return this.router;
  }
}