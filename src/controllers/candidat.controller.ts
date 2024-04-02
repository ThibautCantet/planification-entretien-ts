import { Request, Response } from 'express';
import Candidat from '../models/candidat.model';
import { ITutorialRepository } from '../repositories/candidat.repository';

export default class CandidatController {
  constructor(private readonly repository: ITutorialRepository) {
  }

  async create(req: Request, res: Response) {

    let isEmailValid:boolean;

    const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    isEmailValid = regexp.test(req.body.email);

    console.log(isEmailValid)

    if (!req.body.langage || !req.body.xp || req.body.xp < 0 || !req.body.email || !isEmailValid) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }

    try {
      const candidat: Candidat = req.body;

      const savedCandidat = await this.repository.save(candidat);

      res.status(201).send(savedCandidat);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving candidats."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const langage = typeof req.query.langage === "string" ? req.query.langage : "";

    try {
      const candidats = await this.repository.retrieveAll({ email: langage });

      res.status(200).send(candidats);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while retrieving candidats."
      });
    }
  }

  async findOne(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const candidat = await this.repository.retrieveById(id);

      if (candidat) res.status(200).send(candidat);
      else
        res.status(404).send({
          message: `Cannot find Tutorial with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Tutorial with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let candidat: Candidat = req.body;
    candidat.id = parseInt(req.params.id);

    try {
      const num = await this.repository.update(candidat);

      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${candidat.id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Tutorial with id=${candidat.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await this.repository.delete(id);

      if (num == 1) {
        res.send({
          message: "Tutorial was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Tutorial with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await this.repository.deleteAll();

      res.send({ message: `${num} Tutorials were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all candidats."
      });
    }
  }
}
