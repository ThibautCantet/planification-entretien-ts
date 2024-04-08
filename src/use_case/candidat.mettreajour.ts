import { Candidat } from '../domain/candidat.domain';
import { ICandidatRepository } from './icandidat.repository';

export class MettreAJourCandidat {

    constructor(private readonly candidatRepository: ICandidatRepository) {
    }

    async execute(candidat: Candidat): Promise<number> {
        return await this.candidatRepository.update(candidat);
    }
}
