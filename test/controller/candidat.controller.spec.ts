import { app } from '../../src/server';
const request = require('supertest');
import candidatRepository from '../../src/repositories/candidat.repository';
import Candidat from '../../src/models/candidat.model';

describe("Candidat", () => {

    beforeEach(() => {
       candidatRepository.deleteAll();
    });

    it("Un candidat est crée quand toutes ses informations sont complètes", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", email: "candidat@mail.com", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(201);

        const candidats = await candidatRepository.retrieveAll({});
        expect(candidats.length).toBe(1);
    });

    it("Un candidat n'est pas crée quand sa techno principale est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({email: "candidat@mail.com", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const candidats = await candidatRepository.retrieveAll({});
        expect(candidats.length).toBe(0);
    });

    it("Un candidat n'est pas crée quand son email est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const candidats = await candidatRepository.retrieveAll({});
        expect(candidats.length).toBe(0);
    });

    it("Un candidat n'est pas crée quand son email est incorrect", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", email: "invalid-email", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const candidats = await candidatRepository.retrieveAll({});
        expect(candidats.length).toBe(0);
    });

    it("Un candidat n'est pas crée quand son nombre d'années d'expérience est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", email: "candidat@mail.com"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const candidats = await candidatRepository.retrieveAll({});
        expect(candidats.length).toBe(0);
    });

    it("Un candidat n'est pas crée quand son nombre d'années d'expérience est négatif", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", email: "candidat@mail.com", xp: -1})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const candidats = await candidatRepository.retrieveAll({});
        expect(candidats.length).toBe(0);
    });

    it("Un candidat n'est pas crée quand son email est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/candidat')
            .send({langage: "java", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const candidats = await candidatRepository.retrieveAll({});
        expect(candidats.length).toBe(0);
    });

    it("Retourne tous les candidats", async () => {
        // given
        await Candidat.create({langage: "java", email: "candidat@mail.com", xp: 5});

        // when
        const response = await request(app)
            .get('/api/candidat');

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body[0].langage).toEqual("java");
        expect(response.body[0].email).toEqual("candidat@mail.com");
        expect(response.body[0].xp).toEqual(5);
    });
});
