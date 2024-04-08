import { Op } from "sequelize";
import Recruteur from '../models/recruteur.model';

interface SearchCondition {
  [key: string]: any;
}

class RecruteurRepository {
  async save(recruteur: Recruteur): Promise<Recruteur> {
    try {
      return await Recruteur.create({
        title: recruteur.langage,
        description: recruteur.email,
        published: recruteur.xp
      });
    } catch (err) {
      throw new Error("Failed to create Recruteur!");
    }
  }

  async retrieveAll(searchParams: {email?: string}): Promise<Recruteur[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email)
        condition.email = { [Op.iLike]: `%${searchParams.email}%` };

      return await Recruteur.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Recruteurs!");
    }
  }

  async retrieveById(recruteurId: number): Promise<Recruteur | null> {
    try {
      return await Recruteur.findByPk(recruteurId);
    } catch (error) {
      throw new Error("Failed to retrieve Recruteurs!");
    }
  }

  async update(recruteur: Recruteur): Promise<number> {
    const { id, langage, email, xp } = recruteur;

    try {
      const affectedRows = await Recruteur.update(
        { langage: langage, email: email, xp: xp },
        { where: { id: id } }
      );

      return affectedRows[0];
    } catch (error) {
      throw new Error("Failed to update Recruteur!");
    }
  }

  async delete(recruteurId: number): Promise<number> {
    try {
      const affectedRows = await Recruteur.destroy({ where: { id: recruteurId } });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Recruteur!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return Recruteur.destroy({
        where: {},
        truncate: false
      });
    } catch (error) {
      throw new Error("Failed to delete Recruteurs!");
    }
  }
}

export default new RecruteurRepository();
