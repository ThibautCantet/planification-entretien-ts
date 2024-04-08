import notificationService from './notification.service';
import { IEntretienRepository } from './ientretien.repository';
import { Entretien } from '../domain/entretien.domain';
import { IRecruteurRepository } from './irecruteur.repository';
import { ICandidatRepository } from './icandidat.repository';

export enum Creation {
    HORAIRE,
    CANDIDAT_PAS_TROUVE,
    RECRUTEUR_PAS_TROUVE,
    PAS_COMPATIBLE,
    OK,
}

export class CreerEntretien {

    constructor(private readonly entretienRepository: IEntretienRepository,
                private readonly recruteurRepository: IRecruteurRepository,
                private readonly candidatRepository: ICandidatRepository) {
    }

    async execute(entretien: Entretien, disponibiliteRecruteur: string, horaire: string) {
        if (disponibiliteRecruteur != horaire) {
            return {
                code: Creation.HORAIRE,
                message: "Pas les mêmes horaires!"
            };
        }

        const recruteur = await this.recruteurRepository.retrieveById(entretien.recruteurId);
        const candidat = await this.candidatRepository.retrieveById(entretien.candidatId);

        if (!candidat) {
            return {
                code: Creation.CANDIDAT_PAS_TROUVE,
                message: `Cannot create Entretien with candidat id=${entretien.candidatId}.`
            };
        }

        if (!recruteur) {
            return {
                code: Creation.RECRUTEUR_PAS_TROUVE,
                message: `Cannot create Entretien with recruteur id=${entretien.recruteurId}.`
            };
        }

        if (recruteur.langage && candidat?.langage && recruteur.langage != candidat.langage) {
            return {
                code: Creation.PAS_COMPATIBLE,
                message: "Pas la même techno"
            };
        }

        if (recruteur?.xp && candidat?.xp && recruteur.xp < candidat.xp) {
            return {
                code: Creation.PAS_COMPATIBLE,
                message: "Recruteur trop jeune"
            };
        }

        const savedEntretien = await this.entretienRepository.save(entretien);

        await notificationService.envoyerEmailDeConfirmationAuCandidat(candidat?.email || '');
        await notificationService.envoyerEmailDeConfirmationAuRecruteur(recruteur?.email || '');

        return {
            code: Creation.OK,
            entretien: savedEntretien
        };
    }
}
