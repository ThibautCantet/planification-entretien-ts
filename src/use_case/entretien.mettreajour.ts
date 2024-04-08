import { Entretien } from '../domain/entretien.domain';
import { IEntretienRepository } from './ientretien.repository';

export class MettreAJourEntretien {

    constructor(private readonly entretienRepository: IEntretienRepository) {
    }

    async execute(entretien: Entretien): Promise<number> {
        return await this.entretienRepository.update(entretien);
    }
}
