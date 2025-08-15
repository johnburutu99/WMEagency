import { clientDatabase } from "../models/Client";
import { emailService } from "./emailService";

class ReminderService {
  public async checkAndSendReminders() {
    const clients = await clientDatabase.getAllClients();
    const now = new Date();

    for (const client of clients) {
      if (
        client.metadata?.notifications?.emailReminders &&
        client.balance > 0 &&
        client.metadata?.createdAt
      ) {
        const daysSinceCreation =
          (now.getTime() - client.metadata.createdAt.getTime()) /
          (1000 * 60 * 60 * 24);
        if (daysSinceCreation > 4) {
          await emailService.sendReminderEmail(
            client.email,
            client.name,
            client.balance,
          );
        }
      }
    }
  }
}

export const reminderService = new ReminderService();
