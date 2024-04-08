import { Candidat } from '../domain/candidat.domain';
import { ICandidatRepository } from './icandidat.repository';

export class TrouverCandidat {

    constructor(private readonly candidatRepository: ICandidatRepository) {
    }

    async execute(candidatId: number): Promise<Candidat | null> {
        return await this.candidatRepository.retrieveById(candidatId);
    }
}