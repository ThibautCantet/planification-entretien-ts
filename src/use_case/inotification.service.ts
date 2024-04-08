export interface INotificationService {
    envoyerEmailDeConfirmationAuCandidat(email: string): Promise<Awaited<boolean>>;

    envoyerEmailDeConfirmationAuRecruteur(email: string): Promise<Awaited<boolean>>;
}
