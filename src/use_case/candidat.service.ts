import { Candidat } from '../domain/candidat.domain';
import { ICandidatRepository } from './icandidat.repository';

export class CandidatService {

    constructor(private readonly candidatRepository: ICandidatRepository) {
    }

    async save(candidat: Candidat) {
        let isEmailValid: boolean;

        const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        isEmailValid = regexp.test(candidat.email);

        if (!candidat.langage || !candidat.xp || candidat.xp < 0 || !candidat.email || !isEmailValid) {
            return {
                code: 'invalid',
                message: 'Content can not be empty!'
            };
        }

        const savedCandidat = await this.candidatRepository.save(candidat);

        return {
            code: 'ok',
            candidat: savedCandidat
        };
    }

    async retrieveAll(searchParams: { email?: string }): Promise<Candidat[]> {
        return await this.candidatRepository.retrieveAll(searchParams);
    }

    async retrieveById(candidatId: number): Promise<Candidat | null> {
        return await this.candidatRepository.retrieveById(candidatId);
    }

    async update(candidat: Candidat): Promise<number> {
        return await this.candidatRepository.update(candidat);
    }

    async delete(candidatId: number): Promise<number> {
        return await this.candidatRepository.delete(candidatId);
    }

    async deleteAll(): Promise<number> {
        return await this.candidatRepository.deleteAll();
    }
}
