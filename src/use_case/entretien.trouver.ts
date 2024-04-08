import { Entretien } from '../domain/entretien.domain';
import { IEntretienRepository } from './ientretien.repository';

export class TrouverEntretien {

    constructor(private readonly entretienRepository: IEntretienRepository) {
    }

    async execute(entretienId: number): Promise<Entretien | null> {
        return await this.entretienRepository.retrieveById(entretienId);
    }
}
