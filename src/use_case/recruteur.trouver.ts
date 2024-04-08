import { IRecruteurRepository } from './irecruteur.repository';
import { Recruteur } from '../domain/recruteur.domain';

export class TrouverRecruteur {
    constructor(private readonly recruteurRepository: IRecruteurRepository) {
    }

    async execute(recruteurId: number): Promise<Recruteur | null> {
        return await this.recruteurRepository.retrieveById(recruteurId);
    }
}
