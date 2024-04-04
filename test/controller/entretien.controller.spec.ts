import { app } from '../../src/server';

const request = require('supertest');
import entretienRepository from '../../src/repositories/entretien.repository';
import Entretien from '../../src/models/entretien.model';
import Candidat from '../../src/models/candidat.model';
import Recruteur from '../../src/models/recruteur.model';
import candidatRepository from '../../src/repositories/candidat.repository';
import recruteurRepository from '../../src/repositories/recruteur.repository';

describe('Entretien', () => {

    let candidatId: number | undefined;
    let recruteurId: number | undefined;
    let autreLangageRecruteurId: number | undefined;
    let tropJeuneRecruteurId: number | undefined;

    beforeAll(async () => {
        const candidat = await Candidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        candidatId = candidat.id;

        const recruteur = await Recruteur.create({langage: 'java', email: 'recruteur@mail.com', xp: 5});
        recruteurId = recruteur.id;

        const autreLangageRecruteur = await Recruteur.create({
            langage: 'C#',
            email: 'autreLangageRecruteur@mail.com',
            xp: 5
        });
        autreLangageRecruteurId = autreLangageRecruteur.id;

        const tropJeunerecruteur = await Recruteur.create({
            langage: 'java',
            email: 'tropJeuneRecruteurId@mail.com',
            xp: 1
        });
        tropJeuneRecruteurId = tropJeunerecruteur.id;
    });

    afterAll(async () => {
        await candidatRepository.deleteAll();
        await recruteurRepository.deleteAll();
        await entretienRepository.deleteAll();
    });

    beforeEach(async () => {
        await entretienRepository.deleteAll();
    });

    it('Un entretien est crée quand toutes ses informations sont complètes', async () => {
        const candidat = await Candidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const localCandidatId = candidat.id;

        const recruteur = await Recruteur.create({langage: 'java', email: 'recruteur@mail.com', xp: 5});
        const localRecruteurId = recruteur.id;

        // when
        const response = await request(app)
            .post('/api/entretien')
            .send({
                candidatId: localCandidatId,
                recruteurId: localRecruteurId,
                horaire: '2024-05-31T18:00:00.000Z',
                disponibiliteRecruteur: '2024-05-31T18:00:00.000Z'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(201);

        const entretien = await entretienRepository.retrieveById(response.body.id);
        expect(entretien).not.toBeNull();
    });

    it('Recruteur ne peut pas tester le candidat car les dates ne correspondent pas', async () => {
        // when
        const response = await request(app)
            .post('/api/entretien')
            .send({
                candidatId: candidatId,
                recruteurId: recruteurId,
                horaire: '2024-05-31T18:00:00.000Z',
                disponibiliteRecruteur: '2024-05-30T18:00:00.000Z'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const entretiens = await entretienRepository.retrieveAll();
        expect(entretiens.length).toBe(0);
    });

    it('Recruteur ne peut pas tester le candidat car les techno ne correspondent pas', async () => {
        // when
        const response = await request(app)
            .post('/api/entretien')
            .send({
                candidatId: candidatId,
                recruteurId: autreLangageRecruteurId,
                horaire: '2024-05-31T18:00:00.000Z',
                disponibiliteRecruteur: '2024-05-31T18:00:00.000Z'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const entretiens = await entretienRepository.retrieveAll();
        expect(entretiens.length).toBe(0);
    });

    it('Recruteur ne peut pas tester le candidat car le recruteur est moins expérimenté', async () => {
        // when
        const response = await request(app)
            .post('/api/entretien')
            .send({
                candidatId: candidatId,
                recruteurId: tropJeuneRecruteurId,
                horaire: '2024-05-31T18:00:00.000Z',
                disponibiliteRecruteur: '2024-05-31T18:00:00.000Z'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const entretiens = await entretienRepository.retrieveAll();
        expect(entretiens.length).toBe(0);
    });

    it('Impossible de créer un entretien quand le candidat n existe pas', async () => {
        // when
        const response = await request(app)
            .post('/api/entretien')
            .send({
                candidatId: -42,
                recruteurId: recruteurId,
                horaire: '2024-05-31T18:00:00.000Z',
                disponibiliteRecruteur: '2024-05-31T18:00:00.000Z'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const entretiens = await entretienRepository.retrieveAll();
        expect(entretiens.length).toBe(0);
    });

    it('Impossible de créer un entretien quand le recruteur n existe pas', async () => {
        // when
        const response = await request(app)
            .post('/api/entretien')
            .send({
                candidatId: candidatId,
                recruteurId: -42,
                horaire: '2024-05-31T18:00:00.000Z',
                disponibiliteRecruteur: '2024-05-31T18:00:00.000Z'
            })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(400);

        const entretiens = await entretienRepository.retrieveAll();
        expect(entretiens.length).toBe(0);
    });

    it('Retourne tous les entretiens', async () => {
        // given
        await Entretien.create({
            candidatId: candidatId,
            recruteurId: recruteurId,
            horaire: '2024-05-31T18:00:00.000Z'
        });

        // when
        const response = await request(app)
            .get('/api/entretien');

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body[0].candidatId).toEqual(candidatId);
        expect(response.body[0].recruteurId).toEqual(recruteurId);
        expect(response.body[0].horaire).toEqual('2024-05-31T18:00:00.000Z');
    });

    it("Trouve un entretien existant", async () => {
        // given
        const {id} = await Entretien.create({
            candidatId: candidatId,
            recruteurId: recruteurId,
            horaire: '2024-05-31T18:00:00.000Z'
        });

        // when
        const response = await request(app)
            .get('/api/entretien/' + id);

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body.candidatId).toEqual(candidatId);
        expect(response.body.recruteurId).toEqual(recruteurId);
        expect(response.body.horaire).toEqual('2024-05-31T18:00:00.000Z');
    });

    it("Ne trouve pas un entretien inexistant", async () => {
        // when
        const response = await request(app)
            .get('/api/entretien/-42');

        // then
        expect(response.statusCode).toBe(404);
    });

    it("Supprime un entretien existant", async () => {
        // given
        const {id} = await Entretien.create({
            candidatId: candidatId,
            recruteurId: recruteurId,
            horaire: '2024-05-31T18:00:00.000Z'
        });

        // when
        const response = await request(app)
            .delete('/api/entretien/' + id);

        // then
        expect(response.statusCode).toBe(204);

        const entretien = await entretienRepository.retrieveById(id || 0);
        expect(entretien).toBe(null);
    });

    it("Ne supprime pas un entretien inexistant", async () => {
        // when
        const response = await request(app)
            .delete('/api/entretien/-42');

        // then
        expect(response.statusCode).toBe(404);
    });

    it("Met à jour un entretien existant", async () => {
        // given
        const {id} = await Entretien.create({
            candidatId: candidatId,
            recruteurId: recruteurId,
            horaire: '2024-05-31T18:00:00.000Z'
        });

        // when
        const response = await request(app)
            .put('/api/entretien/' + id)
            .send({horaire: '2024-05-30T18:00:00.000Z'})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(204);

        const entretien = await entretienRepository.retrieveById(id || 0);
        expect(entretien?.horaire).toBe('2024-05-30T18:00:00.000Z');
    });

    it("Ne met pas à jour un entretien inexistant", async () => {
        // when
        const response = await request(app)
            .put('/api/entretien/-42')
            .send({horaire: '2024-05-30T18:00:00.000Z'})
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');

        // then
        expect(response.statusCode).toBe(404);
    });

    it("Retourne tous les entretiens", async () => {
        // given
        await Entretien.create({
            candidatId: candidatId,
            recruteurId: recruteurId,
            horaire: '2024-05-31T18:00:00.000Z'
        });

        // when
        const response = await request(app)
            .get('/api/entretien');

        // then
        expect(response.statusCode).toBe(200);
        expect(response.body[0].candidatId).toEqual(candidatId);
        expect(response.body[0].recruteurId).toEqual(recruteurId);
        expect(response.body[0].horaire).toEqual('2024-05-31T18:00:00.000Z');
    });

    it("Supprime tous les entretiens", async () => {
        // given
        await Entretien.create({
            candidatId: candidatId,
            recruteurId: recruteurId,
            horaire: '2024-05-31T18:00:00.000Z'
        });

        // when
        const response = await request(app)
            .delete('/api/entretien');

        // then
        expect(response.statusCode).toBe(204);
        const entretiens = await entretienRepository.retrieveAll();
        expect(entretiens.length).toBe(0);
    });
});
