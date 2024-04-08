import Candidat from '../models/candidat.model';
import candidatRepository from '../repositories/candidat.repository';
import { Request, Response } from 'express';

class CandidatService {

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

        const candidat: Candidat = req.body;

        const savedCandidat = await candidatRepository.save(candidat);

        res.status(201).send(savedCandidat);
    }

    async retrieveAll(searchParams: { email?: string }): Promise<Candidat[]> {
        return await candidatRepository.retrieveAll(searchParams);
    }

    async retrieveById(candidatId: number): Promise<Candidat | null> {
        return await candidatRepository.retrieveById(candidatId);
    }

    async update(candidat: Candidat): Promise<number> {
        return await candidatRepository.update(candidat);
    }

    async delete(candidatId: number): Promise<number> {
        return await candidatRepository.delete(candidatId);
    }

    async deleteAll(): Promise<number> {
        return await candidatRepository.deleteAll();
    }
}

export default new CandidatService();
