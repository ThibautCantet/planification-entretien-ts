import { Candidat } from '../domain/candidat.domain';
import { ICandidatRepository } from './icandidat.repository';

export class ListerCandidats {

    constructor(private readonly candidatRepository: ICandidatRepository) {
    }

    async execute(searchParams: { email?: string }): Promise<Candidat[]> {
        return await this.candidatRepository.retrieveAll(searchParams);
    }
}
