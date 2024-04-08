import { IEntretienRepository } from './ientretien.repository';

export class SupprimerEntretien {

    constructor(private readonly entretienRepository: IEntretienRepository) {
    }

    async execute(entretienId: number): Promise<number> {
        return await this.entretienRepository.delete(entretienId);
    }
}
