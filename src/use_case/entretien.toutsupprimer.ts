import { IEntretienRepository } from './ientretien.repository';

export class SupprimerTousLesEntretiens {

    constructor(private readonly entretienRepository: IEntretienRepository) {
    }

    async execute(): Promise<number> {
        return await this.entretienRepository.deleteAll();
    }
}
