
export class Candidat {
    constructor(id: String, langage: string, email: string, xp: number) {
        this.id = id;
        this.langage = langage;
        this.email = email;
        this.xp = xp;
    }

    id: String;
    langage: string;
    email: string;
    xp: number;
}
