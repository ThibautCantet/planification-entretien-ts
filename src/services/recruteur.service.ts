import Recruteur from '../models/recruteur.model';
import recruteurRepository from '../repositories/recruteur.repository';

class RecruteurService {

    async save(recruteur: Recruteur): Promise<Recruteur> {
        return await recruteurRepository.save(recruteur);
    }

    async retrieveAll(searchParams: { email?: string }): Promise<Recruteur[]> {
        return await recruteurRepository.retrieveAll(searchParams);
    }

    async retrieveById(recruteurId: number): Promise<Recruteur | null> {
        return await recruteurRepository.retrieveById(recruteurId);
    }

    async update(recruteur: Recruteur): Promise<number> {
        return await recruteurRepository.update(recruteur);
    }

    async delete(recruteurId: number): Promise<number> {
        return await recruteurRepository.delete(recruteurId);
    }

    async deleteAll(): Promise<number> {
        return await recruteurRepository.deleteAll();
    }
}

export default new RecruteurService();
