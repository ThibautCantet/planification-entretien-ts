import { Request, Response } from "express";
import Recruteur from '../models/recruteur.model';
import { RecruteurService } from '../../use_case/recruteur.service';
import recruteurRepository from '../repositories/recruteur.repository';

export default class RecruteurController {
  recruteurService = new RecruteurService(recruteurRepository)
  async create(req: Request, res: Response) {
    try {
      const savedRecruteur = await this.recruteurService.save(req, res);

      res.status(201).send(savedRecruteur);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating recruteurs."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const langage = typeof req.query.langage === "string" ? req.query.langage : "";

    try {
      const recruteurs = await this.recruteurService.retrieveAll({ email: langage });

      res.status(200).send(recruteurs);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving recruteurs."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const recruteur = await this.recruteurService.retrieveById(id);

      if (recruteur) res.status(200).send(recruteur);
      else
        res.status(404).send({
          message: `Cannot find Recruteur with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Recruteur with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let recruteur: Recruteur = req.body;
    recruteur.id = parseInt(req.params.id);

    try {
      const num = await this.recruteurService.update(recruteur);

      if (num == 1) {
        res.status(204).send({
          message: "Recruteur was updated successfully."
        });
      } else {
        res.status(404).send({
          message: `Cannot update Recruteur with id=${recruteur.id}. Maybe Recruteur was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Recruteur with id=${recruteur.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await this.recruteurService.delete(id);

      if (num == 1) {
        res.status(204).send({
          message: "Recruteur was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Recruteur with id=${id}. Maybe Recruteur was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Recruteur with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await this.recruteurService.deleteAll();

      res.status(204).send({ message: `${num} Recruteurs were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all recruteurs."
      });
    }
  }
}
