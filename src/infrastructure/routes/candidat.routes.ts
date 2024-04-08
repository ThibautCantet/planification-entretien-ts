import { Router } from "express";
import CandidatController from "../controllers/candidat.controller";

class CandidatRoutes {
  router = Router();
  controller = new CandidatController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Candidat
    this.router.post("/", this.controller.create.bind(this.controller));

    // Retrieve all Candidats
    this.router.get("/", this.controller.findAll.bind(this.controller));

    // Retrieve a single Candidat with id
    this.router.get("/:id", this.controller.findOne.bind(this.controller));

    // Update a Candidat with id
    this.router.put("/:id", this.controller.update.bind(this.controller));

    // Delete a Candidat with id
    this.router.delete("/:id", this.controller.delete.bind(this.controller));

    // Delete all Candidats
    this.router.delete("/", this.controller.deleteAll.bind(this.controller));
  }
}

export default new CandidatRoutes().router;
