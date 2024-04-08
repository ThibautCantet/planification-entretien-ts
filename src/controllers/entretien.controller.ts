import { Request, Response } from "express";
import Entretien from '../models/entretien.model';
import entretienService from '../services/entretien.service';
import recruteurService from '../services/recruteur.service';
import candidatService from '../services/candidat.service';

export default class EntretienController {
  async create(req: Request, res: Response) {

    if (req.body.disponibiliteRecruteur != req.body.horaire) {
      res.status(400).send({
        message: "Pas les mêmes horaires!"
      });
      return;
    }

    const recruteur = await recruteurService.retrieveById(req.body.recruteurId);
    const candidat = await candidatService.retrieveById(req.body.candidatId);

    if (!candidat) {
      res.status(404).send({
        message: `Cannot create Entretien with candidat id=${req.body.candidatId}.`
      });
      return;
    }

    if (!recruteur) {
      res.status(404).send({
        message: `Cannot create Entretien with recruteur id=${req.body.recruteurId}.`
      });
      return;
    }

    if (recruteur?.langage && candidat?.langage && recruteur.langage != candidat.langage) {
      res.status(400).send({
        message: "Pas la même techno"
      });
      return;
    }

    if (recruteur?.xp && candidat?.xp && recruteur.xp < candidat.xp) {
      res.status(400).send({
        message: "Recruteur trop jeune"
      });
      return;
    }

    try {
      const entretien: Entretien = req.body;

      const savedEntretien = await entretienService.save(entretien);

      res.status(201).send(savedEntretien);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating entretiens."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const recruteurId = typeof req.query.recruteurId === "string" ? parseInt(req.query.recruteurId) : null;

    try {
      const entretiens = await entretienService.retrieveAll();

      res.status(200).send(entretiens);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving entretiens."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const entretien = await entretienService.retrieveById(id);

      if (entretien) res.status(200).send(entretien);
      else
        res.status(404).send({
          message: `Cannot find Entretien with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Entretien with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let entretien: Entretien = req.body;
    entretien.id = parseInt(req.params.id);

    try {
      const num = await entretienService.update(entretien);

      if (num == 1) {
        res.status(204).send({
          message: "Entretien was updated successfully."
        });
      } else {
        res.status(404).send({
          message: `Cannot update Entretien with id=${entretien.id}. Maybe Entretien was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Entretien with id=${entretien.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await entretienService.delete(id);

      if (num == 1) {
        res.status(204).send({
          message: "Entretien was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Entretien with id=${id}. Maybe Entretien was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Entretien with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await entretienService.deleteAll();

      res.status(204).send({ message: `${num} Entretiens were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all entretiens."
      });
    }
  }
}
