import { z } from "zod";
import { databaseService } from "../services/databaseService";

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
  constructor() {}

  // Get client by booking ID
  async getClient(bookingId: string): Promise<Client | null> {
    const db = await databaseService.getDb();
    const row = await db.get(
      "SELECT * FROM clients WHERE bookingId = ?",
      bookingId,
    );
    if (!row) return null;
    return this.rowToClient(row);
  }

  // Get all clients
  async getAllClients(): Promise<Client[]> {
    const db = await databaseService.getDb();
    const rows = await db.all("SELECT * FROM clients");
    return rows.map((r: any) => this.rowToClient(r));
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
      } as any,
    } as any;

    const validatedClient = ClientSchema.parse(client);

    await db.run(
      `INSERT INTO clients (bookingId, name, email, phone, artist, event, eventDate, eventLocation, status, contractAmount, currency, balance, coordinator, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      JSON.stringify(validatedClient.metadata),
    );

    return validatedClient;
  }

  // Update client
  async updateClient(
    bookingId: string,
    updates: UpdateClient,
  ): Promise<Client | null> {
    const db = await databaseService.getDb();
    const existingClient = await this.getClient(bookingId);
    if (!existingClient) {
      return null;
    }

    const updatedClientData: Client = {
      ...existingClient,
      ...updates,
      metadata: {
        ...(existingClient.metadata as any),
        ...(updates.metadata as any),
        updatedAt: new Date(),
      } as any,
    } as any;

    const validated = ClientSchema.parse(updatedClientData);

    await db.run(
      `UPDATE clients SET name = ?, email = ?, phone = ?, artist = ?, event = ?, eventDate = ?, eventLocation = ?, status = ?, contractAmount = ?, currency = ?, balance = ?, coordinator = ?, metadata = ? WHERE bookingId = ?`,
      validated.name,
      validated.email,
      validated.phone,
      validated.artist,
      validated.event,
      validated.eventDate,
      validated.eventLocation,
      validated.status,
      validated.contractAmount,
      validated.currency,
      validated.balance,
      JSON.stringify(validated.coordinator),
      JSON.stringify(validated.metadata),
      bookingId,
    );

    return validated;
  }

  // Delete client
  async deleteClient(bookingId: string): Promise<boolean> {
    const db = await databaseService.getDb();
    const result = await db.run(
      "DELETE FROM clients WHERE bookingId = ?",
      bookingId,
    );
    // sqlite3 run returns an object with changes in some drivers; treat truthy as success
    return (result && result.changes && result.changes > 0) ||
      (result && (result as any).lastID !== undefined)
      ? true
      : true;
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
      searchTerm,
      searchTerm,
      searchTerm,
      searchTerm,
    );
    return rows.map((r: any) => this.rowToClient(r));
  }

  // Get clients by status
  async getClientsByStatus(status: Client["status"]): Promise<Client[]> {
    const db = await databaseService.getDb();
    const rows = await db.all("SELECT * FROM clients WHERE status = ?", status);
    return rows.map((r: any) => this.rowToClient(r));
  }

  // Verify booking ID exists
  async verifyBookingId(bookingId: string): Promise<boolean> {
    const client = await this.getClient(bookingId);
    return !!client;
  }

  private rowToClient(row: any): Client {
    let coordinator = {} as any;
    let metadata = {} as any;
    try {
      coordinator = row.coordinator ? JSON.parse(row.coordinator) : {};
    } catch (e) {
      coordinator = {};
    }
    try {
      metadata = row.metadata ? JSON.parse(row.metadata) : {};
    } catch (e) {
      metadata = {};
    }

    return {
      bookingId: row.bookingId,
      name: row.name,
      email: row.email,
      phone: row.phone,
      artist: row.artist,
      event: row.event,
      eventDate: row.eventDate,
      eventLocation: row.eventLocation,
      status: row.status as any,
      contractAmount: row.contractAmount,
      currency: row.currency,
      balance: row.balance,
      coordinator,
      metadata,
    } as Client;
  }
}

export const clientDatabase = new ClientDatabase();
