import { Op } from 'sequelize';
import SqlRecruteur from '../models/recruteur.model';
import { IRecruteurRepository } from '../../use_case/irecruteur.repository';
import { Recruteur } from '../../domain/recruteur.domain';

interface SearchCondition {
  [key: string]: any;
}

class RecruteurRepository implements IRecruteurRepository {
  async save(recruteur: Recruteur): Promise<Recruteur> {
    try {
      const { id } = await SqlRecruteur.create({
        title: recruteur.langage,
        description: recruteur.email,
        published: recruteur.xp
      });
      return new Recruteur(id || 0, recruteur.langage || '', recruteur.email || '', recruteur.xp || 0);
    } catch (err) {
      throw new Error('Failed to create Recruteur!');
    }
  }

  async retrieveAll(searchParams: { email?: string, xp?: number }): Promise<Recruteur[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email)
        condition.email = {[Op.iLike]: `%${searchParams.email}%`};

      if (searchParams?.xp) {
        condition.xp >= {[Op.gt]: searchParams.xp }
      }

      const sqlRecruteurs = await SqlRecruteur.findAll({where: condition});
      let recruteurs = [];
      for (let i = 0; i < sqlRecruteurs.length; i++) {
        recruteurs.push(new Recruteur(sqlRecruteurs[i].id || 0, sqlRecruteurs[i].langage || '', sqlRecruteurs[i].email || '', sqlRecruteurs[i].xp || 0));
      }
      return recruteurs;
    } catch (error) {
      throw new Error('Failed to retrieve Recruteurs!');
    }
  }

  async retrieveById(recruteurId: number): Promise<Recruteur | null> {
    try {
      const recruteur = await SqlRecruteur.findByPk(recruteurId);
      if (recruteur) {
        return new Recruteur(recruteur?.id || 0, recruteur?.langage || '', recruteur?.email || '', recruteur?.xp || 0);
      }
      return null;
    } catch (error) {
      throw new Error('Failed to retrieve Recruteurs!');
    }
  }

  async update(recruteur: Recruteur): Promise<number> {
    const {id, langage, email, xp} = recruteur;

    try {
      const affectedRows = await SqlRecruteur.update(
          {langage: langage, email: email, xp: xp},
          {where: {id: id}}
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error('Failed to update Recruteur!');
    }
  }

  async delete(recruteurId: number): Promise<number> {
    try {
      const affectedRows = await SqlRecruteur.destroy({where: {id: recruteurId}});

      return affectedRows;
    } catch (error) {
      throw new Error('Failed to delete Recruteur!');
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return SqlRecruteur.destroy({
        where: {},
        truncate: false
      });
    } catch (error) {
      throw new Error('Failed to delete Recruteurs!');
    }
  }
}

export default new RecruteurRepository();
