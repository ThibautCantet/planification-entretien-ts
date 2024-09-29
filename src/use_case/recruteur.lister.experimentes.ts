import { IRecruteurRepository } from './irecruteur.repository';
import { RecruteurExperimente } from '../domain/recruteur.experimente.domain';

export class ListerRecruteursExperimentes {
    constructor(private readonly recruteurRepository: IRecruteurRepository) {
    }

    async execute(): Promise<RecruteurExperimente[]> {
        return await this.recruteurRepository.retrieveAll({ xp: 10 })
            .then(recruteurs =>
                recruteurs
                    .filter(r => r.xp >= 10)
                    .map(r => new RecruteurExperimente(`${r.xp} ans de ${r.langage}`, r.email)));
    }
}
