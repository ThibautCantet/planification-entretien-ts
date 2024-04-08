export class Recruteur {
    constructor(id: number, langage: string, email: string, xp: number) {
        this.id = id;
        this.langage = langage;
        this.email = email;
        this.xp = xp;
    }

    id: number;
    langage: string;
    email: string;
    xp: number;
}
