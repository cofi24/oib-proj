import { Request, Response, Router } from "express";
import { IUsersService } from "../../Domain/services/IUsersService";
import { ILogerService } from "../../Domain/services/ILogerService";

export class UsersController {
  private readonly router: Router;

  constructor(
    private readonly usersService: IUsersService,
    private readonly logerService: ILogerService
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // ⚠️ REDOSLED JE BITAN
    this.router.get("/", this.getAll.bind(this));
    this.router.get("/:id", this.getById.bind(this));

    this.router.post("/", this.create.bind(this));
    this.router.put("/:id", this.update.bind(this));
    this.router.delete("/:id", this.delete.bind(this));
  }

  private async getAll(req: Request, res: Response) {
    const users = await this.usersService.getAllUsers();
    res.status(200).json(users);
  }

  private async getById(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    this.logerService.log(`Fetching user with ID ${id}`);
    const user = await this.usersService.getUserById(id);
    res.status(200).json(user);
  }

  private async create(req: Request, res: Response) {
    const user = await this.usersService.createUser(req.body);
    res.status(201).json(user);
  }

  private async update(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const user = await this.usersService.updateUser(id, req.body);
    res.status(200).json(user);
  }

  private async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    await this.usersService.deleteUser(id);
    res.status(204).send();
  }

  public getRouter(): Router {
    return this.router;
  }
}
