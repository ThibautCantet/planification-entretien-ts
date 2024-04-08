import { IRecruteurRepository } from './irecruteur.repository';
import { Recruteur } from '../domain/recruteur.domain';

export class RecruteurService {
    constructor(private readonly recruteurRepository: IRecruteurRepository) {
    }

    async save(recruteur: Recruteur) {
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

    async retrieveAll(searchParams: { email?: string }): Promise<Recruteur[]> {
        return await this.recruteurRepository.retrieveAll(searchParams);
    }

    async retrieveById(recruteurId: number): Promise<Recruteur | null> {
        return await this.recruteurRepository.retrieveById(recruteurId);
    }

    async update(recruteur: Recruteur): Promise<number> {
        return await this.recruteurRepository.update(recruteur);
    }

    async delete(recruteurId: number): Promise<number> {
        return await this.recruteurRepository.delete(recruteurId);
    }

    async deleteAll(): Promise<number> {
        return await this.recruteurRepository.deleteAll();
    }
}
