import { z } from "zod";

// Client data validation schema
export const ClientSchema = z.object({
  bookingId: z
    .string()
    .regex(/^[A-Z0-9]{8}$/, "Booking ID must be 8 alphanumeric characters"),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  artist: z.string().min(1, "Artist is required"),
  event: z.string().min(1, "Event is required"),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  status: z
    .enum(["active", "pending", "completed", "cancelled"])
    .default("active"),
  contractAmount: z.number().positive().optional(),
  currency: z.string().default("USD"),
  balance: z.number().default(0),
  coordinator: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string().optional(),
    department: z.string(),
  }),
  metadata: z
    .object({
      createdAt: z.date().default(() => new Date()),
      updatedAt: z.date().default(() => new Date()),
      lastLogin: z.date().optional(),
      isVerified: z.boolean().default(true),
      isDemo: z.boolean().default(false),
      priority: z.enum(["low", "medium", "high"]).default("medium"),
      notifications: z
        .object({
          emailReminders: z.boolean().default(true),
        })
        .default({ emailReminders: true }),
      crypto: z
        .object({
          walletAddress: z.string().optional(),
          linkedAt: z.date().optional(),
        })
        .optional(),
      paymentMethods: z
        .array(
          z.object({
            id: z.string(),
            type: z.enum(["Credit Card", "Bank Account", "Wire Transfer"]),
            name: z.string(),
            last4: z.string().optional(),
            brand: z.string().optional(),
            isDefault: z.boolean().default(false),
            status: z.enum(["active", "unavailable"]).default("active"),
          }),
        )
        .default([]),
      transactions: z
        .array(
          z.object({
            id: z.string(),
            amount: z.number(),
            currency: z.string(),
            status: z.enum(["pending", "paid", "failed"]),
            createdAt: z.date(),
            paymentMethodId: z.string(),
          }),
        )
        .default([]),
    })
    .optional(),
});

export type Client = z.infer<typeof ClientSchema>;

// Update client schema (partial updates allowed)
export const UpdateClientSchema = ClientSchema.partial().omit({
  bookingId: true,
});

// Client creation schema
export const CreateClientSchema = ClientSchema.omit({
  metadata: true,
}).extend({
  metadata: z
    .object({
      priority: z.enum(["low", "medium", "high"]).default("medium"),
    })
    .optional(),
});

export type CreateClient = z.infer<typeof CreateClientSchema>;
export type UpdateClient = z.infer<typeof UpdateClientSchema>;

// SQLite-based database
export class ClientDatabase {
  constructor() {

      {
        bookingId: "WME24001",
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1-555-0123",
        artist: "Taylor Swift",
        event: "Grammy Awards Performance",
        eventDate: "2024-02-04",
        eventLocation: "Crypto.com Arena, Los Angeles",
        status: "active",
        contractAmount: 2500000,
        currency: "USD",
        balance: 1000,
        coordinator: {
          name: "Sarah Johnson",
          email: "sarah.johnson@wme.com",
          phone: "+1-310-285-9000",
          department: "Music Division",
        },
        metadata: {
          priority: "high",
          notifications: { emailReminders: true },
          paymentMethods: [
            {
              id: "pm_1",
              type: "Credit Card",
              name: "Visa **** 4242",
              last4: "4242",
              brand: "Visa",
              isDefault: true,
              status: "active",
            },
          ],
          transactions: [],
        },
      },

  }

  // Get client by booking ID
  async getClient(bookingId: string): Promise<Client | null> {

  }

  // Get all clients
  async getAllClients(): Promise<Client[]> {
    const db = await databaseService.getDb();
    const rows = await db.all('SELECT * FROM clients');
    return rows.map(this.rowToClient);
  }

  // Create new client
  async createClient(clientData: CreateClient): Promise<Client> {
    const db = await databaseService.getDb();
    const client: Client = {
      ...clientData,
      balance: clientData.balance || 0,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
        priority: clientData.metadata?.priority || "medium",
        notifications: { emailReminders: true },
        paymentMethods: [],
        transactions: [],
      },
    };

    const validatedClient = ClientSchema.parse(client);

    await db.run(
      `INSERT INTO clients (bookingId, name, email, phone, artist, event, eventDate, eventLocation, status, contractAmount, currency, balance, coordinator, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      validatedClient.bookingId,
      validatedClient.name,
      validatedClient.email,
      validatedClient.phone,
      validatedClient.artist,
      validatedClient.event,
      validatedClient.eventDate,
      validatedClient.eventLocation,
      validatedClient.status,
      validatedClient.contractAmount,
      validatedClient.currency,
      validatedClient.balance,
      JSON.stringify(validatedClient.coordinator),
      JSON.stringify(validatedClient.metadata)
    );

    return validatedClient;
  }

  // Update client
  async updateClient(bookingId: string, updates: UpdateClient): Promise<Client | null> {
    const db = await databaseService.getDb();
    const existingClient = await this.getClient(bookingId);
    if (!existingClient) {
      return null;
    }

    const updatedClientData: Client = {
      ...existingClient,
      ...updates,
      metadata: {
        ...existingClient.metadata,
        ...updates.metadata,
        updatedAt: new Date(),
      },
    };


    return validatedClient;
  }

  // Delete client
  async deleteClient(bookingId: string): Promise<boolean> {

  }

  // Search clients
  async searchClients(query: string): Promise<Client[]> {
    const db = await databaseService.getDb();
    const searchTerm = `%${query.toLowerCase()}%`;
    const rows = await db.all(
      `SELECT * FROM clients WHERE
       LOWER(name) LIKE ? OR
       LOWER(artist) LIKE ? OR
       LOWER(event) LIKE ? OR
       LOWER(bookingId) LIKE ?`,
      searchTerm, searchTerm, searchTerm, searchTerm
    );
    return rows.map(this.rowToClient);
  }

  // Get clients by status
  async getClientsByStatus(status: Client["status"]): Promise<Client[]> {
    const db = await databaseService.getDb();
    const rows = await db.all('SELECT * FROM clients WHERE status = ?', status);
    return rows.map(this.rowToClient);
  }

  // Verify booking ID exists
  async verifyBookingId(bookingId: string): Promise<boolean> {
    const client = await this.getClient(bookingId);
    return !!client;
  }

  private rowToClient(row: any): Client {
    return {
      ...row,
      coordinator: JSON.parse(row.coordinator),
      metadata: JSON.parse(row.metadata),
    };
  }
}

export const clientDatabase = new ClientDatabase();
