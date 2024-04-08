import SqlEntretien from '../models/entretien.model';
import { IEntretienRepository } from '../../use_case/ientretien.repository';
import { Entretien } from '../../domain/entretien.domain';

class EntretienRepository implements IEntretienRepository {
  async save(entretien: Entretien): Promise<Entretien> {
    try {
      const { id } = await SqlEntretien.create({
        candidatId: entretien.candidatId,
        recruteurId: entretien.recruteurId,
        horaire: entretien.horaire
      });
      return new Entretien(id || 0, entretien.horaire, entretien.candidatId, entretien.recruteurId);
    } catch (err) {
      throw new Error('Failed to create Entretien!');
    }
  }

  async retrieveAll(): Promise<Entretien[]> {
    try {
      const sqlEntretiens = await SqlEntretien.findAll();

      let entretiens = [];
      for (let i = 0; i < sqlEntretiens.length; i++) {
        entretiens.push(new Entretien(sqlEntretiens[i].id || 0, sqlEntretiens[i].horaire || '', sqlEntretiens[i].candidatId || 0, sqlEntretiens[i].recruteurId || 0))
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
        return new Entretien(entretienId, entretien?.horaire || '', entretien?.candidatId || 0, entretien?.recruteurId || 0);
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
