import { app } from '../../src/server';
import entretienRepository from '../../src/infrastructure/repositories/entretien.repository';
import SqlEntretien from '../../src/infrastructure/models/entretien.model';
import SqlCandidat from '../../src/infrastructure/models/candidat.model';
import SqlRecruteur from '../../src/infrastructure/models/recruteur.model';
import candidatRepository from '../../src/infrastructure/repositories/candidat.repository';
import recruteurRepository from '../../src/infrastructure/repositories/recruteur.repository';
import notificationService from '../../src/infrastructure/notification.service';

const request = require('supertest');

describe('Entretien', () => {
    const envoyerEmailAuCandidatMock = jest.spyOn(notificationService, 'envoyerEmailDeConfirmationAuCandidat');
    const envoyerEmailAuRecruteurMock = jest.spyOn(notificationService, 'envoyerEmailDeConfirmationAuRecruteur');

    afterAll(async () => {
        await candidatRepository.deleteAll();
        await recruteurRepository.deleteAll();
        await entretienRepository.deleteAll();
    });

    beforeEach(async () => {
        await entretienRepository.deleteAll();
        envoyerEmailAuCandidatMock.mockReset();
        envoyerEmailAuRecruteurMock.mockReset();
    });

    it('Un entretien est crée quand toutes ses informations sont complètes', async () => {
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat-valide@mail.com', xp: 5});
        const localCandidatId = candidat.id;

        const recruteur = await SqlRecruteur.create({langage: 'java', email: 'recruteur-valide@mail.com', xp: 5});
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

        expect(envoyerEmailAuCandidatMock).toHaveBeenCalledWith('candidat-valide@mail.com');
        expect(envoyerEmailAuRecruteurMock).toHaveBeenCalledWith('recruteur-valide@mail.com');
    });

    it('Recruteur ne peut pas tester le candidat car les dates ne correspondent pas', async () => {
        // given
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const candidatId = candidat.id;

        const recruteur = await SqlRecruteur.create({
            langage: 'C#',
            email: 'autreLangageRecruteur@mail.com',
            xp: 5
        });
        const recruteurId = recruteur.id;

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

        expect(envoyerEmailAuCandidatMock).not.toHaveBeenCalled();
        expect(envoyerEmailAuRecruteurMock).not.toHaveBeenCalled();
    });

    it('Recruteur ne peut pas tester le candidat car les techno ne correspondent pas', async () => {
        // given
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const candidatId = candidat.id;

        const autreLangageRecruteur = await SqlRecruteur.create({
            langage: 'C#',
            email: 'autreLangageRecruteur@mail.com',
            xp: 5
        });
        const autreLangageRecruteurId = autreLangageRecruteur.id;

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

        expect(envoyerEmailAuCandidatMock).not.toHaveBeenCalled();
        expect(envoyerEmailAuRecruteurMock).not.toHaveBeenCalled();
    });

    it('Recruteur ne peut pas tester le candidat car le recruteur est moins expérimenté', async () => {
        // given
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const candidatId = candidat.id;

        const tropJeunerecruteur = await SqlRecruteur.create({
            langage: 'java',
            email: 'tropJeuneRecruteurId@mail.com',
            xp: 1
        });
        const tropJeuneRecruteurId = tropJeunerecruteur.id;

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

        expect(envoyerEmailAuCandidatMock).not.toHaveBeenCalled();
        expect(envoyerEmailAuRecruteurMock).not.toHaveBeenCalled();
    });

    it('Impossible de créer un entretien quand le candidat n existe pas', async () => {
        // given
        const recruteur = await SqlRecruteur.create({langage: 'java', email: 'recruteur@mail.com', xp: 5});
        const recruteurId = recruteur.id;

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
        expect(response.statusCode).toBe(404);

        const entretiens = await entretienRepository.retrieveAll();
        expect(entretiens.length).toBe(0);

        expect(envoyerEmailAuCandidatMock).not.toHaveBeenCalled();
        expect(envoyerEmailAuRecruteurMock).not.toHaveBeenCalled();
    });

    it('Impossible de créer un entretien quand le recruteur n existe pas', async () => {
        // given
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const candidatId = candidat.id;

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
        expect(response.statusCode).toBe(404);

        const entretiens = await entretienRepository.retrieveAll();
        expect(entretiens.length).toBe(0);

        expect(envoyerEmailAuCandidatMock).not.toHaveBeenCalled();
        expect(envoyerEmailAuRecruteurMock).not.toHaveBeenCalled();
    });

    it("Trouve un entretien existant", async () => {
        // given
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const candidatId = candidat.id;

        const recruteur = await SqlRecruteur.create({langage: 'java', email: 'recruteur@mail.com', xp: 5});
        const recruteurId = recruteur.id;

        const {id} = await SqlEntretien.create({
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
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const candidatId = candidat.id;

        const recruteur = await SqlRecruteur.create({langage: 'java', email: 'recruteur@mail.com', xp: 5});
        const recruteurId = recruteur.id;

        const {id} = await SqlEntretien.create({
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
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const candidatId = candidat.id;

        const recruteur = await SqlRecruteur.create({langage: 'java', email: 'recruteur@mail.com', xp: 5});
        const recruteurId = recruteur.id;
        const {id} = await SqlEntretien.create({
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
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const candidatId = candidat.id;

        const recruteur = await SqlRecruteur.create({langage: 'java', email: 'recruteur@mail.com', xp: 5});
        const recruteurId = recruteur.id;

        await SqlEntretien.create({
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
        const candidat = await SqlCandidat.create({langage: 'java', email: 'candidat@mail.com', xp: 5});
        const candidatId = candidat.id;

        const recruteur = await SqlRecruteur.create({langage: 'java', email: 'recruteur@mail.com', xp: 5});
        const recruteurId = recruteur.id;

        await SqlEntretien.create({
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
