import { Router } from "express";
import EntretienController from '../controllers/entretien.controller';

class EntretienRoutes {
  router = Router();
  controller = new EntretienController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Entretien
    this.router.post("/", this.controller.create.bind(this.controller));

    // Retrieve all Entretiens
    this.router.get("/", this.controller.findAll.bind(this.controller));

    // Retrieve a single Entretien with id
    this.router.get("/:id", this.controller.findOne.bind(this.controller));

    // Update a Entretien with id
    this.router.put("/:id", this.controller.update.bind(this.controller));

    // Delete a Entretien with id
    this.router.delete("/:id", this.controller.delete.bind(this.controller));

    // Delete all Entretiens
    this.router.delete("/", this.controller.deleteAll.bind(this.controller));
  }
}

export default new EntretienRoutes().router;
