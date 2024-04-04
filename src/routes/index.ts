import { Application } from "express";
import candidatRoutes from "./candidat.routes";
import recruteurRoutes from "./recruteur.routes";
import homeRoutes from "./home.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api", homeRoutes);
    app.use("/api/candidat", candidatRoutes);
    app.use("/api/recruteur", recruteurRoutes);
  }
}
