import SqlEntretien from '../models/entretien.model';
import { IEntretienRepository } from '../../use_case/ientretien.repository';
import { Entretien } from '../../domain/entretien.domain';
import candidatRepository from './candidat.repository';
import recruteurRepository from './recruteur.repository';

class EntretienRepository implements IEntretienRepository {
  async save(entretien: Entretien): Promise<Entretien> {
    try {
      const { id } = await SqlEntretien.create({
        candidatId: entretien.candidatId,
        recruteurId: entretien.recruteurId,
        horaire: entretien.horaire
      });
      const candidat = await candidatRepository.retrieveById(entretien.candidatId);
      if (!candidat) {
        throw new Error('Cannot create Entretien with candidat id=${entretien.candidatId}. Candidat not found.');
      }
      const recruteur = await recruteurRepository.retrieveById(entretien.recruteurId);
      if (!recruteur) {
        throw new Error('Cannot create Entretien with recruteur id=${entretien.recruteurId}. Recruteur not found.');
      }
      return new Entretien(id || 0, candidat, recruteur, entretien.horaire);
    } catch (err) {
      throw new Error('Failed to create Entretien!');
    }
  }

  async retrieveAll(): Promise<Entretien[]> {
    try {
      const sqlEntretiens = await SqlEntretien.findAll();

      let entretiens = [];
      for (let i = 0; i < sqlEntretiens.length; i++) {
        const candidat = await candidatRepository.retrieveById(sqlEntretiens[i].candidatId?.toString() || '');
        const recruteur = await recruteurRepository.retrieveById(sqlEntretiens[i].recruteurId || 0);
        if (candidat && recruteur) {
          entretiens.push(new Entretien(sqlEntretiens[i].id || 0, candidat, recruteur, sqlEntretiens[i].horaire || ''))
        }
      }
      return entretiens;
    } catch (error) {
      throw new Error('Failed to retrieve Entretiens!');
    }
  }

  async retrieveById(entretienId: number): Promise<Entretien | null> {
    try {
      const entretien = await SqlEntretien.findByPk(entretienId);
      if (entretien) {
        const candidat = await candidatRepository.retrieveById(entretien.candidatId?.toString() || '');
        const recruteur = await recruteurRepository.retrieveById(entretien.recruteurId || 0);
        if (candidat && recruteur) {
          return new Entretien(entretienId, candidat, recruteur, entretien?.horaire || '');
        }
        return null;
      }
      return null;
    } catch (error) {
      throw new Error('Failed to retrieve Entretiens!');
    }
  }

  async update(entretien: Entretien): Promise<number> {
    const {id, horaire} = entretien;

    try {
      const affectedRows = await SqlEntretien.update(
          {horaire: horaire},
          {where: {id: id}}
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error('Failed to update Entretien!');
    }
  }

  async delete(entretienId: number): Promise<number> {
    try {
      const affectedRows = await SqlEntretien.destroy({where: {id: entretienId}});

      return affectedRows;
    } catch (error) {
      throw new Error('Failed to delete Entretien!');
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return SqlEntretien.destroy({
        where: {},
        truncate: false
      });
    } catch (error) {
      throw new Error('Failed to delete Entretiens!');
    }
  }
}

export default new EntretienRepository();
