import { Buffer } from "buffer";

// Polyfill Buffer and global for browser environment
if (typeof window !== "undefined") {
  window.Buffer = Buffer;
  (window as any).global = globalThis;
}

// Also set global polyfill at globalThis level
if (typeof globalThis !== "undefined") {
  (globalThis as any).Buffer = Buffer;
  if (typeof (globalThis as any).global === "undefined") {
    (globalThis as any).global = globalThis;
  }
}
