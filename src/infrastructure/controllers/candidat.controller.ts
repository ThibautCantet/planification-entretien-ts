import { Request, Response } from "express";
import { Candidat } from '../../domain/candidat.domain';
import candidatRepository from '../repositories/candidat.repository';
import { SupprimerTousLesCandidats } from '../../use_case/candidat.toutsupprimer';
import { CreerCandidat } from '../../use_case/candidat.creer';
import { ListerCandidats } from '../../use_case/candidat.lister';
import { TrouverCandidat } from '../../use_case/candidat.trouver';
import { MettreAJourCandidat } from '../../use_case/candidat.mettreajour';
import { SupprimerCandidat } from '../../use_case/candidat.supprimer';

export default class CandidatController {
  creerCandidat: CreerCandidat = new CreerCandidat(candidatRepository);
  listerCandidat: ListerCandidats = new ListerCandidats(candidatRepository);
  trouverCandidat: TrouverCandidat = new TrouverCandidat(candidatRepository);
  majCandidat: MettreAJourCandidat = new MettreAJourCandidat(candidatRepository);
  supprimerCandidat: SupprimerCandidat = new SupprimerCandidat(candidatRepository);
  supprimerTousLesCandidats: SupprimerTousLesCandidats = new SupprimerTousLesCandidats(candidatRepository);

  async create(req: Request, res: Response) {
    try {
      const candidat: Candidat = req.body;
      const resultat = await this.creerCandidat.execute(candidat);

      if (resultat.code === 'ok') {
        res.status(201).send(resultat.candidat);
        return;
      }

      res.status(400).send(resultat.message);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating candidats."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const langage = typeof req.query.langage === "string" ? req.query.langage : "";

    try {
      const candidats = await this.listerCandidat.execute({ email: langage });

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
      const candidat = await this.trouverCandidat.execute(id);

      if (candidat) res.status(200).send(candidat);
      else
        res.status(404).send({
          message: `Cannot find Candidat with id=${id}.`
        });
    } catch (err) {
      res.status(500).send({
        message: `Error retrieving Candidat with id=${id}.`
      });
    }
  }

  async update(req: Request, res: Response) {
    let candidat: Candidat = req.body;
    candidat.id = parseInt(req.params.id);

    try {
      const num = await this.majCandidat.execute(candidat);

      if (num == 1) {
        res.status(204).send({
          message: "Candidat was updated successfully."
        });
      } else {
        res.status(404).send({
          message: `Cannot update Candidat with id=${candidat.id}. Maybe Candidat was not found or req.body is empty!`
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Error updating Candidat with id=${candidat.id}.`
      });
    }
  }

  async delete(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const num = await this.supprimerCandidat.execute(id);

      if (num == 1) {
        res.status(204).send({
          message: "Candidat was deleted successfully!"
        });
      } else {
        res.status(404).send({
          message: `Cannot delete Candidat with id=${id}. Maybe Candidat was not found!`,
        });
      }
    } catch (err) {
      res.status(500).send({
        message: `Could not delete Candidat with id==${id}.`
      });
    }
  }

  async deleteAll(req: Request, res: Response) {
    try {
      const num = await this.supprimerTousLesCandidats.execute();

      res.status(204).send({ message: `${num} Candidats were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all candidats."
      });
    }
  }
}
