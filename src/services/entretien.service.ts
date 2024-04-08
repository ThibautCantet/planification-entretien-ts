import recruteurRepository from '../repositories/recruteur.repository';
import candidatRepository from '../repositories/candidat.repository';
import { Request, Response } from 'express';
import Entretien from '../models/entretien.model';
import entretienRepository from '../repositories/entretien.repository';
import notificationService from './notification.service';

class EntretienService {

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

        if (recruteur.langage && candidat?.langage && recruteur.langage != candidat.langage) {
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

        const entretien: Entretien = req.body;

        const savedEntretien = await entretienRepository.save(entretien);

        await notificationService.envoyerEmailDeConfirmationAuCandidat(candidat?.email || '');
        await notificationService.envoyerEmailDeConfirmationAuRecruteur(recruteur?.email || '');

        res.status(201).send(savedEntretien);
    }

    async retrieveAll(): Promise<Entretien[]> {
        return await entretienRepository.retrieveAll();
    }
}

export default new EntretienService();
