import { Candidat } from '../domain/candidat.domain';
import { ICandidatRepository } from './icandidat.repository';

export class CreerCandidat {

    constructor(private readonly candidatRepository: ICandidatRepository) {
    }

    async execute(candidat: Candidat) {
        let isEmailValid: boolean;

        const regexp: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        isEmailValid = regexp.test(candidat.email);

        if (!candidat.langage || !candidat.xp || candidat.xp < 0 || !candidat.email || !isEmailValid) {
            return {
                code: 'invalid',
                message: 'Content can not be empty!'
            };
        }

        const savedCandidat = await this.candidatRepository.save(candidat);

        return {
            code: 'ok',
            candidat: savedCandidat
        };
    }
}
