class NotificationService {

    async envoyerEmailDeConfirmationAuCandidat(email: string) {
        return Promise.resolve(true);
    }

    async envoyerEmailDeConfirmationAuRecruteur(email: string) {
        return Promise.resolve(true);
    }
}

export default new NotificationService();
