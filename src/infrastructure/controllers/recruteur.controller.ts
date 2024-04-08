import { Request, Response } from "express";
import { SupprimerTousLesRecruteurs } from '../../use_case/recruteur.toutsupprimer';
import recruteurRepository from '../repositories/recruteur.repository';
import { Recruteur } from '../../domain/recruteur.domain';
import { ListerRecruteurs } from '../../use_case/recruteur.lister';
import { CreerRecruteur } from '../../use_case/recruteur.creer';
import { TrouverRecruteur } from '../../use_case/recruteur.trouver';
import { MettreAJourRecruteur } from '../../use_case/recruteur.mettreajour';
import { SupprimerRecruteur } from '../../use_case/recruteur.supprimer';

export default class RecruteurController {
  creerRecruteur: CreerRecruteur = new CreerRecruteur(recruteurRepository);
  listerRecruteur: ListerRecruteurs = new ListerRecruteurs(recruteurRepository);
  trouverRecruteur: TrouverRecruteur = new TrouverRecruteur(recruteurRepository);
  majRecruteur: MettreAJourRecruteur = new MettreAJourRecruteur(recruteurRepository);
  supprimerRecruteur: SupprimerRecruteur = new SupprimerRecruteur(recruteurRepository);
  supprimerTousLesRecruteurs: SupprimerTousLesRecruteurs = new SupprimerTousLesRecruteurs(recruteurRepository);
  async create(req: Request, res: Response) {
    try {
      const recruteur: Recruteur = req.body;
      const resultat = await this.creerRecruteur.execute(recruteur);

      if (resultat.code === 'ok') {
        res.status(201).send(resultat.recruteur);
        return;
      }

      res.status(400).send(resultat.message);
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while creating recruteurs."
      });
    }
  }

  async findAll(req: Request, res: Response) {
    const langage = typeof req.query.langage === "string" ? req.query.langage : "";

    try {
      const recruteurs = await this.listerRecruteur.execute({ email: langage });

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
      const recruteur = await this.trouverRecruteur.execute(id);

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
      const num = await this.majRecruteur.execute(recruteur);

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
      const num = await this.supprimerRecruteur.execute(id);

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
      const num = await this.supprimerTousLesRecruteurs.execute();

      res.status(204).send({ message: `${num} Recruteurs were deleted successfully!` });
    } catch (err) {
      res.status(500).send({
        message: "Some error occurred while removing all recruteurs."
      });
    }
  }
}
