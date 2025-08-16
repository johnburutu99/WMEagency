// This file must be imported first to set up Node.js polyfills
import { Buffer } from 'buffer';
import util from 'util';
import process from 'process';

// Set all Node.js globals for crypto/ethereum dependencies
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
  (window as any).global = globalThis;
  (window as any).util = util;
  (window as any).process = process;
}

if (typeof globalThis !== 'undefined') {
  (globalThis as any).Buffer = Buffer;
  (globalThis as any).util = util;
  (globalThis as any).process = process;
  if (typeof (globalThis as any).global === 'undefined') {
    (globalThis as any).global = globalThis;
  }
}

// Export for explicit imports
export { Buffer, util, process };
