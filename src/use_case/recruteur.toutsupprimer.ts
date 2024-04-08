import { IRecruteurRepository } from './irecruteur.repository';

export class SupprimerTousLesRecruteurs {
    constructor(private readonly recruteurRepository: IRecruteurRepository) {
    }

    async execute(): Promise<number> {
        return await this.recruteurRepository.deleteAll();
    }
}
