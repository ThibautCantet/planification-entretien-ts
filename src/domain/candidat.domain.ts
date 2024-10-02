
export class Candidat {
    constructor(id: String, langage: string, email: string, xp: number) {
        this.id = id.toString();
        this.langage = langage;
        this.email = email;
        this.xp = xp;
    }

    id: string;
    langage: string;
    email: string;
    xp: number;
}
