import { IRecruteurRepository } from './irecruteur.repository';
import { Recruteur } from '../domain/recruteur.domain';

export class MettreAJourRecruteur {
    constructor(private readonly recruteurRepository: IRecruteurRepository) {
    }

    async execute(recruteur: Recruteur): Promise<number> {
        return await this.recruteurRepository.update(recruteur);
    }
}
