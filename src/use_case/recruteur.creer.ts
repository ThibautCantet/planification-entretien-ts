import { IRecruteurRepository } from './irecruteur.repository';
import { Recruteur } from '../domain/recruteur.domain';

export class CreerRecruteur {
    constructor(private readonly recruteurRepository: IRecruteurRepository) {
    }

    async execute(recruteur: Recruteur) {
        let isEmailValid: boolean;

        const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        isEmailValid = regexp.test(recruteur.email);

        if (!recruteur.langage || !recruteur.xp || recruteur.xp < 0 || !recruteur.email || !isEmailValid) {
            return {
                code: 'invalid',
                message: 'Content can not be empty!'
            };
        }

        const savedRecruteur = await this.recruteurRepository.save(recruteur);

        return {
            code: 'ok',
            recruteur: savedRecruteur
        };
    }
}
