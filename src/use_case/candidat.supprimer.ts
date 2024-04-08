import { ICandidatRepository } from './icandidat.repository';

export class SupprimerCandidat {

    constructor(private readonly candidatRepository: ICandidatRepository) {
    }

    async execute(candidatId: number): Promise<number> {
        return await this.candidatRepository.delete(candidatId);
    }
}
