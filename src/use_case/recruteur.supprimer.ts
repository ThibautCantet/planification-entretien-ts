import { IRecruteurRepository } from './irecruteur.repository';

export class SupprimerRecruteur {
    constructor(private readonly recruteurRepository: IRecruteurRepository) {
    }

    async execute(recruteurId: number): Promise<number> {
        return await this.recruteurRepository.delete(recruteurId);
    }
}
