import { INotificationService } from './inotification.service';
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
                private readonly candidatRepository: ICandidatRepository,
                private readonly notification: INotificationService) {
    }

    async execute(entretien: Entretien, disponibiliteRecruteur: string, horaire: string) {
        if (disponibiliteRecruteur != horaire) {
            return {
                code: Creation.HORAIRE,
                message: "Pas les mêmes horaires!"
            };
        }

        const recruteur = await this.recruteurRepository.retrieveById(entretien.recruteurId);
        const candidat = await this.candidatRepository.retrieveById(entretien.candidatId.toString());

        if (!candidat) {
            console.log(`Cannot create Entretien with candidat id=${entretien.candidatId}. Candidat not found.`);
            return {
                code: Creation.CANDIDAT_PAS_TROUVE,
                message: `Cannot create Entretien with candidat id=${entretien.candidatId}.`
            };
        }

        if (!recruteur) {
            console.log(`Cannot create Entretien with recruteur id=${entretien.recruteurId}. Recruteur not found.`);
            return {
                code: Creation.RECRUTEUR_PAS_TROUVE,
                message: `Cannot create Entretien with recruteur id=${entretien.recruteurId}.`
            };
        }

        const e = new Entretien(0, candidat, recruteur, horaire);
        const resultat = e.planifier(candidat, recruteur);
        if (resultat.code != Creation.OK) {
            return resultat
        }

        const savedEntretien = await this.entretienRepository.save(entretien);

        await this.notification.envoyerEmailDeConfirmationAuCandidat(candidat?.email || '');
        await this.notification.envoyerEmailDeConfirmationAuRecruteur(recruteur?.email || '');

        return {
            code: Creation.OK,
            entretien: savedEntretien
        };
    }
}
