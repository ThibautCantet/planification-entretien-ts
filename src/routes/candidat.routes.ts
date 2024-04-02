import { Router } from "express";
import CandidatController from "../controllers/candidat.controller";
import candidatRepository from '../repositories/candidat.repository';

class CandidatRoutes {
  router = Router();
  controller = new CandidatController(candidatRepository);

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    // Create a new Tutorial
    this.router.post("/", this.controller.create.bind(this.controller));

    // Retrieve all Tutorials
    this.router.get("/", this.controller.findAll.bind(this.controller));

    // Retrieve a single Tutorial with id
    this.router.get("/:id", this.controller.findOne.bind(this.controller));

    // Update a Tutorial with id
    this.router.put("/:id", this.controller.update.bind(this.controller));

    // Delete a Tutorial with id
    this.router.delete("/:id", this.controller.delete.bind(this.controller));

    // Delete all Tutorials
    this.router.delete("/", this.controller.deleteAll.bind(this.controller));
  }
}

export default new CandidatRoutes().router;
