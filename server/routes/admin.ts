import { RequestHandler } from "express";
import { clientDatabase } from "../models/Client";

// Get dashboard statistics
export const getDashboardStats: RequestHandler = async (req, res) => {
  try {
    const allClients = await clientDatabase.getAllClients();

    const stats = {
      total: allClients.length,
      active: allClients.filter((c) => c.status === "active").length,
      pending: allClients.filter((c) => c.status === "pending").length,
      completed: allClients.filter((c) => c.status === "completed").length,
      cancelled: allClients.filter((c) => c.status === "cancelled").length,
      highPriority: allClients.filter((c) => c.metadata?.priority === "high")
        .length,
      mediumPriority: allClients.filter(
        (c) => c.metadata?.priority === "medium",
      ).length,
      lowPriority: allClients.filter((c) => c.metadata?.priority === "low")
        .length,
      totalRevenue: allClients.reduce(
        (sum, c) => sum + (c.contractAmount || 0),
        0,
      ),
      avgContractValue: allClients.length
        ? allClients.reduce((sum, c) => sum + (c.contractAmount || 0), 0) /
          allClients.length
        : 0,
    };

    // Recent activity
    const recentClients = allClients
      .sort(
        (a, b) =>
          (b.metadata?.updatedAt?.getTime() || 0) -
          (a.metadata?.updatedAt?.getTime() || 0),
      )
      .slice(0, 10)
      .map((client) => ({
        bookingId: client.bookingId,
        name: client.name,
        artist: client.artist,
        event: client.event,
        status: client.status,
        updatedAt: client.metadata?.updatedAt,
        lastLogin: client.metadata?.lastLogin,
      }));

    // Revenue by month (mock data for demo)
    const revenueByMonth = [
      { month: "Jan", revenue: 2500000 },
      { month: "Feb", revenue: 3200000 },
      { month: "Mar", revenue: 2800000 },
      { month: "Apr", revenue: 4100000 },
      { month: "May", revenue: 3600000 },
      { month: "Jun", revenue: 4800000 },
    ];

    // Top artists (mock data)
    const artistFrequency = allClients.reduce(
      (acc, client) => {
        acc[client.artist] = (acc[client.artist] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topArtists = Object.entries(artistFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([artist, count]) => ({ artist, bookings: count }));

    res.json({
      success: true,
      data: {
        stats,
        recentActivity: recentClients,
        revenueByMonth,
        topArtists,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get dashboard statistics",
    });
  }
};

export const sendCommandToClient: RequestHandler = async (req, res) => {
  try {
    const { bookingId, command, payload } = req.body;
    (req as any).io.to(bookingId).emit("execute-command", { command, payload });
    res.json({ success: true, message: "Command sent to client" });
  } catch (error) {
    console.error("Send command error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

// Get client analytics
export const getClientAnalytics: RequestHandler = async (req, res) => {
  try {
    const querySchema = z.object({
      period: z.enum(["7d", "30d", "90d"]).default("30d"),
    });

    const validation = querySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: validation.error.errors,
      });
    }
    const { period } = validation.data;
    const allClients = await clientDatabase.getAllClients();

    // Calculate date range
    const now = new Date();
    const daysBack = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    const analytics = {
      totalClients: allClients.length,
      newClients: allClients.filter(
        (c) => c.metadata?.createdAt && c.metadata.createdAt >= startDate,
      ).length,
      activeClients: allClients.filter(
        (c) => c.metadata?.lastLogin && c.metadata.lastLogin >= startDate,
      ).length,
      conversionRate: 0.85, // Mock conversion rate

      // Status distribution
      statusDistribution: {
        active: allClients.filter((c) => c.status === "active").length,
        pending: allClients.filter((c) => c.status === "pending").length,
        completed: allClients.filter((c) => c.status === "completed").length,
        cancelled: allClients.filter((c) => c.status === "cancelled").length,
      },

      // Priority distribution
      priorityDistribution: {
        high: allClients.filter((c) => c.metadata?.priority === "high").length,
        medium: allClients.filter((c) => c.metadata?.priority === "medium")
          .length,
        low: allClients.filter((c) => c.metadata?.priority === "low").length,
      },

      // Revenue analytics
      revenue: {
        total: allClients.reduce((sum, c) => sum + (c.contractAmount || 0), 0),
        average: allClients.length
          ? allClients.reduce((sum, c) => sum + (c.contractAmount || 0), 0) /
            allClients.length
          : 0,
        byStatus: {
          active: allClients
            .filter((c) => c.status === "active")
            .reduce((sum, c) => sum + (c.contractAmount || 0), 0),
          pending: allClients
            .filter((c) => c.status === "pending")
            .reduce((sum, c) => sum + (c.contractAmount || 0), 0),
          completed: allClients
            .filter((c) => c.status === "completed")
            .reduce((sum, c) => sum + (c.contractAmount || 0), 0),
        },
      },
    };

    res.json({
      success: true,
      data: { analytics, period },
    });
  } catch (error) {
    console.error("Client analytics error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get client analytics",
    });
  }
};

import { z } from "zod";

// Export client data
export const exportClients: RequestHandler = async (req, res) => {
  try {
    const querySchema = z.object({
      format: z.enum(["json", "csv"]).default("json"),
      status: z.string().optional(),
    });

    const validation = querySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Invalid query parameters",
        details: validation.error.errors,
      });
    }

    const { format, status } = validation.data;

    let clients = await clientDatabase.getAllClients();

    if (status && typeof status === "string") {
      clients = clients.filter((c) => c.status === status);
    }

    // Remove sensitive data
    const exportData = clients.map((client) => ({
      bookingId: client.bookingId,
      name: client.name,
      artist: client.artist,
      event: client.event,
      eventDate: client.eventDate,
      eventLocation: client.eventLocation,
      status: client.status,
      contractAmount: client.contractAmount,
      currency: client.currency,
      coordinator: client.coordinator.name,
      department: client.coordinator.department,
      priority: client.metadata?.priority,
      createdAt: client.metadata?.createdAt,
      lastLogin: client.metadata?.lastLogin,
    }));

    if (format === "csv") {
      if (exportData.length === 0) {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="wme-clients-empty-${new Date().toISOString().split("T")[0]}.csv"`,
        );
        return res.send("No data to export.");
      }
      // Convert to CSV
      const headers = Object.keys(exportData[0] || {});
      const csvContent = [
        headers.join(","),
        ...exportData.map((row) =>
          headers
            .map((header) =>
              JSON.stringify(row[header as keyof typeof row] || ""),
            )
            .join(","),
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="wme-clients-${new Date().toISOString().split("T")[0]}.csv"`,
      );
      res.send(csvContent);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: {
          clients: exportData,
          total: exportData.length,
          exportedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Export clients error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to export client data",
    });
  }
};

// System health check
export const getSystemHealth: RequestHandler = async (req, res) => {
  try {
    const allClients = await clientDatabase.getAllClients();

    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      database: {
        status: "connected",
        clients: allClients.length,
      },
      memory: {
        used: process.memoryUsage().heapUsed / 1024 / 1024, // MB
        total: process.memoryUsage().heapTotal / 1024 / 1024, // MB
      },
      uptime: process.uptime(),
    };

    res.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error("System health error:", error);
    res.status(500).json({
      success: false,
      error: "System health check failed",
      data: {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
    });
  }
};
