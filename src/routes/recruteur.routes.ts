import { Router } from "express";
import RecruteurController from '../controllers/recruteur.controller';

class RecruteurRoutes {
  router = Router();
  controller = new RecruteurController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Recruteur
    this.router.post("/", this.controller.create.bind(this.controller));

    // Retrieve all Recruteurs
    this.router.get("/", this.controller.findAll.bind(this.controller));

    // Retrieve a single Recruteur with id
    this.router.get("/:id", this.controller.findOne.bind(this.controller));

    // Update a Recruteur with id
    this.router.put("/:id", this.controller.update.bind(this.controller));

    // Delete a Recruteur with id
    this.router.delete("/:id", this.controller.delete.bind(this.controller));

    // Delete all Recruteurs
    this.router.delete("/", this.controller.deleteAll.bind(this.controller));
  }
}

export default new RecruteurRoutes().router;
