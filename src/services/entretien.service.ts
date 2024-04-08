import Entretien from '../models/entretien.model';
import recruteurRepository from '../repositories/entretien.repository';

class EntretienService {

    async save(entretien: Entretien): Promise<Entretien> {
        return await recruteurRepository.save(entretien);
    }

    async retrieveAll(): Promise<Entretien[]> {
        return await recruteurRepository.retrieveAll();
    }

    async retrieveById(recruteurId: number): Promise<Entretien | null> {
        return await recruteurRepository.retrieveById(recruteurId);
    }

    async update(entretien: Entretien): Promise<number> {
        return await recruteurRepository.update(entretien);
    }

    async delete(recruteurId: number): Promise<number> {
        return await recruteurRepository.delete(recruteurId);
    }

    async deleteAll(): Promise<number> {
        return await recruteurRepository.deleteAll();
    }
}

export default new EntretienService();
