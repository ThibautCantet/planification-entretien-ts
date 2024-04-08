import { ICandidatRepository } from './icandidat.repository';

export class SupprimerTousLesCandidats {

    constructor(private readonly candidatRepository: ICandidatRepository) {
    }

    async execute(): Promise<number> {
        return await this.candidatRepository.deleteAll();
    }
}
