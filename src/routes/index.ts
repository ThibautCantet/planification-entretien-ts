import { Application } from "express";
import candidatRoutes from "./candidat.routes";
import recruteurRoutes from "./recruteur.routes";
import entretienRoutes from './entretien.routes';

export default class Routes {
  constructor(app: Application) {
    app.use("/api/candidat", candidatRoutes);
    app.use("/api/recruteur", recruteurRoutes);
    app.use("/api/entretien", entretienRoutes);
  }
}
