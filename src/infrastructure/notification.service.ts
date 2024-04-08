import { INotificationService } from '../use_case/inotification.service';

class NotificationService implements INotificationService {

    async envoyerEmailDeConfirmationAuCandidat(email: string) {
        return Promise.resolve(true);
    }

    async envoyerEmailDeConfirmationAuRecruteur(email: string) {
        return Promise.resolve(true);
    }
}

export default new NotificationService();
