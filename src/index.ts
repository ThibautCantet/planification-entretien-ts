import express, { Application } from "express";
import cors, { CorsOptions } from "cors";
import Routes from "./infrastructure/routes";
import mongoose, { Schema } from 'mongoose';
import Database from './infrastructure/db';

export default class Server {
  constructor(app: Application) {
    this.config(app);
    this.syncDatabase();
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "http://localhost:8081"
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  }

  private syncDatabase(): void {
    const db = new Database();
    db.sequelize?.sync();

    mongoose.connect('mongodb://localhost/test', {
    });

    const mongoDb = mongoose.connection;
    mongoDb.on('error', console.error.bind(console, 'MongoDB connection error:'));
    mongoDb.once('open', function() {
      // we're connected!
      console.log('Connected to the mongo db database.');
    });
  }
}

const candidatSchema: Schema = new Schema({
  langage: { type: String, required: true },
  email: { type: String, required: true },
  xp: { type: Number, required: true }
});

export const CandidatModel = mongoose.model('Candidat', candidatSchema);
