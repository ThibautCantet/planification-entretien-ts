import { Recruteur } from './recruteur.domain';
import { Candidat } from './candidat.domain';
import { Creation } from '../use_case/entretien.creer';

export class Entretien {
    constructor(id: number,
                horaire: string,
                candidatId: number,
                recruteurId: number) {
        this.id = id;
        this.horaire = horaire;
        this.candidatId = candidatId;
        this.recruteurId = recruteurId;
    }

    id: number;
    horaire: string;
    candidatId: number;
    recruteurId: number;

    planifier(candidat: Candidat, recruteur: Recruteur): any {
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

        return {
            code: Creation.OK,
            message: "Entretien planifié"
        }
    }
}
