import { IEntretienRepository } from './ientretien.repository';
import { Entretien } from '../domain/entretien.domain';

export class ListerEntretien {

    constructor(private readonly entretienRepository: IEntretienRepository) {
    }

    async execute(): Promise<Entretien[]> {
        return await this.entretienRepository.retrieveAll();
    }
}
