import { RequestHandler } from "express";
import { z } from "zod";
import {
  clientDatabase,
  CreateClientSchema,
  UpdateClientSchema,
  ClientSchema,
  type Client,
} from "../models/Client";
import { emailService } from "../services/emailService";
import { globalClients } from "./booking-submission";

// Get all clients (admin endpoint)
export const getAllClients: RequestHandler = async (req, res) => {
  try {
    const { status, search } = req.query;

    let clients: Client[];

    if (search && typeof search === "string") {
      clients = await clientDatabase.searchClients(search);
    } else if (status && typeof status === "string") {
      clients = await clientDatabase.getClientsByStatus(
        status as Client["status"],
      );
    } else {
      clients = await clientDatabase.getAllClients();
    }

    // Include newly submitted bookings from globalClients
    const newBookings = Array.from(globalClients.values());
    const allClients = [...clients, ...newBookings].filter(client => !client.metadata?.isDemo);

    // Apply filtering if needed
    let filteredClients = allClients;
    if (status && typeof status === "string") {
      filteredClients = allClients.filter((client) => client.status === status);
    }
    if (search && typeof search === "string") {
      const searchLower = search.toLowerCase();
      filteredClients = allClients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchLower) ||
          client.artist.toLowerCase().includes(searchLower) ||
          client.event.toLowerCase().includes(searchLower) ||
          client.bookingId.toLowerCase().includes(searchLower),
      );
    }

    // Remove sensitive data for list view
    const clientList = filteredClients.map((client) => ({
      bookingId: client.bookingId,
      name: client.name,
      artist: client.artist,
      event: client.event,
      status: client.status,
      eventDate: client.eventDate,
      coordinator: client.coordinator.name,
      priority: client.metadata?.priority,
      lastLogin: client.metadata?.lastLogin,
      createdAt: client.metadata?.createdAt,
    }));

    res.json({
      success: true,
      data: {
        clients: clientList,
        total: clientList.length,
      },
    });
  } catch (error) {
    console.error("Get clients error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve clients",
    });
  }
};

// Get single client by booking ID
export const getClient: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId || !bookingId.match(/^[A-Z0-9]{8}$/i)) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking ID format",
      });
    }

    let client = await clientDatabase.getClient(bookingId);

    // If not found in database, check new bookings
    if (!client) {
      client = globalClients.get(bookingId);
    }

    if (!client) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: { client },
    });
  } catch (error) {
    console.error("Get client error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve client",
    });
  }
};

// Create new client
export const createClient: RequestHandler = async (req, res) => {
  try {
    const clientData = CreateClientSchema.parse(req.body);

    const newClient = await clientDatabase.createClient(clientData);

    // Send welcome email
    await emailService.sendWelcomeEmail(newClient.email, newClient.name, newClient.bookingId);

    // Emit WebSocket event
    (req as any).io.emit("new-client", newClient);

    res.status(201).json({
      success: true,
      data: {
        client: newClient,
        message: "Client created successfully",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid client data",
        details: error.errors,
      });
    }

    if (
      error instanceof Error &&
      error.message === "Booking ID already exists"
    ) {
      return res.status(409).json({
        success: false,
        error: "Booking ID already exists",
      });
    }

    console.error("Create client error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create client",
    });
  }
};

// Update client
export const updateClient: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId || !bookingId.match(/^[A-Z0-9]{8}$/i)) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking ID format",
      });
    }

    const updates = UpdateClientSchema.parse(req.body);

    const updatedClient = await clientDatabase.updateClient(bookingId, updates);

    if (!updatedClient) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: {
        client: updatedClient,
        message: "Client updated successfully",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid update data",
        details: error.errors,
      });
    }

    console.error("Update client error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update client",
    });
  }
};

// Delete client
export const deleteClient: RequestHandler = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId || !bookingId.match(/^[A-Z0-9]{8}$/i)) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking ID format",
      });
    }

    const deleted = await clientDatabase.deleteClient(bookingId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Client not found",
      });
    }

    res.json({
      success: true,
      data: {
        message: "Client deleted successfully",
        bookingId,
      },
    });
  } catch (error) {
    console.error("Delete client error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete client",
    });
  }
};

// Bulk operations
export const bulkUpdateClients: RequestHandler = async (req, res) => {
  try {
    const { bookingIds, updates } = req.body;

    if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid booking IDs array",
      });
    }

    const validatedUpdates = UpdateClientSchema.parse(updates);
    const results = [];

    for (const bookingId of bookingIds) {
      try {
        const updated = await clientDatabase.updateClient(
          bookingId,
          validatedUpdates,
        );
        results.push({
          bookingId,
          success: !!updated,
          client: updated,
        });
      } catch (error) {
        results.push({
          bookingId,
          success: false,
          error: error instanceof Error ? error.message : "Update failed",
        });
      }
    }

    res.json({
      success: true,
      data: {
        results,
        updated: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Invalid update data",
        details: error.errors,
      });
    }

    console.error("Bulk update error:", error);
    res.status(500).json({
      success: false,
      error: "Bulk update failed",
    });
  }
};

// Generate new booking ID
export const generateBookingId: RequestHandler = async (req, res) => {
  try {
    let bookingId: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      // Generate random 8-character booking ID
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      bookingId = "";
      for (let i = 0; i < 8; i++) {
        bookingId += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      attempts++;
    } while (
      (await clientDatabase.verifyBookingId(bookingId)) &&
      attempts < maxAttempts
    );

    if (attempts >= maxAttempts) {
      return res.status(500).json({
        success: false,
        error: "Unable to generate unique booking ID",
      });
    }

    res.json({
      success: true,
      data: { bookingId },
    });
  } catch (error) {
    console.error("Generate booking ID error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate booking ID",
    });
  }
};
