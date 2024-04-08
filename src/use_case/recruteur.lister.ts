import { IRecruteurRepository } from './irecruteur.repository';
import { Recruteur } from '../domain/recruteur.domain';

export class ListerRecruteurs {
    constructor(private readonly recruteurRepository: IRecruteurRepository) {
    }

    async execute(searchParams: { email?: string }): Promise<Recruteur[]> {
        return await this.recruteurRepository.retrieveAll(searchParams);
    }
}
