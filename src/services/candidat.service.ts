import Candidat from '../models/candidat.model';
import candidatRepository from '../repositories/candidat.repository';

class CandidatService {

    async save(candidat: Candidat): Promise<Candidat> {
        return await candidatRepository.save(candidat);
    }

    async retrieveAll(searchParams: { email?: string }): Promise<Candidat[]> {
        return await candidatRepository.retrieveAll(searchParams);
    }

    async retrieveById(candidatId: number): Promise<Candidat | null> {
        return await candidatRepository.retrieveById(candidatId);
    }

    async update(candidat: Candidat): Promise<number> {
        return await candidatRepository.update(candidat);
    }

    async delete(candidatId: number): Promise<number> {
        return await candidatRepository.delete(candidatId);
    }

    async deleteAll(): Promise<number> {
        return await candidatRepository.deleteAll();
    }
}

export default new CandidatService();
