import { Op } from 'sequelize';
import SqlCandidat from '../models/candidat.model';
import { Candidat } from '../../domain/candidat.domain';
import { ICandidatRepository } from '../../use_case/icandidat.repository';

interface SearchCondition {
  [key: string]: any;
}

class SQLCandidatRepository implements ICandidatRepository {
  async save(candidat: Candidat): Promise<Candidat> {
    try {
      const { id } =  await SqlCandidat.create({
        title: candidat.langage,
        description: candidat.email,
        published: candidat.xp
      });
      return new Candidat(id || 0, candidat.langage, candidat.email, candidat.xp);
    } catch (err) {
      throw new Error('Failed to create Candidat!');
    }
  }

  async retrieveAll(searchParams: { email?: string }): Promise<Candidat[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email)
        condition.email = {[Op.iLike]: `%${searchParams.email}%`};

      let candidats = [];
      const sqlCandidats = await SqlCandidat.findAll<SqlCandidat>({where: condition});
      for (let i = 0; i < sqlCandidats.length; i++) {
        candidats.push(new Candidat(sqlCandidats[i].id || 0, sqlCandidats[i].langage || '', sqlCandidats[i].email || '', sqlCandidats[i].xp || 0));
      }
      return Promise.resolve(candidats);
    } catch (error) {
      throw new Error('Failed to retrieve Candidats!');
    }
  }

  async retrieveById(candidatId: number): Promise<Candidat | null> {
    try {
      let condition: SearchCondition = {};
      condition.id = {[Op.eq]: candidatId};
      const candidat = await SqlCandidat.findOne({where: condition});
      if (candidat) {
        return new Candidat(candidat?.id || 0, candidat?.langage || "", candidat?.email || "", candidat?.xp || 0);
      }
      return null;
    } catch (error) {
      throw new Error('Failed to retrieve Candidats!');
    }
  }

  async update(candidat: Candidat): Promise<number> {
    const {id, langage, email, xp} = candidat;

    try {
      const affectedRows = await SqlCandidat.update(
          {langage: langage, email: email, xp: xp},
          {where: {id: id}}
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error('Failed to update Candidat!');
    }
  }

  async delete(candidatId: number): Promise<number> {
    try {
      const affectedRows = await SqlCandidat.destroy({where: {id: candidatId}});

      return affectedRows;
    } catch (error) {
      throw new Error('Failed to delete Candidat!');
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return SqlCandidat.destroy({
        where: {},
        truncate: false
      });
    } catch (error) {
      throw new Error('Failed to delete Candidats!');
    }
  }
}

export default new SQLCandidatRepository();
