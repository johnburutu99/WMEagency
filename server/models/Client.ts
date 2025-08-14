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
      priority: z.enum(["low", "medium", "high"]).default("medium"),
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

// In-memory database (replace with real database in production)
export class ClientDatabase {
  private clients: Map<string, Client> = new Map();

  constructor() {
    // Initialize with sample data
    this.seedDatabase();
  }

  private seedDatabase() {
    const sampleClients: Client[] = [
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
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-15"),
          isVerified: true,
          priority: "high",
        },
      },
      {
        bookingId: "WME24002",
        name: "Jane Smith",
        email: "jane.smith@email.com",
        phone: "+1-555-0124",
        artist: "Dwayne Johnson",
        event: "Fast X Premiere",
        eventDate: "2024-01-15",
        eventLocation: "TCL Chinese Theatre, Hollywood",
        status: "pending",
        contractAmount: 750000,
        currency: "USD",
        balance: 0,
        coordinator: {
          name: "Michael Chen",
          email: "michael.chen@wme.com",
          phone: "+1-310-285-9001",
          department: "Film & TV Division",
        },
        metadata: {
          createdAt: new Date("2024-01-05"),
          updatedAt: new Date("2024-01-10"),
          isVerified: true,
          priority: "medium",
        },
      },
      {
        bookingId: "WME24003",
        name: "Mike Johnson",
        email: "mike.johnson@email.com",
        artist: "Zendaya",
        event: "Vogue Photoshoot",
        eventDate: "2024-01-22",
        eventLocation: "Conde Nast Studios, NYC",
        status: "completed",
        contractAmount: 150000,
        currency: "USD",
        balance: 500,
        coordinator: {
          name: "Emma Williams",
          email: "emma.williams@wme.com",
          phone: "+1-310-285-9002",
          department: "Digital & Brand Partnerships",
        },
        metadata: {
          createdAt: new Date("2024-01-08"),
          updatedAt: new Date("2024-01-22"),
          isVerified: true,
          priority: "low",
        },
      },
      {
        bookingId: "ABC12345",
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        artist: "Ryan Reynolds",
        event: "Press Tour Services",
        eventDate: "2024-03-15",
        eventLocation: "Various Locations",
        status: "active",
        contractAmount: 1200000,
        currency: "USD",
        balance: 250,
        coordinator: {
          name: "David Park",
          email: "david.park@wme.com",
          phone: "+1-310-285-9003",
          department: "Legal Affairs",
        },
        metadata: {
          createdAt: new Date("2024-01-20"),
          updatedAt: new Date("2024-01-25"),
          isVerified: true,
          priority: "high",
        },
      },
      {
        bookingId: "XYZ98765",
        name: "David Chen",
        email: "david.chen@email.com",
        artist: "Chris Evans",
        event: "Marvel Contract Signing",
        eventDate: "2024-02-20",
        eventLocation: "Marvel Studios, Burbank",
        status: "active",
        contractAmount: 950000,
        currency: "USD",
        balance: 750,
        coordinator: {
          name: "Jessica Rivera",
          email: "jessica.rivera@wme.com",
          phone: "+1-310-285-9004",
          department: "Global Markets",
        },
        metadata: {
          createdAt: new Date("2024-01-18"),
          updatedAt: new Date("2024-01-30"),
          isVerified: true,
          priority: "medium",
        },
      },
    ];

    sampleClients.forEach((client) => {
      this.clients.set(client.bookingId, client);
    });
  }

  // Get client by booking ID
  async getClient(bookingId: string): Promise<Client | null> {
    const client = this.clients.get(bookingId.toUpperCase());
    if (client) {
      // Update last login
      client.metadata = {
        ...client.metadata,
        lastLogin: new Date(),
        updatedAt: new Date(),
      };
      this.clients.set(bookingId.toUpperCase(), client);
    }
    return client || null;
  }

  // Get all clients
  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  // Create new client
  async createClient(clientData: CreateClient): Promise<Client> {
    const client: Client = {
      ...clientData,
      balance: clientData.balance || 0,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: true,
        priority: clientData.metadata?.priority || "medium",
      },
    };

    // Validate data
    const validatedClient = ClientSchema.parse(client);

    // Check if booking ID already exists
    if (this.clients.has(validatedClient.bookingId)) {
      throw new Error("Booking ID already exists");
    }

    this.clients.set(validatedClient.bookingId, validatedClient);
    return validatedClient;
  }

  // Update client
  async updateClient(
    bookingId: string,
    updates: UpdateClient,
  ): Promise<Client | null> {
    const existingClient = this.clients.get(bookingId.toUpperCase());
    if (!existingClient) {
      return null;
    }

    const updatedClient: Client = {
      ...existingClient,
      ...updates,
      metadata: {
        ...existingClient.metadata,
        ...updates.metadata,
        updatedAt: new Date(),
      },
    };

    // Validate updated data
    const validatedClient = ClientSchema.parse(updatedClient);
    this.clients.set(bookingId.toUpperCase(), validatedClient);
    return validatedClient;
  }

  // Delete client
  async deleteClient(bookingId: string): Promise<boolean> {
    return this.clients.delete(bookingId.toUpperCase());
  }

  // Search clients
  async searchClients(query: string): Promise<Client[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.clients.values()).filter(
      (client) =>
        client.name.toLowerCase().includes(searchTerm) ||
        client.artist.toLowerCase().includes(searchTerm) ||
        client.event.toLowerCase().includes(searchTerm) ||
        client.bookingId.toLowerCase().includes(searchTerm),
    );
  }

  // Get clients by status
  async getClientsByStatus(status: Client["status"]): Promise<Client[]> {
    return Array.from(this.clients.values()).filter(
      (client) => client.status === status,
    );
  }

  // Verify booking ID exists
  async verifyBookingId(bookingId: string): Promise<boolean> {
    return this.clients.has(bookingId.toUpperCase());
  }
}

// Export singleton instance
export const clientDatabase = new ClientDatabase();
