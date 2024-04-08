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
}
