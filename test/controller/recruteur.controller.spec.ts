import { app } from '../../src/server';
const request = require('supertest');
import recruteurRepository from '../../src/infrastructure/repositories/recruteur.repository';
import Recruteur from '../../src/infrastructure/models/recruteur.model';

describe("Recruteur", () => {

    beforeEach(async () => {
       await recruteurRepository.deleteAll();
    });

    afterAll(async () => {
       await recruteurRepository.deleteAll();
    });

    it("Un recruteur est crée quand toutes ses informations sont complètes", async () => {
        // when
        const response = await request(app)
            .post('/api/recruteur')
            .send({langage: "java", email: "recruteur@mail.com", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(201);

        const recruteur = await recruteurRepository.retrieveById(response.body.id);
        expect(recruteur).not.toBeNull();
    });

    it("Un recruteur n'est pas crée quand sa techno principale est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/recruteur')
            .send({email: "recruteur-techno-vide@mail.com", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const recruteurs = await recruteurRepository.retrieveAll({email:'recruteur-techno-vide@mail.com'});
        expect(recruteurs.length).toBe(0);
    });

    it("Un recruteur n'est pas crée quand son email est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/recruteur')
            .send({langage: "java", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);
    });

    it("Un recruteur n'est pas crée quand son email est incorrect", async () => {
        // when
        const response = await request(app)
            .post('/api/recruteur')
            .send({langage: "java", email: "invalid-email", xp: 5})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const recruteurs = await recruteurRepository.retrieveAll({email: 'invalid-email'});
        expect(recruteurs.length).toBe(0);
    });

    it("Un recruteur n'est pas crée quand son nombre d'années d'expérience est vide", async () => {
        // when
        const response = await request(app)
            .post('/api/recruteur')
            .send({langage: "java", email: "recruteur-annee-xp-vide@mail.com"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const recruteurs = await recruteurRepository.retrieveAll({email: 'recruteur-annee-xp-vide@mail.com'});
        expect(recruteurs.length).toBe(0);
    });

    it("Un recruteur n'est pas crée quand son nombre d'années d'expérience est négatif", async () => {
        // when
        const response = await request(app)
            .post('/api/recruteur')
            .send({langage: "java", email: "recruteur-annee-xp-negatif@mail.com", xp: -1})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const recruteurs = await recruteurRepository.retrieveAll({email: 'recruteur-annee-xp-negatif@mail.com'});
        expect(recruteurs.length).toBe(0);
    });

    it("Trouve un recruteur existant", async () => {
        // given
        const {id} = await Recruteur.create({langage: "java", email: "recruteur-existant@mail.com", xp: 5});

        // when
        const response = await request(app)
            .get('/api/recruteur/' + id);

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body.langage).toEqual("java");
        expect(response.body.email).toEqual("recruteur-existant@mail.com");
        expect(response.body.xp).toEqual(5);

        const recruteurs = await recruteurRepository.retrieveAll({email:'recruteur-existant@mail.com'});
        expect(recruteurs.length).toBe(1);
    });

    it("Ne trouve pas un recruteur inexistant", async () => {
        // when
        const response = await request(app)
            .get('/api/recruteur/-42');

        // then
        expect(response.statusCode).toBe(404);
    });

    it("Supprime un recruteur existant", async () => {
        // given
        const {id} = await Recruteur.create({langage: "java", email: "recruteur@mail.com", xp: 5});

        // when
        const response = await request(app)
            .delete('/api/recruteur/' + id);

        // then
        expect(response.statusCode).toBe(204);

        const recruteur = await recruteurRepository.retrieveById(id || 0);
        expect(recruteur).toBe(null);
    });

    it("Ne supprime pas un recruteur inexistant", async () => {
        // when
        const response = await request(app)
            .delete('/api/recruteur/-42');

        // then
        expect(response.statusCode).toBe(404);
    });

    it("Met à jour un recruteur existant", async () => {
        // given
        const {id} = await Recruteur.create({langage: "java", email: "recruteur@mail.com", xp: 5});

        // when
        const response = await request(app)
            .put('/api/recruteur/' + id)
            .send({langage: "c#"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(204);

        const recruteur = await recruteurRepository.retrieveById(id || 0);
        expect(recruteur?.langage).toBe('c#');
    });

    it("Ne met pas à jour un recruteur inexistant", async () => {
        // when
        const response = await request(app)
            .put('/api/recruteur/-42')
            .send({langage: "c#"})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(404);
    });

    it("Retourne tous les recruteurs", async () => {
        // given
        await Recruteur.create({langage: "java", email: "recruteur@mail.com", xp: 5});

        // when
        const response = await request(app)
            .get('/api/recruteur');

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body[0].langage).toEqual("java");
        expect(response.body[0].email).toEqual("recruteur@mail.com");
        expect(response.body[0].xp).toEqual(5);
    });

    it("Supprime tous les recruteurs", async () => {
        // given
        await Recruteur.create({langage: "java", email: "recruteur-a-supprimer@mail.com", xp: 5});

        // when
        const response = await request(app)
            .delete('/api/recruteur');

        // then
        expect(response.statusCode).toBe(204);
        const recruteurs = await recruteurRepository.retrieveAll({email: 'recruteur-a-supprimer@mail.com'});
        expect(recruteurs.length).toBe(0);
    });
});
