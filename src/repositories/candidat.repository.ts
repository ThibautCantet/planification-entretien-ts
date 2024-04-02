import { Op } from "sequelize";
import Candidat from '../models/candidat.model';
import { TrainBookingResult } from './train-booking.result';
import { Result } from './result';

export interface ITutorialRepository {
  save(candidat: Candidat): Promise<Candidat>;
  retrieveAll(searchParams: {email: string}): Promise<Candidat[]>;
  retrieveById(tutorialId: number): Promise<Candidat | null>;
  update(candidat: Candidat): Promise<number>;
  delete(tutorialId: number): Promise<number>;
  deleteAll(): Promise<number>;
}

interface SearchCondition {
  [key: string]: any;
}

export class CandidatRepository implements ITutorialRepository {
  async save(candidat: Candidat): Promise<Candidat> {
    try {
      return await Candidat.create({
        title: candidat.langage,
        description: candidat.email,
        published: candidat.xp
      });
    } catch (err) {
      throw new Error("Failed to create Tutorial!");
    }
  }

  async retrieveAll(searchParams: {email?: string}): Promise<Candidat[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email)
        condition.email = { [Op.iLike]: `%${searchParams.email}%` };

      return await Candidat.findAll({ where: condition });
    } catch (error) {
      throw new Error("Failed to retrieve Tutorials!");
    }
  }

  async retrieveById(tutorialId: number): Promise<Candidat | null> {
    try {
      return await Candidat.findByPk(tutorialId);
    } catch (error) {
      throw new Error("Failed to retrieve Tutorials!");
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
      throw new Error("Failed to update Tutorial!");
    }
  }

  async delete(tutorialId: number): Promise<number> {
    try {
      const affectedRows = await Candidat.destroy({ where: { id: tutorialId } });

      return affectedRows;
    } catch (error) {
      throw new Error("Failed to delete Tutorial!");
    }
  }

  async deleteAll(): Promise<number> {
    try {
      return Candidat.destroy({
        where: {},
        truncate: false
      });
    } catch (error) {
      throw new Error("Failed to delete Tutorials!");
    }
  }
}

export default new CandidatRepository();
