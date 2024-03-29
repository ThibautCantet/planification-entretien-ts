import { Op } from "sequelize";
import Candidat from '../models/candidat.model';

interface SearchCondition {
  [key: string]: any;
}

class CandidatRepository {
  async save(candidat: Candidat): Promise<Candidat> {
    try {
      return await Candidat.create({
        title: candidat.langage,
        description: candidat.email,
        published: candidat.xp
      });
    } catch (err) {
      throw new Error("Failed to create Candidat!");
    }
  }

  async retrieveAll(searchParams: {email?: string}): Promise<Candidat[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email)
        condition.email = { [Op.iLike]: `%${searchParams.email}%` };

      return await Candidat.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Candidats!");
    }
  }

  async retrieveById(candidatId: number): Promise<Candidat | null> {
    try {
      return await Candidat.findByPk(candidatId);
    } catch (error) {
      throw new Error("Failed to retrieve Candidats!");
    }
  }

  async update(candidat: Candidat): Promise<number> {
    const { id, langage, email, xp } = candidat;

    try {
      const affectedRows = await Candidat.update(
        { langage: langage, email: email, xp: xp },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Candidat!");
    }
  }

  async delete(candidatId: number): Promise<number> {
    try {
      const affectedRows = await Candidat.destroy({ where: { id: candidatId } });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Candidat!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return Candidat.destroy({
        where: {},
        truncate: false
      });
    } catch (error) {
      throw new Error("Failed to delete Candidats!");
    }
  }
}

export default new CandidatRepository();
