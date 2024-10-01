import { Candidat } from '../domain/candidat.domain';

export interface ICandidatRepository {
    save(candidat: Candidat): Promise<Candidat>;

    retrieveAll(searchParams: { email?: string }): Promise<Candidat[]>;

    retrieveById(candidatId: String): Promise<Candidat | null>;

    update(candidat: Candidat): Promise<number>;

    delete(candidatId: String): Promise<number>;

    deleteAll(): Promise<number>;
}
