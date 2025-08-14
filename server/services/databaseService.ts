import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'db');
const dbFilePath = path.resolve(dbPath, 'clients.db');

// Ensure the db directory exists
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

class DatabaseService {
  private db: Promise<any>;

  constructor() {
    this.db = this.init();
  }

  private async init() {
    const db = await open({
      filename: dbFilePath,
      driver: sqlite3.Database,
    });

    await this.createTables(db);
    return db;
  }

  private async createTables(db: any) {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS clients (
        bookingId TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        artist TEXT,
        event TEXT,
        eventDate TEXT,
        eventLocation TEXT,
        status TEXT,
        contractAmount REAL,
        currency TEXT,
        balance REAL DEFAULT 0,
        coordinator TEXT,
        metadata TEXT
      );
    `);
  }

  public getDb() {
    return this.db;
  }
}

export const databaseService = new DatabaseService();
