import { Request, Response } from "express";
import Entretien from '../models/entretien.model';
import entretienRepository from '../repositories/entretien.repository';
import recruteurRepository from '../repositories/recruteur.repository';
import candidatRepository from '../repositories/candidat.repository';

export default class EntretienController {
  async create(req: Request, res: Response) {

    if (req.body.disponibiliteRecruteur != req.body.horaire) {
      res.status(400).send({
        message: "Pas les mêmes horaires!"
      });
      return;
    }

    const recruteur = await recruteurRepository.retrieveById(req.body.recruteurId);
    const candidat = await candidatRepository.retrieveById(req.body.candidatId);

    if (!candidat) {
      res.status(400).send({
        message: `Cannot create Entretien with candidat id=${req.body.candidatId}.`
      });
      return;
    }

    if (!recruteur) {
      res.status(400).send({
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

      const savedEntretien = await entretienRepository.save(entretien);

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
      const entretiens = await entretienRepository.retrieveAll();

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
      const entretien = await entretienRepository.retrieveById(id);

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
      const num = await entretienRepository.update(entretien);

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
      const num = await entretienRepository.delete(id);

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
      const num = await entretienRepository.deleteAll();

      res.status(204).send({ message: `${num} Entretiens were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all entretiens."
      });
    }
  }
}
