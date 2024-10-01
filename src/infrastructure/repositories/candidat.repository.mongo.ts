import { Candidat } from '../../domain/candidat.domain';
import { ICandidatRepository } from '../../use_case/icandidat.repository';
import { CandidatModel } from '../../index';

interface SearchCondition {
  [key: string]: any;
}

class MongoCandidatRepository implements ICandidatRepository {
  async save(candidat: Candidat): Promise<Candidat> {
    try {
      const saved = await new CandidatModel({
        langage: candidat.langage,
        email: candidat.email,
        xp: candidat.xp
      })
          .save();
      return new Candidat(saved.id, candidat.langage, candidat.email, candidat.xp);
    } catch (err) {
      throw new Error('Failed to create Candidat!');
    }
  }

  async retrieveAll(searchParams: { email?: string }): Promise<Candidat[]> {
    try {
      let condition: SearchCondition = {};

      if (searchParams?.email)
        condition.email = searchParams.email;

      return await CandidatModel.find(condition);
    } catch (error) {
      throw new Error('Failed to retrieve Candidats!');
    }
  }

  async retrieveById(candidatId: String): Promise<Candidat | null> {
    try {
      return await CandidatModel.findById(candidatId);
    } catch (error) {
      throw new Error('Failed to retrieve Candidats!');
    }
  }

  async update(candidat: Candidat): Promise<number> {
    try {
      const result = await CandidatModel.findByIdAndUpdate(candidat.id, {
        langage: candidat.langage,
        xp: candidat.xp, });
      return result ? 1 : 0;
    } catch (error) {
      throw new Error('Failed to update Candidat!');
    }
  }

  async delete(candidatId: String): Promise<number> {
    try {
      const affectedRows = await CandidatModel.deleteOne({ _id: candidatId});
      return affectedRows.deletedCount || 0;
    } catch (error) {
      throw new Error('Failed to delete Candidat!');
    }
  }

  async deleteAll(): Promise<number> {
    try {
        const res = await CandidatModel.deleteMany({});
        return res.deletedCount || 0;
    } catch (error) {
      throw new Error('Failed to delete Candidats!');
    }
  }
}

export default new MongoCandidatRepository();
