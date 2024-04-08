import { Request, Response } from 'express';
import entretienRepository from '../repositories/entretien.repository';
import { Creation, EntretienService } from '../../use_case/entretien.service';
import { Entretien } from '../../domain/entretien.domain';
import recruteurRepository from '../repositories/recruteur.repository';
import candidatRepository from '../repositories/candidat.repository';

export default class EntretienController {
  entretienService = new EntretienService(entretienRepository,
      recruteurRepository, candidatRepository);

  async create(req: Request, res: Response) {
    try {
      const entretien: Entretien = req.body;
      const resultat = await this.entretienService.create(entretien, req.body.disponibiliteRecruteur, req.body.horaire);
      switch (resultat.code) {
        case Creation.CANDIDAT_PAS_TROUVE:
        case Creation.RECRUTEUR_PAS_TROUVE:
          res.status(404).send(resultat.message);
          break;
        case Creation.PAS_COMPATIBLE:
        case Creation.HORAIRE:
          res.status(400).send(resultat.message);
          break;
        default:
          res.status(201).send(resultat.entretien);
      }
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating entretiens."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const entretiens = await this.entretienService.retrieveAll();

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
