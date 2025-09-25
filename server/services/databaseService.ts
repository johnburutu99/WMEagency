import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";

const dbPath = path.resolve(process.cwd(), "db");
const dbFilePath = path.resolve(dbPath, "clients.json");

if (!existsSync(dbPath)) {
  mkdirSync(dbPath);
}

async function readDb(): Promise<any[]> {
  try {
    const content = await fs.readFile(dbFilePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch (err) {
    // If file doesn't exist or is invalid, initialize with empty array
    await fs.writeFile(dbFilePath, "[]", "utf-8");
    return [];
  }
}

async function writeDb(data: any[]) {
  await fs.writeFile(dbFilePath, JSON.stringify(data, null, 2), "utf-8");
}

class DatabaseService {
  public async getDb() {
    // Return an object with sqlite-like methods used by the app
    return {
      all: async (sql: string, ...params: any[]) => {
        const clients = await readDb();
        const q = sql.toLowerCase();

        if (
          q.includes("lower(name) like") ||
          q.includes("lower(artist) like") ||
          q.includes("lower(event) like")
        ) {
          const term = (params[0] || "").replace(/%/g, "").toLowerCase();
          return clients.filter((c: any) => {
            return (
              (c.name || "").toLowerCase().includes(term) ||
              (c.artist || "").toLowerCase().includes(term) ||
              (c.event || "").toLowerCase().includes(term) ||
              (c.bookingId || "").toLowerCase().includes(term)
            );
          });
        }

        if (q.includes("where status =")) {
          const status = params[0];
          return clients.filter((c: any) => c.status === status);
        }

        // default: return all clients
        return clients;
      },

      get: async (sql: string, ...params: any[]) => {
        const clients = await readDb();
        const q = sql.toLowerCase();
        if (q.includes("where bookingid =")) {
          const id = params[0];
          return clients.find((c: any) => c.bookingId === id) ?? null;
        }
        return null;
      },

      run: async (sql: string, ...params: any[]) => {
        const clients = await readDb();
        const q = sql.toLowerCase();

        if (q.startsWith("insert into clients")) {
          // Expected order in insert from code: bookingId, name, email, phone, artist, event, eventDate, eventLocation, status, contractAmount, currency, balance, coordinator, metadata
          const [
            bookingId,
            name,
            email,
            phone,
            artist,
            eventVal,
            eventDate,
            eventLocation,
            status,
            contractAmount,
            currency,
            balance,
            coordinatorJson,
            metadataJson,
          ] = params;
          const coordinator = coordinatorJson
            ? JSON.parse(coordinatorJson)
            : {};
          const metadata = metadataJson ? JSON.parse(metadataJson) : {};
          const client = {
            bookingId,
            name,
            email,
            phone,
            artist,
            event: eventVal,
            eventDate,
            eventLocation,
            status,
            contractAmount,
            currency,
            balance,
            coordinator,
            metadata,
          };
          clients.push(client);
          await writeDb(clients);
          return { changes: 1 };
        }

        if (q.startsWith("update clients set")) {
          // Last param is bookingId
          const bookingId = params[params.length - 1];
          const existing = clients.find((c: any) => c.bookingId === bookingId);
          if (!existing) return { changes: 0 };

          // We expect params in the same order as the update in the model
          // name,email,phone,artist,event,eventDate,eventLocation,status,contractAmount,currency,balance,coordinator,metadata, bookingId
          const [
            name,
            email,
            phone,
            artist,
            eventVal,
            eventDate,
            eventLocation,
            status,
            contractAmount,
            currency,
            balance,
            coordinatorJson,
            metadataJson,
          ] = params.slice(0, params.length - 1);
          existing.name = name;
          existing.email = email;
          existing.phone = phone;
          existing.artist = artist;
          existing.event = eventVal;
          existing.eventDate = eventDate;
          existing.eventLocation = eventLocation;
          existing.status = status;
          existing.contractAmount = contractAmount;
          existing.currency = currency;
          existing.balance = balance;
          try {
            existing.coordinator = coordinatorJson
              ? JSON.parse(coordinatorJson)
              : existing.coordinator;
          } catch (e) {
            /* ignore */
          }
          try {
            existing.metadata = metadataJson
              ? JSON.parse(metadataJson)
              : existing.metadata;
          } catch (e) {
            /* ignore */
          }

          await writeDb(clients);
          return { changes: 1 };
        }

        if (q.startsWith("delete from clients")) {
          const bookingId = params[0];
          const before = clients.length;
          const filtered = clients.filter(
            (c: any) => c.bookingId !== bookingId,
          );
          await writeDb(filtered);
          return { changes: before - filtered.length };
        }

        // fallback no-op
        return { changes: 0 };
      },

      exec: async (_sql: string) => {
        // no-op for json-backed store
        return;
      },
    };
  }
}

export const databaseService = new DatabaseService();
