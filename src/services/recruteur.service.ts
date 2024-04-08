import Recruteur from '../models/recruteur.model';
import recruteurRepository from '../repositories/recruteur.repository';
import { Request, Response } from 'express';

class RecruteurService {

    async save(req: Request, res: Response) {
        let isEmailValid: boolean;

        const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        isEmailValid = regexp.test(req.body.email);

        if (!req.body.langage || !req.body.xp || req.body.xp < 0 || !req.body.email || !isEmailValid) {
            res.status(400).send({
                message: 'Content can not be empty!'
            });
            return;
        }

        const recruteur: Recruteur = req.body;

        const savedRecruteur = await recruteurRepository.save(recruteur);

        res.status(201).send(savedRecruteur);
    }

    async retrieveAll(searchParams: { email?: string }): Promise<Recruteur[]> {
        return await recruteurRepository.retrieveAll(searchParams);
    }

    async retrieveById(recruteurId: number): Promise<Recruteur | null> {
        return await recruteurRepository.retrieveById(recruteurId);
    }

    async update(recruteur: Recruteur): Promise<number> {
        return await recruteurRepository.update(recruteur);
    }

    async delete(recruteurId: number): Promise<number> {
        return await recruteurRepository.delete(recruteurId);
    }

    async deleteAll(): Promise<number> {
        return await recruteurRepository.deleteAll();
    }
}

export default new RecruteurService();
